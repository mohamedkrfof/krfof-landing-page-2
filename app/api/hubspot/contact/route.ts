import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  timestamp?: string;
  leadMagnet?: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  deviceInfo?: {
    platform?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();

    // Extract first and last name
    const nameParts = leadData.name?.split(' ') || [''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Calculate basic lead score
    const leadScore = calculateLeadScore(leadData);

    // Option 1: Forms API (works with developer accounts)
    const portalId = process.env.HUBSPOT_PORTAL_ID; // Your HubSpot Portal ID
    const formId = process.env.HUBSPOT_FORM_ID; // Your HubSpot Form ID
    
    if (portalId && formId) {
      // Try the EU endpoint first (since your form URL contains eu1)
      const apiUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
      
      const hubspotResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: [
            { name: 'email', value: leadData.email },
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName },
            { name: 'phone', value: leadData.phone },
            { name: 'company', value: leadData.company || '' },
            { name: 'message', value: leadData.message || '' },
            { name: 'jobtitle', value: leadData.quantity || '' }
          ],
          context: {
            pageUri: leadData.url || '',
            pageName: 'Lead Magnet Form'
          }
        })
      });

      if (!hubspotResponse.ok) {
        const errorText = await hubspotResponse.text();
        console.error('HubSpot Forms API error:', {
          status: hubspotResponse.status,
          statusText: hubspotResponse.statusText,
          url: apiUrl,
          portalId,
          formId,
          error: errorText
        });
        throw new Error(`HubSpot Forms API error: ${hubspotResponse.status} - ${errorText}`);
      }

      const result = await hubspotResponse.json();
      
      return NextResponse.json({ 
        success: true, 
        submissionId: result.id,
        leadScore,
        email: leadData.email,
        method: 'forms_api'
      });
    }

    // Option 2: Private App (requires paid HubSpot account)
    const privateAppToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
    
    if (privateAppToken) {
      const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${privateAppToken}`
        },
        body: JSON.stringify({
          properties: {
            email: leadData.email,
            firstname: firstName,
            lastname: lastName,
            phone: leadData.phone,
            company: leadData.company || '',
            message: leadData.message || '',
            hs_lead_status: 'NEW',
            website: leadData.url || '',
            jobtitle: leadData.quantity || '',
            hubspotscore: leadScore,
            lead_source: 'website_form',
            lead_source_detail: leadData.leadMagnet || 'lead_magnet',
            business_type: determineBusinessType(leadData.company || ''),
            market_region: 'saudi_arabia',
            preferred_language: 'arabic'
          }
        })
      });

      if (!hubspotResponse.ok) {
        const errorText = await hubspotResponse.text();
        console.error('HubSpot Private App API error:', errorText);
        throw new Error(`HubSpot Private App API error: ${hubspotResponse.status}`);
      }

      const result = await hubspotResponse.json();
      
      // Create note with additional details
      if (result.id && leadData.message) {
        await createHubSpotNote(result.id, leadData, privateAppToken);
      }

      return NextResponse.json({ 
        success: true, 
        contactId: result.id,
        leadScore,
        email: leadData.email,
        method: 'private_app'
      });
    }

    // If no HubSpot integration is configured
    return NextResponse.json({ 
      error: 'No HubSpot integration configured',
      details: 'Please set up either Forms API or Private App integration'
    }, { status: 400 });

  } catch (error) {
    console.error('HubSpot integration error:', error);
    return NextResponse.json({ 
      error: 'HubSpot sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Calculate basic lead score based on available data
function calculateLeadScore(leadData: LeadData): number {
  let score = 50; // Base score

  // Company name quality
  if (leadData.company && leadData.company.length > 5) {
    score += 10;
  }

  // Message indicates higher engagement
  if (leadData.message && leadData.message.length > 20) {
    score += 15;
  }

  // Saudi phone number (higher priority)
  if (leadData.phone && leadData.phone.includes('+966')) {
    score += 20;
  }

  // Professional email domain
  if (leadData.email && !leadData.email.includes('@gmail.com') && !leadData.email.includes('@hotmail.com')) {
    score += 10;
  }

  // Device and browser info (desktop = higher intent)
  if (leadData.deviceInfo) {
    if (leadData.deviceInfo.platform && !leadData.deviceInfo.platform.toLowerCase().includes('mobile')) {
      score += 5;
    }
  }

  return Math.min(100, Math.max(0, score));
}

// Determine business type from company name
function determineBusinessType(companyName: string): string {
  if (!companyName) return 'unknown';
  
  const company = companyName.toLowerCase();
  
  if (company.includes('مؤسسة') || company.includes('establishment')) return 'establishment';
  if (company.includes('شركة') || company.includes('company')) return 'company';
  if (company.includes('مصنع') || company.includes('factory')) return 'factory';
  if (company.includes('مستودع') || company.includes('warehouse')) return 'warehouse';
  if (company.includes('متجر') || company.includes('store')) return 'retail';
  
  return 'business';
}

// Create a note in HubSpot with additional details
async function createHubSpotNote(contactId: string, leadData: LeadData, token: string) {
  try {
    const noteContent = `
تفاصيل العميل المحتمل:
- الرسالة: ${leadData.message}
- مصدر الزيارة: ${leadData.referrer || 'مباشر'}
- معلومات الجهاز: ${leadData.deviceInfo?.platform || 'غير محدد'}
- وقت التسجيل: ${new Date(leadData.timestamp || '').toLocaleString('ar-SA')}
- معرف الحدث: ${leadData.eventId}
    `.trim();

    await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        properties: {
          hs_note_body: noteContent,
          hs_timestamp: new Date().toISOString()
        },
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }]
          }
        ]
      })
    });
  } catch (error) {
    console.error('Failed to create HubSpot note:', error);
  }
} 