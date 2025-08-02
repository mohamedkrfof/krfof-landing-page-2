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
    <div id="lead-form" className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-metallic-gold scroll-mt-8">
      <div className="text-center mb-6">
        <h3 className="text-heading-2 font-bold text-chocolate-brown mb-3">
          احصل على عرض أسعار مجاني الآن
        </h3>
        <p className="text-traditional-brown text-body">
          أدخل بياناتك وسنتواصل معك في أسرع وقت
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-small">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="form-label block text-traditional-brown mb-2">
              الاسم الكامل *
            </label>
            <input
              {...register('name')}
              type="text"
              className="form-input w-full p-4 border-2 border-light-brown rounded-xl focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-colors"
              placeholder="أدخل اسمك الكامل"
            />
            {errors.name && (
              <p className="form-error mt-2 text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="form-label block text-traditional-brown mb-2">
              رقم الهاتف *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="form-input w-full p-4 border-2 border-light-brown rounded-xl focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-colors"
              placeholder="+966 5X XXX XXXX"
            />
            {errors.phone && (
              <p className="form-error mt-2 text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label block text-traditional-brown mb-2">
            البريد الإلكتروني *
          </label>
          <input
            {...register('email')}
            type="email"
            className="form-input w-full p-4 border-2 border-light-brown rounded-xl focus:ring-2 focus:ring-metallic-gold focus:border-metallic-gold transition-colors"
            placeholder="example@company.com"
          />
          {errors.email && (
            <p className="form-error mt-2 text-red-600">{errors.email.message}</p>
          )}
        </div>



        <div>
          <label className="form-label block text-traditional-brown mb-4">
            الكمية المطلوبة تقريباً *
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <label className="flex items-center p-2 md:p-4 border-2 border-light-brown rounded-xl cursor-pointer hover:border-metallic-gold transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="1-5"
                className="w-4 h-4 md:w-5 md:h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-small md:text-body font-medium text-traditional-brown">1-5 رفوف</span>
            </label>
            
            <label className="flex items-center p-2 md:p-4 border-2 border-light-brown rounded-xl cursor-pointer hover:border-metallic-gold transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="5-10"
                className="w-4 h-4 md:w-5 md:h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-small md:text-body font-medium text-traditional-brown">5-10 رفوف</span>
            </label>
            
            <label className="flex items-center p-2 md:p-4 border-2 border-light-brown rounded-xl cursor-pointer hover:border-metallic-gold transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="10+"
                className="w-4 h-4 md:w-5 md:h-5 text-metallic-gold focus:ring-metallic-gold focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-small md:text-body font-medium text-traditional-brown">أكثر من 10 رفوف</span>
            </label>
          </div>
          {errors.quantity && (
            <p className="form-error mt-2 text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        {/* Pricing Section */}
        <div className="my-6">
          <PricingSection className="" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-text w-full bg-gradient-to-r from-metallic-gold to-old-gold hover:from-vegas-gold hover:to-metallic-gold text-white font-bold py-4 px-8 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-6 h-6 ml-3" />
              جاري الإرسال...
            </>
          ) : (
            '🚀 احصل على عرض أسعار فوري'
          )}
        </button>

        <p className="text-caption text-traditional-brown text-center mt-4">
          بالنقر على &quot;احصل على عرض أسعار فوري&quot; فإنك توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </form>
    </div>
  );
}