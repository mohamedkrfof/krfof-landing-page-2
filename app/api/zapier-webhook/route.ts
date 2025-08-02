import { NextRequest, NextResponse } from 'next/server';

interface ZapierWebhookData {
  name: string;
  email: string;
  phone?: string;
  quantity?: string;
  leadMagnet?: string;
  timestamp?: string;
  url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  userAgent?: string;
  deviceInfo?: any;
  city?: string;
  fbp?: string;
  fbc?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ZapierWebhookData = await request.json();
    console.log('📤 Sending to Zapier webhook:', data.email);

    // Prepare comprehensive data for Zapier
    const zapierPayload = {
      // Core lead information
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      quantity: data.quantity || '1',
      
      // Lead context
      leadMagnet: data.leadMagnet || 'رفوف تخزين معدنية - طلب عرض أسعار',
      message: `طلب عرض أسعار رفوف جديدة - الكمية: ${data.quantity || '1'}`,
      
      // Timestamp and source
      timestamp: data.timestamp || new Date().toISOString(),
      source: 'krfof-leadmagnet',
      form_type: 'quote_request',
      
      // Page and referral data
      page_url: data.url || '',
      referrer: data.referrer || '',
      user_agent: data.userAgent || '',
      
      // UTM parameters for campaign tracking
      utm_source: data.utm_source || '',
      utm_medium: data.utm_medium || '',
      utm_campaign: data.utm_campaign || '',
      utm_term: data.utm_term || '',
      utm_content: data.utm_content || '',
      
      // Device and location data
      device_info: data.deviceInfo || {},
      city: data.city || '',
      
      // Facebook tracking data for attribution
      facebook_browser_id: data.fbp || '',
      facebook_click_id: data.fbc || '',
      
      // Additional metadata
      lead_score: calculateLeadScore(data),
      estimated_value: calculateEstimatedValue(data.quantity),
      priority: calculatePriority(data),
    };

    // Send to Zapier webhook
    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/23446220/uuymrjh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zapierPayload),
    });

    if (zapierResponse.ok) {
      console.log('✅ Zapier webhook submission successful');
      
      return NextResponse.json({
        success: true,
        message: 'Lead data sent to Zapier successfully',
        zapier_status: zapierResponse.status
      });
    } else {
      const errorText = await zapierResponse.text();
      console.error('❌ Zapier webhook submission failed:', errorText);
      
      return NextResponse.json({
        success: false,
        error: `Zapier webhook error: ${zapierResponse.status} - ${errorText}`,
        details: errorText
      }, { status: zapierResponse.status });
    }

  } catch (error) {
    console.error('❌ Zapier webhook integration error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions for lead scoring and value calculation
function calculateLeadScore(data: ZapierWebhookData): number {
  let score = 50; // Base score
  
  // Phone number provided (+20 points)
  if (data.phone && data.phone.length > 5) {
    score += 20;
  }
  
  // Quantity specified (+10-30 points based on quantity)
  if (data.quantity) {
    const qty = parseInt(data.quantity) || 1;
    if (qty >= 10) score += 30;
    else if (qty >= 5) score += 20;
    else if (qty >= 2) score += 10;
  }
  
  // UTM source indicates paid traffic (+15 points)
  if (data.utm_source && ['google', 'facebook', 'instagram', 'snapchat', 'tiktok'].includes(data.utm_source.toLowerCase())) {
    score += 15;
  }
  
  // Has Facebook tracking data (+10 points)
  if (data.fbp || data.fbc) {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
}

function calculateEstimatedValue(quantity?: string): number {
  const qty = parseInt(quantity || '1');
  const pricePerUnit = 340; // SAR per shelf unit
  
  if (qty >= 10) return qty * pricePerUnit;
  if (qty >= 5) return qty * pricePerUnit * 0.95; // 5% bulk discount
  if (qty >= 2) return qty * pricePerUnit * 0.98; // 2% small bulk discount
  
  return pricePerUnit; // Single unit price
}

function calculatePriority(data: ZapierWebhookData): 'high' | 'medium' | 'low' {
  const qty = parseInt(data.quantity || '1');
  const hasPhone = !!(data.phone && data.phone.length > 5);
  const isPaidTraffic = !!(data.utm_source && ['google', 'facebook', 'instagram'].includes(data.utm_source.toLowerCase()));
  
  // High priority: Large quantity + phone + paid traffic
  if (qty >= 10 && hasPhone && isPaidTraffic) return 'high';
  
  // Medium priority: Decent quantity or phone provided
  if (qty >= 5 || hasPhone) return 'medium';
  
  // Low priority: Small quantity, no phone
  return 'low';
} 