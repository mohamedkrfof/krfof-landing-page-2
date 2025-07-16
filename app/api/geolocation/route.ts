import { NextRequest, NextResponse } from 'next/server';
import { IPGeolocationService } from '@/lib/ipGeolocation';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from request headers
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || // Cloudflare
                     '127.0.0.1';

    console.log('🌍 Geolocation API: Detecting location for IP:', clientIP);

    // Get geolocation data using the existing service
    const geoService = IPGeolocationService.getInstance();
    const geoData = await geoService.getLocationFromIP(clientIP);

    if (!geoData) {
      return NextResponse.json(
        { error: 'Unable to detect location' },
        { status: 404 }
      );
    }

    console.log('🌍 Geolocation API: Detected location:', {
      city: geoData.city,
      region: geoData.region,
      country: geoData.country,
    });

    // Return the geolocation data
    return NextResponse.json({
      city: geoData.city,
      region: geoData.region,
      country: geoData.country,
      countryCode: geoData.countryCode,
      timezone: geoData.timezone,
      ip: clientIP,
    });

  } catch (error) {
    console.error('Geolocation API error:', error);
    
    // Return default Saudi Arabia data as fallback
    return NextResponse.json({
      city: 'Riyadh',
      region: 'Riyadh',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      timezone: 'Asia/Riyadh',
      fallback: true,
    });
  }
} 