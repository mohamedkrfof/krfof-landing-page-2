// Shared type definitions for the application
export interface FormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
}

export interface LeadData extends FormData {
  company?: string;
  message?: string;
  timestamp?: string;
  leadMagnet?: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  userAgent?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  screenWidth?: number;
  screenHeight?: number;
  timezone?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface CityConfig {
  name: string;
  arabicName: string;
  benefits: Benefit[];
  specialFeatures: SpecialFeature[];
  deliveryInfo: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  border: string;
  iconBg: string;
}

export interface SpecialFeature {
  icon: string;
  text: string;
}

export interface ProductSpec {
  icon: string;
  text: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string;
} 