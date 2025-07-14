'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Phone, Mail, Clock, Award } from 'lucide-react';
import Header from '@/components/shared/Header';

export default function ThankYouPage() {
  const [leadData, setLeadData] = useState<Record<string, unknown> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get lead data from session storage
    const storedLeadData = sessionStorage.getItem('leadData');
    if (storedLeadData) {
      setLeadData(JSON.parse(storedLeadData));
    }

    // Track thank you page view
    if (typeof window !== 'undefined') {
      // Track with pixels
      fetch('/api/pixels/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'thank_you_page_view',
          url: window.location.href,
          leadData: storedLeadData ? JSON.parse(storedLeadData) : null,
        }),
      });

      // Track conversion with enhanced tracking
      fetch('/api/tracking/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'conversion_completed',
          url: window.location.href,
          leadData: storedLeadData ? JSON.parse(storedLeadData) : null,
        }),
      });
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-gold to-light-gold flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-metallic-gold rounded-full mx-auto mb-4"></div>
          <div className="w-32 h-4 bg-metallic-gold rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-gold to-light-gold" dir="rtl">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-hero font-bold text-chocolate-brown mb-4">
            شكراً لك!
          </h1>
          
          <p className="text-lead text-traditional-brown mb-8 max-w-2xl mx-auto">
            تم استلام طلبك بنجاح. سيتواصل معك فريق المبيعات في أقرب وقت ممكن لتقديم عرض أسعار مخصص لاحتياجاتك.
          </p>

          {leadData && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-metallic-gold mb-8 max-w-md mx-auto">
              <h3 className="text-heading-3 font-bold text-chocolate-brown mb-4">
                بيانات طلبك
              </h3>
              <div className="space-y-3 text-right">
                <div className="flex justify-between items-center">
                  <span className="text-body text-traditional-brown">الاسم:</span>
                  <span className="text-body font-semibold text-chocolate-brown">{leadData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body text-traditional-brown">رقم الهاتف:</span>
                  <span className="text-body font-semibold text-chocolate-brown">{leadData.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body text-traditional-brown">البريد الإلكتروني:</span>
                  <span className="text-body font-semibold text-chocolate-brown">{leadData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body text-traditional-brown">الكمية المطلوبة:</span>
                  <span className="text-body font-semibold text-chocolate-brown">{leadData.quantity} رفوف</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-metallic-gold">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full flex items-center justify-center ml-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-heading-3 font-bold text-chocolate-brown">
                مكالمة هاتفية
              </h3>
            </div>
            <p className="text-body text-traditional-brown">
              سيتصل بك مستشار المبيعات خلال 24 ساعة لمناقشة متطلباتك وتقديم استشارة مجانية.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-metallic-gold">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full flex items-center justify-center ml-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-heading-3 font-bold text-chocolate-brown">
                عرض أسعار مخصص
              </h3>
            </div>
            <p className="text-body text-traditional-brown">
              ستحصل على عرض أسعار مفصل يشمل المواصفات والتكاليف وخيارات التوصيل.
            </p>
          </div>
        </div>

        {/* Key Benefits Reminder */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-metallic-gold mb-8">
          <h3 className="text-heading-2 font-bold text-chocolate-brown mb-6 text-center">
            لماذا اخترت الحل الأمثل؟
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-heading-3 font-bold text-chocolate-brown mb-2">
                جودة عالية
              </h4>
              <p className="text-body text-traditional-brown">
                رفوف جديدة تماماً بمواصفات عالمية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-heading-3 font-bold text-chocolate-brown mb-2">
                ضمان شامل
              </h4>
              <p className="text-body text-traditional-brown">
                ضمان كامل على جميع المنتجات
              </p>
            </div>

            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-r from-metallic-gold to-old-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-heading-3 font-bold text-chocolate-brown mb-2">
                توصيل سريع
              </h4>
              <p className="text-body text-traditional-brown">
                توصيل مجاني لجميع المناطق
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-metallic-gold to-old-gold rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-heading-2 font-bold mb-4">
            هل لديك استفسار عاجل؟
          </h3>
          <p className="text-body mb-6">
            يمكنك التواصل معنا مباشرة على الرقم التالي
          </p>
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            <Phone className="w-6 h-6" />
            <span className="text-heading-3 font-bold">+966 50 977 0658</span>
          </div>
        </div>
      </div>
    </div>
  );
} 