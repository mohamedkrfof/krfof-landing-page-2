import { NextRequest, NextResponse } from 'next/server';

// Hash function for pixel tracking
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
    const eventId = data.eventId || `${data.event}_${Date.now()}`;

    const results = await Promise.allSettled([
      // Meta Pixel (Facebook) Conversions API
      fetch(`https://graph.facebook.com/v18.0/843643277554384/events`, {
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
              em: data.email ? await hashData(data.email) : undefined,
              ph: data.phone ? await hashData(data.phone.replace(/\D/g, '')) : undefined
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
          hashed_email: data.email ? await hashData(data.email) : undefined,
          hashed_phone_number: data.phone ? await hashData(data.phone.replace(/\D/g, '')) : undefined,
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
              email: data.email ? await hashData(data.email) : undefined,
              phone_number: data.phone ? await hashData(data.phone.replace(/\D/g, '')) : undefined
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
      }))
    });

  } catch (error) {
    console.error('Pixel tracking error:', error);
    return NextResponse.json({ 
      error: 'Tracking failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 