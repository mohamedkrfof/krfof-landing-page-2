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

    const hubspotResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        properties: {
          email: leadData.email,
          firstname: firstName,
          lastname: lastName,
          phone: leadData.phone,
          company: leadData.company,
          message: leadData.message || '',
          lead_source: 'website',
          lead_magnet: leadData.leadMagnet || 'دليل حلول التخزين المتقدمة',
          hs_lead_status: 'NEW',
          lead_score: leadScore.toString(),
          lead_timestamp: leadData.timestamp,
          device_info: JSON.stringify(leadData.deviceInfo),
          page_url: leadData.url,
          referrer: leadData.referrer,
          event_id: leadData.eventId,
          // Arabic market specific
          market_region: 'saudi_arabia',
          language_preference: 'arabic',
          business_type: determineBusinessType(leadData.company)
        }
      })
    });

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API error:', errorText);
      throw new Error(`HubSpot API error: ${hubspotResponse.status}`);
    }

    const result = await hubspotResponse.json();
    
    // Optionally create a note with additional details
    if (result.id && leadData.message) {
      await createHubSpotNote(result.id, leadData);
    }

    return NextResponse.json({ 
      success: true, 
      contactId: result.id,
      leadScore 
    });

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
async function createHubSpotNote(contactId: string, leadData: LeadData) {
  try {
    const noteContent = `
تفاصيل العميل المحتمل:
- الرسالة: ${leadData.message}
- مصدر الزيارة: ${leadData.referrer || 'مباشر'}
- معلومات الجهاز: ${leadData.deviceInfo?.platform || 'غير محدد'}
- وقت التسجيل: ${new Date(leadData.timestamp || '').toLocaleString('ar-SA')}
- معرف الحدث: ${leadData.eventId}
    `.trim();

    await fetch(`https://api.hubapi.com/crm/v3/objects/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`
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