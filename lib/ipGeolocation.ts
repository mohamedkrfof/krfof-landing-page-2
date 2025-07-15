// IP Geolocation Service
export interface GeolocationData {
  country?: string;
  countryCode?: string;
  region?: string; // State/Province
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  query?: string; // IP address
}

export class IPGeolocationService {
  private static instance: IPGeolocationService;
  
  static getInstance(): IPGeolocationService {
    if (!IPGeolocationService.instance) {
      IPGeolocationService.instance = new IPGeolocationService();
    }
    return IPGeolocationService.instance;
  }

  /**
   * Get geolocation data from IP address using multiple fallback services
   */
  async getLocationFromIP(ipAddress: string): Promise<GeolocationData | null> {
    if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
      // Return Saudi Arabia defaults for localhost/development
      return {
        country: 'Saudi Arabia',
        countryCode: 'SA',
        region: 'Riyadh',
        regionName: 'Riyadh Province',
        city: 'Riyadh',
        zip: '11564',
        timezone: 'Asia/Riyadh',
        query: ipAddress,
      };
    }

    // Try multiple services for reliability
    const services = [
      () => this.getFromIPAPI(ipAddress),
      () => this.getFromIPInfo(ipAddress),
      () => this.getFromFreeIPAPI(ipAddress),
    ];

    for (const service of services) {
      try {
        const result = await service();
        if (result) {
          console.log('✅ IP Geolocation successful:', { ip: ipAddress, location: result });
          return result;
        }
      } catch (error) {
        console.warn('IP Geolocation service failed, trying next...', error);
      }
    }

    console.warn('❌ All IP geolocation services failed for:', ipAddress);
    return null;
  }

  /**
   * Primary service: ip-api.com (free, no API key needed)
   */
  private async getFromIPAPI(ipAddress: string): Promise<GeolocationData | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,query`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`ip-api.com failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(`ip-api.com error: ${data.message}`);
      }

      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        query: data.query,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Secondary service: ipinfo.io (good for Saudi Arabia)
   */
  private async getFromIPInfo(ipAddress: string): Promise<GeolocationData | null> {
    const token = process.env.IPINFO_TOKEN; // Optional API key for higher limits
    const url = token 
      ? `https://ipinfo.io/${ipAddress}?token=${token}`
      : `https://ipinfo.io/${ipAddress}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`ipinfo.io failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`ipinfo.io error: ${data.error.message}`);
      }

      return {
        country: data.country === 'SA' ? 'Saudi Arabia' : data.country,
        countryCode: data.country,
        region: data.region,
        city: data.city,
        zip: data.postal,
        timezone: data.timezone,
        query: data.ip,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Tertiary service: freeipapi.com (backup)
   */
  private async getFromFreeIPAPI(ipAddress: string): Promise<GeolocationData | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`https://freeipapi.com/api/json/${ipAddress}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`freeipapi.com failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        country: data.countryName,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.cityName,
        zip: data.zipCode,
        timezone: data.timeZone,
        query: ipAddress,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Map Saudi Arabia regions to English codes for Meta
   */
  mapSaudiRegion(arabicRegion: string): string {
    const regionMap: Record<string, string> = {
      'Riyadh': 'riyadh',
      'Makkah': 'makkah',
      'Eastern Province': 'eastern',
      'Madinah': 'madinah',
      'Qassim': 'qassim',
      'Hail': 'hail',
      'Asir': 'asir',
      'Tabuk': 'tabuk',
      'Northern Borders': 'northern',
      'Jazan': 'jazan',
      'Najran': 'najran',
      'Al Bahah': 'albaha',
      'Al Jouf': 'jouf',
    };

    return regionMap[arabicRegion] || arabicRegion.toLowerCase();
  }

  /**
   * Validate and sanitize geolocation data for Meta
   */
  sanitizeForMeta(location: GeolocationData): {
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } {
    return {
      city: location.city?.trim() || undefined,
      state: location.region ? this.mapSaudiRegion(location.region) : undefined,
      zip: location.zip?.trim() || undefined,
      country: location.countryCode?.toLowerCase() || 'sa',
    };
  }
} 