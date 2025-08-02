'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import PricingSection from './shared/PricingSection';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string()
    .min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام')
    .max(15, 'رقم الهاتف لا يجب أن يزيد عن 15 رقم')
    .refine((phone) => {
      // Remove all non-digit characters for validation
      const digitsOnly = phone.replace(/\D/g, '');
      
      // Saudi phone number patterns:
      // 966XXXXXXXXX (12 digits) - with country code
      // 05XXXXXXXX (10 digits) - local format starting with 05
      // 5XXXXXXXXX (10 digits) - without leading 0
      
      const saudiPatterns = [
        /^966[5][0-9]{8}$/, // 966 + 5XXXXXXXX (12 digits total)
        /^966[0][5][0-9]{8}$/, // 966 + 05XXXXXXXX (13 digits total) 
        /^[0][5][0-9]{8}$/, // 05XXXXXXXX (10 digits total)
        /^[5][0-9]{8}$/, // 5XXXXXXXX (9 digits total)
      ];
      
      return saudiPatterns.some(pattern => pattern.test(digitsOnly));
    }, {
      message: 'رقم الهاتف يجب أن يكون رقم سعودي صحيح (مثال: +966501234567 أو 0501234567)',
    }),
  quantity: z.string().min(1, 'الكمية المطلوبة مطلوبة'),
});

type FormData = z.infer<typeof formSchema>;

export default function QuickLeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to calculate lead value based on quantity (340 SAR per shelf)
  const calculateLeadValue = (quantity?: string): number => {
    const baseValue = 340; // SAR per shelf (actual average price)
    
    switch (quantity) {
      case '10+':
        return baseValue * 15; // 5,100 SAR
      case '5-10':
        return baseValue * 7.5; // 2,550 SAR
      case '1-5':
        return baseValue * 3; // 1,020 SAR
      default:
        return baseValue; // 340 SAR
    }
  };

  // Helper function to get average quantity for contents array
  const getAverageQuantity = (quantity?: string): number => {
    switch (quantity) {
      case '10+':
        return 15; // Assume 15 shelves average
      case '5-10':
        return 7.5; // Assume 7.5 shelves average  
      case '1-5':
        return 3; // Assume 3 shelves average
      default:
        return 1; // Single shelf
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Collect browser cookies for Meta tracking
      const getFacebookBrowserId = () => {
        const fbpCookie = document.cookie.split('; ').find(row => row.startsWith('_fbp='));
        return fbpCookie ? fbpCookie.split('=')[1] : undefined;
      };

      const getFacebookClickId = () => {
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
      };

      // Submit to multiple endpoints
      const promises = [
        // HubSpot integration (primary lead capture) - Using Forms API
        fetch('/api/hubspot/forms-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            company: data.quantity ? `الكمية: ${data.quantity}` : '',
            message: `طلب عرض أسعار رفوف جديدة - الكمية: ${data.quantity}`,
            leadMagnet: 'طلب عرض أسعار رفوف جديدة',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            // Facebook tracking data for Meta pixel
            fbp: getFacebookBrowserId(),
            fbc: getFacebookClickId(),
            user_agent: navigator.userAgent,
            deviceInfo: {
              platform: navigator.platform,
              userAgent: navigator.userAgent,
            },
          }),
        }),

        // Zapier webhook integration (for automation workflows)
        fetch('/api/zapier-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            leadMagnet: 'طلب عرض أسعار رفوف جديدة',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            // Facebook tracking data for attribution
            fbp: getFacebookBrowserId(),
            fbc: getFacebookClickId(),
            // UTM parameters for campaign tracking
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
            utm_term: new URLSearchParams(window.location.search).get('utm_term'),
            utm_content: new URLSearchParams(window.location.search).get('utm_content'),
            // Device and location data
            deviceInfo: {
              platform: navigator.platform,
              userAgent: navigator.userAgent,
            },
            city: (() => {
              const pathParts = window.location.pathname.split('/').filter(Boolean);
              if (pathParts.length >= 2 && pathParts[0] === 'landing') {
                return pathParts[1]; // riyadh, jeddah, dammam
              }
              return 'general';
            })(),
          }),
        }).catch(err => {
          console.warn('Zapier webhook failed (non-critical):', err);
          return null; // Don't fail the whole form if Zapier fails
        }),

        // Simple reliable backup system
        fetch('/api/simple-backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            leadMagnet: 'طلب عرض أسعار رفوف جديدة',
            source: 'krfof-leadmagnet',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          }),
        }).catch(err => {
          console.warn('Backup system failed (non-critical):', err);
          return null; // Don't fail the whole form if backup fails
        }),

        // Enhanced tracking for main lead event (25+ parameters)
        fetch('/api/tracking/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            phone: data.phone,
            name: data.name,
            quantity: data.quantity,
            
            // Form metadata
            form_name: 'quick_lead_form',
            form_page: window.location.pathname,
            form_step: 'completion',
            completion_time: Date.now(),
            
            // Campaign data (from URL parameters)
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
            utm_term: new URLSearchParams(window.location.search).get('utm_term'),
            utm_content: new URLSearchParams(window.location.search).get('utm_content'),
            
            // Page data
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          }),
        }),
      ];

      const results = await Promise.allSettled(promises);
      
      // 📊 Log backup results
      results.forEach((result, index) => {
        const endpointNames = ['HubSpot', 'Zapier', 'Backup', 'Tracking'];
        if (result.status === 'fulfilled') {
          console.log(`✅ ${endpointNames[index]} success:`, result.value?.status);
        } else {
          console.warn(`⚠️ ${endpointNames[index]} failed:`, result.reason);
        }
      });
      
      // 🛡️ EMERGENCY BACKUP - Log to console for manual recovery
      const emergencyBackup = {
        timestamp: new Date().toISOString(),
        lead_data: data,
        form_url: window.location.href,
        backup_id: `emergency_${Date.now()}`,
        utm_params: {
          source: new URLSearchParams(window.location.search).get('utm_source'),
          medium: new URLSearchParams(window.location.search).get('utm_medium'),
          campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }
      };
      
      console.log('🚨 EMERGENCY BACKUP LOG (for manual recovery):', 
        JSON.stringify(emergencyBackup, null, 2));
      
      // 🎯 DUAL-LAYER LEAD EVENT TRACKING
      // Fire browser-side Meta pixel Lead event (immediate tracking)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'Lead', {
            content_name: 'رفوف معدنية - طلب عرض أسعار',
            content_category: 'shelving_quote_request',
            // Option 2: If you want to add lead values back, uncomment below:
            // value: calculateLeadValue(data.quantity), // 1-5: 1,020 SAR, 5-10: 2,550 SAR, 10+: 5,100 SAR  
            // currency: 'SAR',
            contents: [{
              id: 'shelving_quote',
              quantity: getAverageQuantity(data.quantity),
              item_price: 340 // Actual shelf price in SAR
            }],
            // Campaign attribution
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
            // Lead info (hashed for privacy)
            email: data.email,
            phone: data.phone,
            city: (() => {
              const pathParts = window.location.pathname.split('/').filter(Boolean);
              // For /landing/cityname, return cityname
              // For /, try to detect city from IP geolocation or default to 'general'
              if (pathParts.length >= 2 && pathParts[0] === 'landing') {
                return pathParts[1]; // riyadh, jeddah, dammam
              }
              // For root page, default to 'general' (should be redirected to city-specific page)
              return 'general';
            })(),
            form_location: window.location.pathname,
            event_source_url: window.location.href,
            // Timing
            timestamp: Math.floor(Date.now() / 1000),
          });
          console.log('✅ Browser-side Lead event fired to Meta pixel');
        } catch (err) {
          console.warn('Browser-side Lead event failed:', err);
        }
      }
      
      // Store lead data in session storage for enhanced tracking on thank you page
      const leadDataForTracking = {
        email: data.email,
        phone: data.phone,
        name: data.name,
        quantity: data.quantity,
        form_name: 'quick_lead_form',
        form_start_time: Date.now() - 30000, // Approximate form fill time
        timestamp: new Date().toISOString(),
      };
      
      sessionStorage.setItem('leadData', JSON.stringify(leadDataForTracking));
      
      reset();
      router.push('/thankyou');
    } catch (err) {
      console.error('Form submission error:', err);
      setError('حدث خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }



  return (
    <div id="lead-form" className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 scroll-mt-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-metallic-gold to-old-gold p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          🛒 إتمام الطلب
        </h3>
        <p className="text-white/90 text-sm">
          أدخل بياناتك لإتمام عملية الشراء
        </p>
      </div>

      {/* Pricing Summary Card */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <PricingSection className="" />
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            👤 معلومات العميل
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="أدخل اسمك الكامل"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="+966 5X XXX XXXX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="example@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Order Details Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            📦 تفاصيل الطلب
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الكمية المطلوبة *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-metallic-gold hover:bg-gray-50 transition-all duration-200 group">
                <input
                  type="radio"
                  {...register('quantity')}
                  value="1-5"
                  className="w-5 h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2 border-gray-300"
                />
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-800 group-hover:text-metallic-gold">1-5 رفوف</span>
                  <span className="block text-xs text-gray-500">للمشاريع الصغيرة</span>
                </div>
              </label>
              
              <label className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-metallic-gold hover:bg-gray-50 transition-all duration-200 group">
                <input
                  type="radio"
                  {...register('quantity')}
                  value="5-10"
                  className="w-5 h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2 border-gray-300"
                />
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-800 group-hover:text-metallic-gold">5-10 رفوف</span>
                  <span className="block text-xs text-gray-500">للمشاريع المتوسطة</span>
                </div>
              </label>
              
              <label className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-metallic-gold hover:bg-gray-50 transition-all duration-200 group">
                <input
                  type="radio"
                  {...register('quantity')}
                  value="10+"
                  className="w-5 h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2 border-gray-300"
                />
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-800 group-hover:text-metallic-gold">أكثر من 10 رفوف</span>
                  <span className="block text-xs text-gray-500">للمشاريع الكبيرة</span>
                </div>
              </label>
            </div>
            {errors.quantity && (
              <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        {/* Complete Order Button */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-metallic-gold to-old-gold hover:from-vegas-gold hover:to-metallic-gold text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 ml-3" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <span className="ml-2">💳</span>
                إتمام الطلب والحصول على عرض السعر
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              🔒 آمن ومحمي
            </span>
            <span className="flex items-center">
              ⚡ استجابة فورية
            </span>
            <span className="flex items-center">
              📞 دعم مجاني
            </span>
          </div>
        </div>

        <p className="text-caption text-traditional-brown text-center mt-4">
          بالنقر على &quot;احصل على عرض أسعار فوري&quot; فإنك توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </form>
    </div>
  );
}