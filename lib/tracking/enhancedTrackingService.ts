import { 
  EnhancedTrackingEvent, 
  MetaEvent, 
  GoogleEvent, 
  TikTokEvent, 
  SnapchatEvent,
  TrackingResponse,
  MultiPlatformTrackingResponse,
  TrackingConfig 
} from './types';
import { DataEnrichmentService } from './dataEnrichment';
import { EncryptionService } from './encryption';

export class EnhancedTrackingService {
  private static instance: EnhancedTrackingService;
  private dataEnrichment: DataEnrichmentService;
  private encryption: EncryptionService;
  private config: TrackingConfig;

  private constructor() {
    this.dataEnrichment = DataEnrichmentService.getInstance();
    this.encryption = EncryptionService.getInstance();
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): EnhancedTrackingService {
    if (!EnhancedTrackingService.instance) {
      EnhancedTrackingService.instance = new EnhancedTrackingService();
    }
    return EnhancedTrackingService.instance;
  }

  /**
   * Track page view with comprehensive data
   */
  public async trackPageView(pageData: {
    page_url: string;
    page_title?: string;
    city?: string;
    referrer?: string;
    content_name?: string;
    [key: string]: unknown;
  }): Promise<MultiPlatformTrackingResponse> {
    const eventId = `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Collect device and session data
      const deviceData = this.dataEnrichment.collectDeviceData();
      const sessionData = this.dataEnrichment.collectSessionData();

      // Enhanced custom data for ViewContent
      const enhancedCustomData = this.dataEnrichment.enhanceCustomData({
        currency: 'SAR',
        value: 1, // Page view value
        content_name: pageData.content_name || 'رفوف تخزين معدنية',
        content_category: 'lead_magnet',
        content_type: 'product_catalog',
        custom_data: {
          page_type: 'landing_page',
          city: pageData.city,
        }
      }, pageData);

      // Create comprehensive tracking event for ViewContent
      const trackingEvent: EnhancedTrackingEvent = {
        event_name: 'ViewContent',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: pageData.page_url,
        action_source: 'website',
        referrer_url: pageData.referrer,
        user_data: {}, // No user data for page views
        custom_data: enhancedCustomData,
        device_data: deviceData,
        session_data: sessionData,
      };

      // Send to all platforms in parallel
      const platformPromises = [];

      if (this.config.platforms.meta.enabled) {
        platformPromises.push(this.sendToMeta(trackingEvent));
      }

      if (this.config.platforms.google.enabled) {
        platformPromises.push(this.sendToGoogle(trackingEvent));
      }

      if (this.config.platforms.tiktok.enabled) {
        platformPromises.push(this.sendToTikTok(trackingEvent));
      }

      if (this.config.platforms.snapchat.enabled) {
        platformPromises.push(this.sendToSnapchat(trackingEvent));
      }

      // Execute all platform calls in parallel
      const results = await Promise.allSettled(platformPromises);

      // Process results
      const trackingResults: TrackingResponse[] = [];
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        const platforms = ['meta', 'google', 'tiktok', 'snapchat'];
        const platform = platforms[index];

        if (result.status === 'fulfilled' && result.value) {
          trackingResults.push({
            platform,
            success: true,
            event_id: eventId,
            response_data: result.value,
            timestamp: Date.now(),
          });
          successCount++;
        } else {
          const error = result.status === 'rejected' ? result.reason : 'Unknown error';
          trackingResults.push({
            platform,
            success: false,
            event_id: eventId,
            error: String(error),
            timestamp: Date.now(),
          });
          failureCount++;
        }
      });

      const responses: MultiPlatformTrackingResponse = {
        event_id: eventId,
        results: trackingResults,
        success_count: successCount,
        failure_count: failureCount,
        total_platforms: trackingResults.length,
        timestamp: Date.now(),
      };

      return responses;

    } catch (error) {
      console.error('Enhanced page view tracking error:', error);
      return {
        event_id: eventId,
        results: [{
          platform: 'system',
          success: false,
          event_id: eventId,
          error: String(error),
          timestamp: Date.now(),
        }],
        success_count: 0,
        failure_count: 1,
        total_platforms: 1,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Main tracking method - sends comprehensive lead event to all platforms
   */
  public async trackLead(leadData: {
    email: string;
    phone: string;
    name: string;
    quantity?: string;
    [key: string]: unknown;
  }): Promise<MultiPlatformTrackingResponse> {
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Prepare raw user data for hashing
      const [firstName, ...lastNameParts] = leadData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const rawUserData = {
        email: leadData.email,
        phone: leadData.phone,
        firstName: firstName,
        lastName: lastName,
        // Add more fields if available in leadData
        city: leadData.city,
        state: leadData.state,
        zipCode: leadData.zipCode,
        country: leadData.country || 'sa', // Default to Saudi Arabia
      };

      // Hash sensitive data according to Meta standards
      const hashedUserData = await this.encryption.hashUserData(rawUserData);

      // Enhance user data with additional identifiers
      const enhancedUserData = this.dataEnrichment.enhanceUserData({
        ...hashedUserData,
        // Add non-hashed data
        client_ip_address: await this.getClientIP(),
        client_user_agent: leadData.user_agent as string | undefined,
      });

             // Enhance custom data with comprehensive business intelligence
       const enhancedCustomData = this.dataEnrichment.enhanceCustomData({
         currency: 'SAR',
         value: this.calculateLeadValue(leadData.quantity),
         content_name: 'رفوف تخزين معدنية',
         content_category: 'storage_solutions',
         lead_type: this.determineLeadType(leadData.quantity),
       }, leadData);

      // Collect device and session data
      const deviceData = this.dataEnrichment.collectDeviceData();
      const sessionData = this.dataEnrichment.collectSessionData();

      // Create comprehensive tracking event
      const trackingEvent: EnhancedTrackingEvent = {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: (leadData.url as string) || '',
        action_source: 'website',
        referrer_url: leadData.referrer as string | undefined,
        user_data: enhancedUserData,
        custom_data: enhancedCustomData,
        device_data: deviceData,
        session_data: sessionData,
      };

      // Send to all platforms in parallel
      const platformPromises = [];

      if (this.config.platforms.meta.enabled) {
        platformPromises.push(this.sendToMeta(trackingEvent));
      }

      if (this.config.platforms.google.enabled) {
        platformPromises.push(this.sendToGoogle(trackingEvent));
      }

      if (this.config.platforms.tiktok.enabled) {
        platformPromises.push(this.sendToTikTok(trackingEvent));
      }

      if (this.config.platforms.snapchat.enabled) {
        platformPromises.push(this.sendToSnapchat(trackingEvent));
      }

      // Execute all platform calls in parallel
      const results = await Promise.allSettled(platformPromises);

      // Process results
      const trackingResults: TrackingResponse[] = results.map((result, index) => {
        const platforms = ['meta', 'google', 'tiktok', 'snapchat'];
        const platform = platforms[index];

        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            platform,
            success: false,
            event_id: eventId,
            error: result.reason?.message || 'Unknown error',
            timestamp: Date.now(),
          };
        }
      });

      const successCount = trackingResults.filter(r => r.success).length;
      const failureCount = trackingResults.filter(r => !r.success).length;

      return {
        event_id: eventId,
        results: trackingResults,
        success_count: successCount,
        failure_count: failureCount,
        total_platforms: trackingResults.length,
        timestamp: Date.now(),
      };

    } catch (error) {
      console.error('Enhanced tracking failed:', error);
      
      return {
        event_id: eventId,
        results: [{
          platform: 'system',
          success: false,
          event_id: eventId,
          error: error instanceof Error ? error.message : 'System error',
          timestamp: Date.now(),
        }],
        success_count: 0,
        failure_count: 1,
        total_platforms: 1,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Send comprehensive event to Meta Conversions API
   */
  private async sendToMeta(event: EnhancedTrackingEvent): Promise<TrackingResponse> {
    try {
      const metaEvent: MetaEvent = {
        event_name: event.event_name,
        event_time: event.event_time,
        event_id: event.event_id,
        event_source_url: event.event_source_url,
        action_source: event.action_source,
        referrer_url: event.referrer_url,
        user_data: event.user_data,
        custom_data: event.custom_data,
        customer_segmentation: event.custom_data.customer_segmentation,
        data_processing_options: [], // Add LDU if needed for GDPR compliance
      };

      const response = await fetch(`https://graph.facebook.com/v18.0/${this.config.platforms.meta.pixel_id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [metaEvent],
          access_token: process.env.META_ACCESS_TOKEN,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API error: ${responseData.error?.message || response.statusText}`);
      }

      return {
        platform: 'meta',
        success: true,
        event_id: event.event_id,
        response_data: responseData,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        platform: 'meta',
        success: false,
        event_id: event.event_id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Send event to Google Analytics 4
   */
  private async sendToGoogle(event: EnhancedTrackingEvent): Promise<TrackingResponse> {
    try {
      const googleEvent: GoogleEvent = {
        client_id: event.user_data.external_id || 'unknown',
        events: [{
          name: 'generate_lead',
          params: {
            event_category: 'lead_generation',
            event_label: event.custom_data.lead_type,
            value: event.custom_data.value,
            currency: event.custom_data.currency,
            content_category: event.custom_data.content_category,
            page_location: event.event_source_url,
            page_referrer: event.referrer_url,
            user_agent: event.user_data.client_user_agent,
            ip_override: event.user_data.client_ip_address,
          },
        }],
        user_properties: {
          lead_source: { value: event.custom_data.lead_source },
          customer_segmentation: { value: event.custom_data.customer_segmentation },
          device_type: { value: event.custom_data.device_type },
        },
      };

      // Google Analytics 4 Measurement Protocol
      const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${this.config.platforms.google.measurement_id}&api_secret=${process.env.GA4_API_SECRET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      });

      return {
        platform: 'google',
        success: response.ok,
        event_id: event.event_id,
        response_data: response.ok ? 'Success' : 'Failed',
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        platform: 'google',
        success: false,
        event_id: event.event_id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Send event to TikTok Events API
   */
  private async sendToTikTok(event: EnhancedTrackingEvent): Promise<TrackingResponse> {
    try {
      const tiktokEvent: TikTokEvent = {
        pixel_code: this.config.platforms.tiktok.pixel_id || 'CKHS5RRC77UFTHK7BKJ0',
        event: 'CompleteRegistration',
        event_id: event.event_id,
        timestamp: event.event_time.toString(),
        context: {
          page: {
            url: event.event_source_url,
            referrer: event.referrer_url,
          },
          user: {
            email: event.user_data.em,
            phone_number: event.user_data.ph,
            external_id: event.user_data.external_id,
          },
        },
        properties: {
          value: event.custom_data.value,
          currency: event.custom_data.currency,
          content_type: event.custom_data.content_type,
          content_name: event.custom_data.content_name,
        },
      };

      const response = await fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': process.env.TIKTOK_ACCESS_TOKEN || '',
        },
        body: JSON.stringify(tiktokEvent),
      });

      const responseData = await response.json();

      return {
        platform: 'tiktok',
        success: response.ok,
        event_id: event.event_id,
        response_data: responseData,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        platform: 'tiktok',
        success: false,
        event_id: event.event_id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Send event to Snapchat Conversions API
   */
  private async sendToSnapchat(event: EnhancedTrackingEvent): Promise<TrackingResponse> {
    try {
      const snapchatEvent: SnapchatEvent = {
        pixel_id: this.config.platforms.snapchat.pixel_id || '0d75ef7a-3830-4fce-b470-fee261e4b06e',
        event: 'SIGN_UP',
        event_conversion_type: 'WEB',
        event_tag: event.event_id,
        timestamp: Date.now(),
        hashed_email: event.user_data.em,
        hashed_phone_number: event.user_data.ph,
        user_agent: event.user_data.client_user_agent,
        custom_data: {
          value: event.custom_data.value,
          currency: event.custom_data.currency,
          content_name: event.custom_data.content_name,
        },
      };

      const response = await fetch(`https://tr.snapchat.com/v2/conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SNAPCHAT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(snapchatEvent),
      });

      const responseData = await response.json();

      return {
        platform: 'snapchat',
        success: response.ok,
        event_id: event.event_id,
        response_data: responseData,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        platform: 'snapchat',
        success: false,
        event_id: event.event_id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Helper methods
   */
  private async getClientIP(): Promise<string | undefined> {
    if (typeof window === 'undefined') return undefined;
    
    try {
      // This would typically be handled server-side for actual IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return undefined;
    }
  }

  private calculateLeadValue(quantity?: string): number {
    const baseValue = 500; // Base value per shelf in SAR
    
    switch (quantity) {
      case '10+':
        return baseValue * 15; // Assume 15 shelves average
      case '5-10':
        return baseValue * 7.5; // Assume 7.5 shelves average
      case '1-5':
        return baseValue * 3; // Assume 3 shelves average
      default:
        return baseValue;
    }
  }

  private determineLeadType(quantity?: string): string {
    switch (quantity) {
      case '10+':
        return 'high_value_lead';
      case '5-10':
        return 'medium_value_lead';
      case '1-5':
        return 'standard_lead';
      default:
        return 'general_inquiry';
    }
  }

  private getDefaultConfig(): TrackingConfig {
    return {
      platforms: {
              meta: {
        enabled: true,
        dataset_id: process.env.META_DATASET_ID || '1672417903418438',
        pixel_id: process.env.META_PIXEL_ID || '1672417903418438',
        api_version: 'v18.0',
          retry_attempts: 3,
          timeout: 30000,
        },
        google: {
          enabled: true,
          measurement_id: process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
          retry_attempts: 3,
          timeout: 30000,
        },
        tiktok: {
          enabled: true,
          pixel_id: process.env.TIKTOK_PIXEL_ID || 'CKHS5RRC77UFTHK7BKJ0',
          retry_attempts: 3,
          timeout: 30000,
        },
        snapchat: {
          enabled: true,
          pixel_id: process.env.SNAPCHAT_PIXEL_ID || '0d75ef7a-3830-4fce-b470-fee261e4b06e',
          retry_attempts: 3,
          timeout: 30000,
        },
        twitter: {
          enabled: false,
        },
        linkedin: {
          enabled: false,
        },
        pinterest: {
          enabled: false,
        },
      },
      default_currency: 'SAR',
      timezone: 'Asia/Riyadh',
      enable_debug: process.env.NODE_ENV === 'development',
      batch_size: 10,
      batch_timeout: 5000,
      collect_device_data: true,
      collect_session_data: true,
      collect_performance_data: true,
      respect_do_not_track: true,
      gdpr_compliance: true,
      ccpa_compliance: true,
      hash_algorithm: 'sha256',
      normalize_before_hash: true,
      log_errors: true,
      retry_failed_requests: true,
      fallback_platforms: ['meta', 'google'],
    };
  }

  /**
   * Public configuration methods
   */
  public updateConfig(newConfig: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): TrackingConfig {
    return { ...this.config };
  }

  /**
   * Debug method to test tracking
   */
  public async testTracking(): Promise<MultiPlatformTrackingResponse> {
    return this.trackLead({
      email: 'test@example.com',
      phone: '+966501234567',
      name: 'أحمد محمد',
      quantity: '5-10',
    });
  }
} 