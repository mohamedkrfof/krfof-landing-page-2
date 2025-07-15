import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface HubSpotWebhookEvent {
  eventId: number;
  subscriptionId: number;
  portalId: number;
  occurredAt: number;
  subscriptionType: string;
  attemptNumber: number;
  objectId: number;
  changeSource: string;
  changeFlag: string;
  propertyName?: string;
  propertyValue?: string;
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
    lead_status?: string;
    hubspot_contact_id?: string;
    hubspot_deal_id?: string;
    deal_stage?: string;
    deal_amount?: number;
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

// Get contact details from HubSpot
async function getHubSpotContact(contactId: string): Promise<any> {
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=email,firstname,lastname,phone,hs_lead_status,lifecyclestage,date_of_birth,city,state,zip,country`, {
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get HubSpot contact: ${response.status}`);
  }

  return response.json();
}

// Get deal details from HubSpot
async function getHubSpotDeal(dealId: string): Promise<any> {
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname,amount,dealstage,pipeline,closedate&associations=contacts`, {
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get HubSpot deal: ${response.status}`);
  }

  return response.json();
}

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!process.env.HUBSPOT_WEBHOOK_SECRET) {
    console.warn('No webhook secret configured');
    return true; // Allow for testing
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.HUBSPOT_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hubspot-signature-256') || '';
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature.replace('sha256=', ''))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const events: HubSpotWebhookEvent[] = JSON.parse(body);
    
    for (const event of events) {
      try {
        await processHubSpotEvent(event);
      } catch (error) {
        console.error('Error processing HubSpot event:', error);
      }
    }

    return NextResponse.json({ success: true, processed: events.length });

  } catch (error) {
    console.error('HubSpot webhook error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function processHubSpotEvent(event: HubSpotWebhookEvent) {
  console.log('🎯 Processing HubSpot event:', event.subscriptionType, event.objectId);

  // Handle contact property changes
  if (event.subscriptionType === 'contact.propertyChange') {
    if (event.propertyName === 'hs_lead_status' || event.propertyName === 'lifecyclestage') {
      await handleContactStatusChange(event);
    }
  }

  // Handle deal creation and updates
  if (event.subscriptionType === 'deal.creation' || event.subscriptionType === 'deal.propertyChange') {
    await handleDealEvent(event);
  }
}

async function handleContactStatusChange(event: HubSpotWebhookEvent) {
  try {
    const contact = await getHubSpotContact(event.objectId.toString());
    const properties = contact.properties;

    // Determine Meta event based on status
    let metaEventName = 'Lead'; // Default
    let customData: any = {
      currency: 'SAR',
      value: 50, // Base lead value
      content_name: 'رفوف تخزين معدنية',
      content_category: 'storage_solutions',
      lead_status: properties.hs_lead_status || 'new',
      hubspot_contact_id: event.objectId.toString(),
    };

    // Map HubSpot statuses to Meta events
    switch (properties.hs_lead_status?.toLowerCase()) {
      case 'qualified':
      case 'mql':
        metaEventName = 'Lead';
        customData.value = 100;
        customData.lead_status = 'qualified';
        break;
      case 'sql':
        metaEventName = 'Lead';
        customData.value = 200;
        customData.lead_status = 'sales_qualified';
        break;
      case 'opportunity':
        metaEventName = 'InitiateCheckout';
        customData.value = 500;
        customData.lead_status = 'opportunity';
        break;
    }

    // Map lifecycle stages
    switch (properties.lifecyclestage?.toLowerCase()) {
      case 'opportunity':
        metaEventName = 'InitiateCheckout';
        customData.value = 500;
        break;
      case 'customer':
        metaEventName = 'Purchase';
        customData.value = 1000;
        break;
    }

    const eventId = `${metaEventName.toLowerCase()}_${event.objectId}_${Date.now()}`;

    const metaEventData: MetaEventPayload = {
      event_name: metaEventName,
      event_time: Math.floor(event.occurredAt / 1000),
      event_id: eventId,
      user_data: {
        em: properties.email ? await hashData(properties.email) : undefined,
        ph: properties.phone ? await hashData(properties.phone.replace(/\D/g, '')) : undefined,
        fn: properties.firstname ? await hashData(properties.firstname) : undefined,
        ln: properties.lastname ? await hashData(properties.lastname) : undefined,
        external_id: await hashData(event.objectId.toString()),
      },
      custom_data: customData,
      event_source_url: 'https://krfof-leadmagnet.vercel.app',
      action_source: 'system',
    };

    await sendToMeta(metaEventData);
    console.log(`✅ Meta ${metaEventName} event sent for contact status change:`, eventId);

  } catch (error) {
    console.error('Error handling contact status change:', error);
  }
}

async function handleDealEvent(event: HubSpotWebhookEvent) {
  try {
    const deal = await getHubSpotDeal(event.objectId.toString());
    const properties = deal.properties;

    // Get associated contact
    const contacts = deal.associations?.contacts?.results || [];
    if (contacts.length === 0) {
      console.log('No contacts associated with deal');
      return;
    }

    const contact = await getHubSpotContact(contacts[0].id);
    const contactProperties = contact.properties;

    let metaEventName = 'InitiateCheckout'; // Default for deal events
    let customData: any = {
      currency: 'SAR',
      value: parseFloat(properties.amount) || 1000,
      content_name: properties.dealname || 'رفوف تخزين معدنية',
      content_category: 'storage_solutions',
      hubspot_contact_id: contacts[0].id,
      hubspot_deal_id: event.objectId.toString(),
      deal_stage: properties.dealstage,
      deal_amount: parseFloat(properties.amount) || 0,
    };

    // Map deal stages to Meta events
    const dealStage = properties.dealstage?.toLowerCase() || '';
    
    if (dealStage.includes('closed') && dealStage.includes('won')) {
      metaEventName = 'Purchase';
      customData.value = parseFloat(properties.amount) || 1000;
    } else if (dealStage.includes('proposal') || dealStage.includes('negotiation')) {
      metaEventName = 'InitiateCheckout';
      customData.value = (parseFloat(properties.amount) || 1000) * 0.5; // 50% probability
    }

    const eventId = `${metaEventName.toLowerCase()}_deal_${event.objectId}_${Date.now()}`;

    const metaEventData: MetaEventPayload = {
      event_name: metaEventName,
      event_time: Math.floor(event.occurredAt / 1000),
      event_id: eventId,
      user_data: {
        em: contactProperties.email ? await hashData(contactProperties.email) : undefined,
        ph: contactProperties.phone ? await hashData(contactProperties.phone.replace(/\D/g, '')) : undefined,
        fn: contactProperties.firstname ? await hashData(contactProperties.firstname) : undefined,
        ln: contactProperties.lastname ? await hashData(contactProperties.lastname) : undefined,
        ct: contactProperties.city ? await hashData(contactProperties.city) : undefined,
        st: contactProperties.state ? await hashData(contactProperties.state) : undefined,
        zp: contactProperties.zip ? await hashData(contactProperties.zip) : undefined,
        country: contactProperties.country ? await hashData(contactProperties.country) : await hashData('sa'),
        db: contactProperties.date_of_birth ? await hashData(contactProperties.date_of_birth) : undefined,
        external_id: await hashData(contacts[0].id),
      },
      custom_data: customData,
      event_source_url: 'https://krfof-leadmagnet.vercel.app',
      action_source: 'system',
    };

    await sendToMeta(metaEventData);
    console.log(`✅ Meta ${metaEventName} event sent for deal event:`, eventId);

  } catch (error) {
    console.error('Error handling deal event:', error);
  }
} 