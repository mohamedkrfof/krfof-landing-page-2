import { UserData, CustomData, DeviceData, SessionData } from './types';

// Data enrichment service to collect comprehensive user and device data
export class DataEnrichmentService {
  private static instance: DataEnrichmentService;
  private sessionData: Partial<SessionData> = {};
  private performanceData: Record<string, unknown> = {};

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSessionTracking();
      this.collectPerformanceData();
    }
  }

  public static getInstance(): DataEnrichmentService {
    if (!DataEnrichmentService.instance) {
      DataEnrichmentService.instance = new DataEnrichmentService();
    }
    return DataEnrichmentService.instance;
  }

  // Initialize session tracking
  private initializeSessionTracking() {
    // Generate session ID if not exists
    if (!sessionStorage.getItem('session_id')) {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
      sessionStorage.setItem('session_start', Date.now().toString());
      sessionStorage.setItem('page_views', '0');
    }

    // Track page views
    const pageViews = parseInt(sessionStorage.getItem('page_views') || '0') + 1;
    sessionStorage.setItem('page_views', pageViews.toString());

    // Track returning visitors
    const isReturning = localStorage.getItem('visitor_id') !== null;
    if (!isReturning) {
      localStorage.setItem('visitor_id', `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      localStorage.setItem('first_visit', Date.now().toString());
      localStorage.setItem('visit_count', '1');
    } else {
      const visitCount = parseInt(localStorage.getItem('visit_count') || '1') + 1;
      localStorage.setItem('visit_count', visitCount.toString());
      localStorage.setItem('last_visit', Date.now().toString());
    }

    // Track traffic source
    this.trackTrafficSource();
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
  }

  // Collect comprehensive device data
  public collectDeviceData(): DeviceData {
    if (typeof window === 'undefined') {
      return {};
    }

    const nav = window.navigator;
    const screen = window.screen;
    
    return {
      // Browser/Device information
      user_agent: nav.userAgent,
      accept_language: nav.language || nav.languages?.join(','),
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: screen.colorDepth,
      pixel_ratio: window.devicePixelRatio,
      timezone_offset: new Date().getTimezoneOffset(),
      
      // Network information
      connection_type: this.getConnectionType(),
      effective_type: this.getEffectiveConnectionType(),
      downlink: this.getDownlink(),
      rtt: this.getRTT(),
      
      // Hardware information
      memory: this.getDeviceMemory(),
      cpu_cores: nav.hardwareConcurrency,
      platform: nav.platform,
      
      // Browser features
      cookies_enabled: nav.cookieEnabled,
      java_enabled: nav.javaEnabled?.(),
      plugins: this.getPlugins(),
      
      // Touch/Mobile specific
      touch_support: this.getTouchSupport(),
      orientation: this.getOrientation(),
      
      // Performance data
      page_load_time: this.performanceData.loadTime,
      dom_content_loaded: this.performanceData.domContentLoaded,
      first_paint: this.performanceData.firstPaint,
      first_contentful_paint: this.performanceData.firstContentfulPaint,
    };
  }

  // Collect comprehensive session data
  public collectSessionData(): SessionData {
    if (typeof window === 'undefined') {
      return {};
    }

    const sessionStart = parseInt(sessionStorage.getItem('session_start') || '0');
    const sessionDuration = sessionStart ? Date.now() - sessionStart : 0;
    
    return {
      session_id: sessionStorage.getItem('session_id') || undefined,
      page_views_in_session: parseInt(sessionStorage.getItem('page_views') || '0'),
      session_duration: Math.round(sessionDuration / 1000), // in seconds
      entry_page: sessionStorage.getItem('entry_page') || undefined,
      exit_page: window.location.href,
      traffic_source: sessionStorage.getItem('traffic_source') || undefined,
      is_returning_visitor: localStorage.getItem('visitor_id') !== null,
      visit_count: parseInt(localStorage.getItem('visit_count') || '1'),
      days_since_last_visit: this.getDaysSinceLastVisit(),
      
      // Attribution data
      first_touch_source: localStorage.getItem('first_touch_source') || undefined,
      first_touch_medium: localStorage.getItem('first_touch_medium') || undefined,
      first_touch_campaign: localStorage.getItem('first_touch_campaign') || undefined,
      last_touch_source: sessionStorage.getItem('last_touch_source') || undefined,
      last_touch_medium: sessionStorage.getItem('last_touch_medium') || undefined,
      last_touch_campaign: sessionStorage.getItem('last_touch_campaign') || undefined,
      
      // Engagement metrics
      scroll_depth: this.sessionData.scroll_depth || 0,
      time_on_page: this.sessionData.time_on_page || 0,
      interactions: this.sessionData.interactions || 0,
      clicks: this.sessionData.clicks || 0,
      form_interactions: this.sessionData.form_interactions || 0,
    };
  }

  // Enhance user data with additional identifiers
  public enhanceUserData(userData: Partial<UserData>): UserData {
    const enhanced: UserData = { ...userData };

    if (typeof window !== 'undefined') {
      // Get client IP (approximation)
      enhanced.client_ip_address = this.getClientIP();
      
      // Get client user agent
      enhanced.client_user_agent = navigator.userAgent;
      
      // Get Facebook click ID from URL or cookie
      enhanced.fbc = this.getFacebookClickId();
      
      // Get Facebook browser ID from cookie
      enhanced.fbp = this.getFacebookBrowserId();
      
      // Generate external ID if not provided
      if (!enhanced.external_id) {
        enhanced.external_id = this.generateExternalId();
      }
      
      // Get lead ID from URL parameters
      enhanced.lead_id = this.getLeadId();
    }

    return enhanced;
  }

  // Enhance custom data with comprehensive business intelligence
  public enhanceCustomData(customData: Partial<CustomData>, formData?: Record<string, unknown>): CustomData {
    const enhanced: CustomData = { ...customData };

    if (typeof window !== 'undefined') {
      // UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      enhanced.utm_source = urlParams.get('utm_source') || undefined;
      enhanced.utm_medium = urlParams.get('utm_medium') || undefined;
      enhanced.utm_campaign = urlParams.get('utm_campaign') || undefined;
      enhanced.utm_term = urlParams.get('utm_term') || undefined;
      enhanced.utm_content = urlParams.get('utm_content') || undefined;
      
      // Form-specific data
      if (formData) {
        enhanced.form_name = formData.form_name || 'lead_form';
        enhanced.form_page = window.location.pathname;
        enhanced.form_step = formData.form_step || 'completion';
        enhanced.form_completion_time = formData.completion_time;
      }
      
      // Device/Technical data
      const deviceData = this.collectDeviceData();
      enhanced.screen_width = deviceData.screen_resolution?.split('x')[0] ? parseInt(deviceData.screen_resolution.split('x')[0]) : undefined;
      enhanced.screen_height = deviceData.screen_resolution?.split('x')[1] ? parseInt(deviceData.screen_resolution.split('x')[1]) : undefined;
      enhanced.device_type = this.getDeviceType();
      enhanced.browser_name = this.getBrowserName();
      enhanced.browser_version = this.getBrowserVersion();
      enhanced.operating_system = this.getOperatingSystem();
      enhanced.device_model = this.getDeviceModel();
      enhanced.connection_type = deviceData.connection_type;
      
      // Geographic data
      enhanced.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      enhanced.locale = navigator.language;
      enhanced.language = navigator.language.split('-')[0];
      
      // Behavioral data
      const sessionData = this.collectSessionData();
      enhanced.page_views = sessionData.page_views_in_session;
      enhanced.session_duration = sessionData.session_duration;
      
      // Business intelligence
      enhanced.lead_type = this.determineLeadType(formData);
      enhanced.lead_source = this.determineLeadSource();
      enhanced.acquisition_channel = this.determineAcquisitionChannel();
      enhanced.customer_lifetime_value = this.estimateCustomerLifetimeValue(formData);
      
      // Segmentation
      enhanced.customer_segmentation = this.determineCustomerSegmentation(sessionData);
      
      // Generate order ID if not provided
      if (!enhanced.order_id) {
        enhanced.order_id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
    }

    return enhanced;
  }

  // Private helper methods
  private collectPerformanceData() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perf = window.performance;
          const timing = perf.timing;
          
          this.performanceData = {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint(),
          };
        }, 100);
      });
    }
  }

  private trackTrafficSource() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    let source = 'direct';
    let medium = 'none';
    let campaign = 'none';
    
    if (referrer) {
      const referrerDomain = new URL(referrer).hostname;
      if (referrerDomain.includes('google')) {
        source = 'google';
        medium = 'organic';
      } else if (referrerDomain.includes('facebook')) {
        source = 'facebook';
        medium = 'social';
      } else if (referrerDomain.includes('instagram')) {
        source = 'instagram';
        medium = 'social';
      } else {
        source = referrerDomain;
        medium = 'referral';
      }
    }
    
    // Override with UTM parameters if available
    if (urlParams.get('utm_source')) {
      source = urlParams.get('utm_source')!;
      medium = urlParams.get('utm_medium') || medium;
      campaign = urlParams.get('utm_campaign') || campaign;
    }
    
    sessionStorage.setItem('traffic_source', source);
    sessionStorage.setItem('last_touch_source', source);
    sessionStorage.setItem('last_touch_medium', medium);
    sessionStorage.setItem('last_touch_campaign', campaign);
    
    // Store first touch attribution
    if (!localStorage.getItem('first_touch_source')) {
      localStorage.setItem('first_touch_source', source);
      localStorage.setItem('first_touch_medium', medium);
      localStorage.setItem('first_touch_campaign', campaign);
    }
  }

  private trackScrollDepth() {
    let maxScroll = 0;
    const trackScroll = () => {
      const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrolled > maxScroll) {
        maxScroll = scrolled;
        this.sessionData.scroll_depth = maxScroll;
      }
    };
    
    window.addEventListener('scroll', trackScroll);
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('scroll', trackScroll);
    });
  }

  private trackTimeOnPage() {
    const startTime = Date.now();
    
    const updateTime = () => {
      this.sessionData.time_on_page = Math.round((Date.now() - startTime) / 1000);
    };
    
    setInterval(updateTime, 1000);
    window.addEventListener('beforeunload', updateTime);
  }

  private getConnectionType(): string | undefined {
    const nav = navigator as any;
    return nav.connection?.type || nav.mozConnection?.type || nav.webkitConnection?.type;
  }

  private getEffectiveConnectionType(): string | undefined {
    const nav = navigator as any;
    return nav.connection?.effectiveType || nav.mozConnection?.effectiveType || nav.webkitConnection?.effectiveType;
  }

  private getDownlink(): number | undefined {
    const nav = navigator as any;
    return nav.connection?.downlink || nav.mozConnection?.downlink || nav.webkitConnection?.downlink;
  }

  private getRTT(): number | undefined {
    const nav = navigator as any;
    return nav.connection?.rtt || nav.mozConnection?.rtt || nav.webkitConnection?.rtt;
  }

  private getDeviceMemory(): number | undefined {
    const nav = navigator as any;
    return nav.deviceMemory;
  }

  private getPlugins(): string[] {
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugins.push(navigator.plugins[i].name);
    }
    return plugins;
  }

  private getTouchSupport(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private getOrientation(): string | undefined {
    const screen = window.screen as any;
    return screen.orientation?.type || screen.mozOrientation || screen.msOrientation;
  }

  private getFirstPaint(): number | undefined {
    const entries = performance.getEntriesByType('paint');
    const firstPaint = entries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  private getFirstContentfulPaint(): number | undefined {
    const entries = performance.getEntriesByType('paint');
    const firstContentfulPaint = entries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint?.startTime;
  }

  private getClientIP(): string | undefined {
    // Note: This is a placeholder. In practice, you'd get IP from server-side
    return undefined;
  }

  private getFacebookClickId(): string | undefined {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      // Format according to Meta standards: fb.subdomain.timestamp.fbclid
      const timestamp = Date.now();
      return `fb.1.${timestamp}.${fbclid}`;
    }
    
    // Check cookie
    const fbcCookie = document.cookie.split('; ').find(row => row.startsWith('_fbc='));
    return fbcCookie ? fbcCookie.split('=')[1] : undefined;
  }

  private getFacebookBrowserId(): string | undefined {
    const fbpCookie = document.cookie.split('; ').find(row => row.startsWith('_fbp='));
    return fbpCookie ? fbpCookie.split('=')[1] : undefined;
  }

  private generateExternalId(): string {
    const existingId = localStorage.getItem('external_id');
    if (existingId) {
      return existingId;
    }
    
    const newId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('external_id', newId);
    return newId;
  }

  private getLeadId(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lead_id') || undefined;
  }

  private getDaysSinceLastVisit(): number | undefined {
    const lastVisit = localStorage.getItem('last_visit');
    if (!lastVisit) return undefined;
    
    const days = Math.floor((Date.now() - parseInt(lastVisit)) / (24 * 60 * 60 * 1000));
    return days;
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getBrowserVersion(): string {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(chrome|firefox|safari|edge|opera)\/(\d+)/i);
    return match ? match[2] : 'Unknown';
  }

  private getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getDeviceModel(): string {
    const userAgent = navigator.userAgent;
    // Extract device model from user agent (simplified)
    const match = userAgent.match(/\(([^)]+)\)/);
    return match ? match[1].split(';')[0].trim() : 'Unknown';
  }

  private determineLeadType(formData?: Record<string, unknown>): string {
    if (!formData) return 'general_inquiry';
    
    const quantity = formData.quantity || '';
    if (quantity === '10+') return 'high_value_lead';
    if (quantity === '5-10') return 'medium_value_lead';
    return 'standard_lead';
  }

  private determineLeadSource(): string {
    const source = sessionStorage.getItem('traffic_source');
    if (source === 'google') return 'search_engine';
    if (source === 'facebook' || source === 'instagram') return 'social_media';
    if (source === 'direct') return 'direct_traffic';
    return 'referral';
  }

  private determineAcquisitionChannel(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utmMedium = urlParams.get('utm_medium');
    
    if (utmMedium === 'cpc') return 'paid_search';
    if (utmMedium === 'social') return 'social_media';
    if (utmMedium === 'email') return 'email_marketing';
    if (utmMedium === 'display') return 'display_advertising';
    
    return this.determineLeadSource();
  }

  private estimateCustomerLifetimeValue(formData?: Record<string, unknown>): number {
    if (!formData) return 0;
    
    const quantity = formData.quantity || '';
    const baseValue = 500; // Base value per shelf
    
    if (quantity === '10+') return baseValue * 15; // Assume 15 shelves average
    if (quantity === '5-10') return baseValue * 7.5; // Assume 7.5 shelves average
    if (quantity === '1-5') return baseValue * 3; // Assume 3 shelves average
    
    return baseValue;
  }

  private determineCustomerSegmentation(sessionData?: SessionData): 'new_customer_to_business' | 'new_customer_to_business_line' | 'new_customer_to_product_area' | 'new_customer_to_medium' | 'existing_customer_to_business' | 'existing_customer_to_business_line' | 'existing_customer_to_product_area' | 'existing_customer_to_medium' | 'customer_in_loyalty_program' {
    if (!sessionData) return 'new_customer_to_business';
    
    if (sessionData.is_returning_visitor) {
      return 'existing_customer_to_business';
    }
    
    return 'new_customer_to_business';
  }
} 