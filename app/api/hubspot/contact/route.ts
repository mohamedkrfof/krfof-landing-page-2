import { NextRequest, NextResponse } from 'next/server';
import { IPGeolocationService } from '../../../../lib/ipGeolocation';

interface HubSpotContactData {
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
  // Browser data for Meta tracking
  fbp?: string; // Facebook browser ID
  fbc?: string; // Facebook click ID
  user_agent?: string;
  referrer?: string;
}

interface MetaEventPayload {
  event_name: string;
  event_time: number;
  event_id: string;
  user_data: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    ct?: string;
    st?: string;
    zp?: string;
    country?: string;
    db?: string;
    external_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    lead_source?: string;
    lead_status?: string;
    hubspot_contact_id?: string;
  };
  event_source_url: string;
  action_source: string;
}

// Hash data for Meta Pixel (SHA-256)
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Send event to Meta Conversions API
async function sendToMeta(eventData: MetaEventPayload): Promise<any> {
  const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.META_DATASET_ID}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      data: [eventData],
      test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Meta API error: ${response.status} - ${errorData}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const data: HubSpotContactData = await request.json();
    console.log('📝 Processing HubSpot contact creation:', data.email);

    // Get client IP for geolocation
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Get geographic data from IP address
    const geoService = IPGeolocationService.getInstance();
    const geoData = await geoService.getLocationFromIP(clientIP);
    const geoForMeta = geoData ? geoService.sanitizeForMeta(geoData) : {};

    console.log('🌍 IP Geolocation:', { ip: clientIP, geo: geoForMeta });

    // 1. Create/Update HubSpot Contact
    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ');

    const hubspotProperties = {
      email: data.email,
      firstname: firstName,
      lastname: lastName || '',
      phone: data.phone || '',
      // Use IP-based geolocation data with form fallbacks
      city: geoForMeta.city || data.city || '',
      state: geoForMeta.state || '',
      zip_code: geoForMeta.zip || '',
      country: geoForMeta.country || 'sa',
      // Additional geolocation data for CRM
      ip_address: clientIP,
      timezone: geoData?.timezone || '',
      isp: geoData?.isp || '',
      lead_source: data.utm_source || 'website',
      lead_medium: data.utm_medium || 'organic',
      lead_campaign: data.utm_campaign || '',
      lead_magnet_name: data.leadMagnet || 'رفوف تخزين معدنية',
      quantity_requested: data.quantity || '1',
      lead_status: 'new',
      lifecycle_stage: 'lead',
      last_form_submission: data.timestamp || new Date().toISOString(),
    };

    const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: hubspotProperties,
      }),
    });

    let hubspotContactId = null;
    if (hubspotResponse.ok) {
      const hubspotData = await hubspotResponse.json();
      hubspotContactId = hubspotData.id;
      console.log('✅ HubSpot contact created/updated:', hubspotContactId);
    } else {
      console.error('❌ HubSpot contact creation failed:', await hubspotResponse.text());
    }

    // 2. Send Lead Event to Meta Conversions API
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
        const metaEventData: MetaEventPayload = {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      user_data: {
        em: data.email ? await hashData(data.email) : undefined,
        ph: data.phone ? await hashData(data.phone.replace(/\D/g, '')) : undefined,
        fn: firstName ? await hashData(firstName) : undefined,
        ln: lastName ? await hashData(lastName) : undefined,
        // Use IP-based geolocation data (hashed)
        ct: geoForMeta.city ? await hashData(geoForMeta.city) : (data.city ? await hashData(data.city) : undefined),
        st: geoForMeta.state ? await hashData(geoForMeta.state) : undefined,
        zp: geoForMeta.zip ? await hashData(geoForMeta.zip) : undefined,
        country: geoForMeta.country ? await hashData(geoForMeta.country) : await hashData('sa'),
        external_id: hubspotContactId ? await hashData(hubspotContactId) : undefined,
        client_ip_address: clientIP,
        client_user_agent: request.headers.get('user-agent') || undefined,
        fbc: data.fbc || undefined,
        fbp: data.fbp || undefined,
      },
      custom_data: {
        currency: 'SAR',
        value: parseFloat(data.quantity || '1') * 100, // Estimated lead value
        content_name: data.leadMagnet || 'رفوف تخزين معدنية',
        content_category: 'storage_solutions',
        lead_source: data.utm_source || 'website',
        lead_status: 'new',
        hubspot_contact_id: hubspotContactId,
      },
      event_source_url: request.headers.get('referer') || 'https://krfof-leadmagnet.vercel.app',
      action_source: 'website',
    };

    const metaResponse = await sendToMeta(metaEventData);
    console.log('✅ Meta Lead event sent:', eventId);

    // 3. Store lead data for future status updates
    const leadRecord = {
      hubspot_contact_id: hubspotContactId,
      meta_event_id: eventId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      lead_status: 'new',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };

    // Store in your database or external service for tracking
    // This enables future status updates to Meta
    console.log('📊 Lead record for tracking:', leadRecord);

    return NextResponse.json({
      success: true,
      hubspot_contact_id: hubspotContactId,
      meta_event_id: eventId,
      message: 'Contact created and tracking initiated',
    });

  } catch (error) {
    console.error('❌ HubSpot + Meta integration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 