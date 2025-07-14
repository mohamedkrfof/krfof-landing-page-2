// Enhanced Tracking Types
export interface EnhancedTrackingEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: string;
  referrer_url?: string;
  user_data: UserData;
  custom_data: CustomData;
  device_data?: DeviceData;
  session_data?: SessionData;
}

// User Data for tracking events
export interface UserData {
  em?: string; // hashed email
  ph?: string; // hashed phone
  fn?: string; // hashed first name
  ln?: string; // hashed last name
  ge?: string; // hashed gender
  db?: string; // hashed date of birth
  ct?: string; // hashed city
  st?: string; // hashed state
  zp?: string; // hashed zip code
  country?: string; // hashed country
  external_id?: string; // hashed external ID
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string; // Facebook click ID
  fbp?: string; // Facebook browser ID
  subscription_id?: string;
  fb_login_id?: string;
  lead_id?: string;
}

// Custom Data for tracking events
export interface CustomData {
  currency?: string;
  value?: number;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    item_price: number;
  }>;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  status?: string;
  lead_type?: string;
  lead_source?: string;
  acquisition_channel?: string;
  customer_lifetime_value?: number;
  customer_segmentation?: string;
  predicted_ltv?: number;
  delivery_category?: string;
  custom_data?: Record<string, unknown>;
}

// Device Data for enhanced tracking
export interface DeviceData {
  user_agent?: string;
  browser_name?: string;
  browser_version?: string;
  os_name?: string;
  os_version?: string;
  device_type?: string;
  device_model?: string;
  screen_width?: number;
  screen_height?: number;
  screen_density?: number;
  viewport_width?: number;
  viewport_height?: number;
  color_depth?: number;
  pixel_ratio?: number;
  touch_support?: boolean;
  hardware_concurrency?: number;
  device_memory?: number;
  connection_type?: string;
  effective_connection_type?: string;
  downlink?: number;
  rtt?: number;
  timezone?: string;
  language?: string;
  accept_language?: string;
  plugins?: string[];
  webgl_vendor?: string;
  webgl_renderer?: string;
  canvas_fingerprint?: string;
  audio_fingerprint?: string;
  orientation?: string;
  do_not_track?: boolean;
  cookies_enabled?: boolean;
  local_storage_enabled?: boolean;
  session_storage_enabled?: boolean;
  webrtc_ips?: string[];
  battery_level?: number;
  charging_status?: boolean;
  network_information?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  geolocation?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
}

// Session Data for enhanced tracking
export interface SessionData {
  session_id?: string;
  session_start?: number;
  session_duration?: number;
  page_views?: number;
  is_returning_visitor?: boolean;
  days_since_last_visit?: number;
  visitor_id?: string;
  first_visit?: number;
  last_visit?: number;
  visit_count?: number;
  traffic_source?: string;
  referrer?: string;
  landing_page?: string;
  exit_page?: string;
  time_on_page?: number;
  scroll_depth?: number;
  bounce_rate?: number;
  conversion_path?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  performance_data?: {
    first_paint?: number;
    first_contentful_paint?: number;
    dom_content_loaded?: number;
    load_complete?: number;
    cumulative_layout_shift?: number;
    first_input_delay?: number;
    largest_contentful_paint?: number;
  };
}

// Platform-specific event types
export interface MetaEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: string;
  referrer_url?: string;
  user_data: UserData;
  custom_data: CustomData;
  customer_segmentation?: string;
  data_processing_options?: string[];
}

export interface GoogleEvent {
  client_id: string;
  events: Array<{
    name: string;
    params: Record<string, unknown>;
  }>;
  user_properties?: Record<string, { value: unknown }>;
}

export interface TikTokEvent {
  pixel_code: string;
  event: string;
  event_id: string;
  timestamp: string;
  context: {
    page: {
      url: string;
      referrer?: string;
    };
    user: {
      email?: string;
      phone_number?: string;
      external_id?: string;
    };
    ad?: {
      callback?: string;
    };
  };
  properties?: Record<string, unknown>;
}

export interface SnapchatEvent {
  pixel_id: string;
  event: string;
  event_conversion_type: string;
  event_tag: string;
  timestamp: number;
  hashed_email?: string;
  hashed_phone_number?: string;
  hashed_mobile_ad_id?: string;
  user_agent?: string;
  ip_address?: string;
}

// Tracking response types
export interface TrackingResponse {
  platform: string;
  success: boolean;
  event_id: string;
  error?: string;
  response_data?: unknown;
  timestamp: number;
}

export interface MultiPlatformTrackingResponse {
  event_id: string;
  results: TrackingResponse[];
  success_count: number;
  failure_count: number;
  total_platforms: number;
  timestamp: number;
}

// Configuration types
export interface PlatformConfig {
  enabled: boolean;
  retry_attempts?: number;
  timeout?: number;
}

export interface MetaPlatformConfig extends PlatformConfig {
  dataset_id: string;
  pixel_id: string;
  api_version: string;
}

export interface GooglePlatformConfig extends PlatformConfig {
  measurement_id: string;
}

export interface TikTokPlatformConfig extends PlatformConfig {
  pixel_id: string;
}

export interface SnapchatPlatformConfig extends PlatformConfig {
  pixel_id: string;
}

export interface TrackingConfig {
  platforms: {
    meta: MetaPlatformConfig;
    google: GooglePlatformConfig;
    tiktok: TikTokPlatformConfig;
    snapchat: SnapchatPlatformConfig;
    twitter: PlatformConfig;
    linkedin: PlatformConfig;
    pinterest: PlatformConfig;
  };
  default_currency: string;
  timezone: string;
  enable_debug: boolean;
  batch_size: number;
  batch_timeout: number;
  collect_device_data: boolean;
  collect_session_data: boolean;
  collect_performance_data: boolean;
  respect_do_not_track: boolean;
  gdpr_compliance: boolean;
  ccpa_compliance: boolean;
  hash_algorithm: string;
  normalize_before_hash: boolean;
  log_errors: boolean;
  retry_failed_requests: boolean;
  fallback_platforms: string[];
}

// Lead data input type
export interface LeadData {
  email: string;
  phone: string;
  name: string;
  quantity?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  company?: string;
  industry?: string;
  company_size?: string;
  job_title?: string;
  interest_level?: string;
  budget_range?: string;
  timeline?: string;
  form_name?: string;
  form_page?: string;
  form_step?: string;
  completion_time?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  url?: string;
  referrer?: string;
  timestamp?: string;
  client_ip?: string;
  user_agent?: string;
  [key: string]: any;
}

// Error types
export interface TrackingError {
  platform: string;
  error_code?: string;
  error_message: string;
  error_type?: string;
  timestamp: number;
  request_data?: unknown;
  response_data?: unknown;
}

// Debug types
export interface DebugInfo {
  enhanced_parameters: {
    total_count: number;
    user_data_count: number;
    custom_data_count: number;
    form_data_count: number;
    meta_data_count: number;
  };
  expected_enrichments: Record<string, string>;
  platform_specific_parameters: Record<string, Record<string, string>>;
} 