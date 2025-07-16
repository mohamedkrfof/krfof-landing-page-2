import { NextRequest, NextResponse } from 'next/server';

interface HubSpotFormData {
  email: string;
  phone?: string;
  name: string;
  quantity?: string;
  city?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  leadMagnet?: string;
  timestamp?: string;
  company?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: HubSpotFormData = await request.json();
    console.log('📝 Processing HubSpot Forms API submission:', data.email);

    // Get environment variables
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formId = process.env.HUBSPOT_FORM_ID;

    if (!portalId || !formId) {
      throw new Error('Missing HubSpot Portal ID or Form ID in environment variables');
    }

    // Parse name into first and last name
    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ');

    // Prepare form data for HubSpot Forms API
    const formData = {
      submittedAt: Date.now(),
      fields: [
        {
          objectTypeId: "0-1",
          name: "email",
          value: data.email
        },
        {
          objectTypeId: "0-1", 
          name: "firstname",
          value: firstName
        },
        {
          objectTypeId: "0-1",
          name: "lastname", 
          value: lastName || ''
        },
        {
          objectTypeId: "0-1",
          name: "phone",
          value: data.phone || ''
        },
        {
          objectTypeId: "0-1",
          name: "company",
          value: data.company || `الكمية المطلوبة: ${data.quantity || '1'}`
        },
        {
          objectTypeId: "0-1",
          name: "message",
          value: data.message || `طلب عرض أسعار رفوف جديدة - الكمية: ${data.quantity || '1'}`
        }
      ],
      context: {
        hutk: request.cookies.get('hubspotutk')?.value,
        pageUri: data.utm_source ? `${request.headers.get('referer')}?utm_source=${data.utm_source}` : request.headers.get('referer'),
        pageName: 'رفوف تخزين معدنية - طلب عرض أسعار'
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "أوافق على معالجة بياناتي الشخصية",
          communications: [
            {
              value: true,
              subscriptionTypeId: 999,
              text: "أوافق على تلقي اتصالات تسويقية"
            }
          ]
        }
      }
    };

    // Submit to HubSpot Forms API
    const hubspotResponse = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (hubspotResponse.ok) {
      const hubspotResult = await hubspotResponse.json();
      console.log('✅ HubSpot Forms API submission successful:', hubspotResult.inlineMessage);
      
      return NextResponse.json({
        success: true,
        method: 'forms_api',
        submission_id: hubspotResult.submissionId || 'unknown',
        message: 'Contact submitted successfully via HubSpot Forms API',
        hubspot_response: hubspotResult
      });
    } else {
      const errorText = await hubspotResponse.text();
      console.error('❌ HubSpot Forms API submission failed:', errorText);
      
      return NextResponse.json({
        success: false,
        method: 'forms_api',
        error: `HubSpot Forms API error: ${hubspotResponse.status} - ${errorText}`,
        details: errorText
      }, { status: hubspotResponse.status });
    }

  } catch (error) {
    console.error('❌ HubSpot Forms API integration error:', error);
    return NextResponse.json(
      { 
        success: false,
        method: 'forms_api',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 