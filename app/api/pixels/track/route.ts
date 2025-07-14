import { NextRequest, NextResponse } from 'next/server';
import { EnhancedTrackingService } from '@/lib/tracking/enhancedTrackingService';
import { TrackingResponse } from '@/lib/tracking/types';

/**
 * Legacy Pixel Tracking API Route
 * 
 * This route is maintained for backward compatibility.
 * New implementations should use the hybrid tracking service directly.
 * 
 * Migration: Use /api/tracking/enhanced for comprehensive tracking
 */

// Legacy hash function - kept for compatibility
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('⚠️ LEGACY API: /api/pixels/track is deprecated. Use HybridTrackingService or /api/tracking/enhanced');

    // Option 1: Use legacy implementation for existing integrations
    if (data.useLegacy === true) {
      return await handleLegacyTracking(data);
    }

    // Option 2: Use enhanced tracking service (recommended)
    const enhancedData = {
      email: data.email,
      phone: data.phone,
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown User',
      quantity: data.quantity,
      
      // Legacy event mapping
      event_type: data.event || 'Lead',
      url: data.url,
      referrer: data.referrer,
      eventId: data.eventId,
    };

    // Use enhanced tracking service for better coverage
    const trackingService = EnhancedTrackingService.getInstance();
    const result = await trackingService.trackLead(enhancedData);

    // Return legacy-compatible response format
    return NextResponse.json({ 
      success: result.success_count > 0,
      eventId: result.event_id,
      results: result.results.map((r: TrackingResponse) => ({
        platform: r.platform,
        success: r.success
      })),
      
      // Enhanced response data
      enhanced_results: {
        total_platforms: result.total_platforms,
        successful_platforms: result.success_count,
        failed_platforms: result.failure_count,
        platform_details: result.results,
      },
      
      // Migration notice
      migration_notice: {
        message: 'This API route is deprecated. Use HybridTrackingService for better performance.',
        recommended_endpoint: '/api/tracking/enhanced',
        enhanced_features: [
          'Comprehensive data collection (25+ Meta parameters)',
          'Better error handling and retry mechanisms',
          'Parallel processing for improved performance',
          'Client-side pixel integration',
          'Advanced customer segmentation',
          'GDPR/CCPA compliance features'
        ]
      }
    });

  } catch (error) {
    console.error('Legacy pixel tracking error:', error);
    return NextResponse.json({ 
      error: 'Tracking failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Consider migrating to /api/tracking/enhanced for better reliability'
    }, { status: 500 });
  }
}

/**
 * Legacy tracking implementation - kept for backward compatibility
 */
async function handleLegacyTracking(data: Record<string, unknown>) {
  const eventId = data.eventId || `${data.event}_${Date.now()}`;

  const results = await Promise.allSettled([
    // Meta Pixel (Facebook) Conversions API
    fetch(`https://graph.facebook.com/v18.0/1828066298063484/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          event_name: data.event,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          user_data: {
            em: data.email ? await hashData(data.email as string) : undefined,
            ph: data.phone ? await hashData((data.phone as string).replace(/\D/g, '')) : undefined
          },
          event_source_url: data.url || 'https://krfof-leadmagnet.vercel.app',
          action_source: 'website'
        }],
        access_token: process.env.META_ACCESS_TOKEN
      })
    }).catch(err => {
      console.error('Meta Pixel error:', err);
      return { ok: false, error: err.message };
    }),

    // Snapchat Pixel Conversions API
    fetch(`https://tr.snapchat.com/v2/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SNAPCHAT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        pixel_id: '0d75ef7a-3830-4fce-b470-fee261e4b06e',
        event: 'SIGN_UP',
        event_conversion_type: 'WEB',
        event_tag: eventId,
        hashed_email: data.email ? await hashData(data.email as string) : undefined,
        hashed_phone_number: data.phone ? await hashData((data.phone as string).replace(/\D/g, '')) : undefined,
        timestamp: Date.now()
      })
    }).catch(err => {
      console.error('Snapchat Pixel error:', err);
      return { ok: false, error: err.message };
    }),

    // TikTok Events API
    fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN || ''
      },
      body: JSON.stringify({
        pixel_code: 'CKHS5RRC77UFTHK7BKJ0',
        event: 'CompleteRegistration',
        event_id: eventId,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        context: {
          page: {
            url: data.url || 'https://krfof-leadmagnet.vercel.app'
          },
          user: {
            email: data.email ? await hashData(data.email as string) : undefined,
            phone_number: data.phone ? await hashData((data.phone as string).replace(/\D/g, '')) : undefined
          }
        }
      })
    }).catch(err => {
      console.error('TikTok Pixel error:', err);
      return { ok: false, error: err.message };
    })
  ]);

  // Log results for debugging
  results.forEach((result, index) => {
    const platforms = ['Meta', 'Snapchat', 'TikTok'];
    if (result.status === 'fulfilled') {
      console.log(`${platforms[index]} pixel: Success`);
    } else {
      console.log(`${platforms[index]} pixel: Failed -`, result.reason);
    }
  });

  return NextResponse.json({ 
    success: true, 
    eventId,
    results: results.map((result, index) => ({
      platform: ['Meta', 'Snapchat', 'TikTok'][index],
      success: result.status === 'fulfilled'
    })),
    legacy_mode: true,
    upgrade_recommendation: {
      message: 'You are using legacy tracking. Upgrade to enhanced tracking for better performance.',
      benefits: [
        '25+ Meta parameters vs 3 basic parameters',
        'Better error handling and retry mechanisms',
        'Customer segmentation and lead scoring',
        'GDPR/CCPA compliance features'
      ]
    }
  });
} 