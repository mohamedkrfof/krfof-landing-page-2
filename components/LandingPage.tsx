'use client';

import { useEffect } from 'react';
import { Crown, CheckCircle, Wrench, Shield, Clock, Ruler } from 'lucide-react';
import Image from 'next/image';
import QuickLeadForm from './QuickLeadForm';
import Header from './shared/Header';
import NoticeBanner from './shared/NoticeBanner';
import BenefitsGrid from './shared/BenefitsGrid';
import ProductSpecs from './shared/ProductSpecs';
import { CityConfig } from '@/lib/types';

interface LandingPageProps {
  config: CityConfig;
}

const iconMap = {
  Clock,
  Wrench,
  Shield,
  Package: CheckCircle,
};

export default function LandingPage({ config }: LandingPageProps) {
  // Track ViewContent event on page load
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('track', 'ViewContent', {
          content_name: `رفوف تخزين معدنية - ${config.arabicName}`,
          content_category: 'lead_magnet',
          content_type: 'product_catalog',
          value: 1,
          currency: 'SAR',
          city: config.arabicName,
          page_type: 'landing_page',
          event_source_url: window.location.href,
          referrer: document.referrer || undefined,
          timestamp: Math.floor(Date.now() / 1000),
        });
        console.log('✅ ViewContent event fired for landing page');
      } catch (err) {
        console.warn('ViewContent event failed:', err);
      }
    }
  }, [config.arabicName]);

  const productImages = [
    { src: '/26262636.jpeg', alt: 'رف تخزين معدني قوي' },
    { src: '/71udlh+9LIL.jpg', alt: 'رف تخزين متعدد الطوابق' },
    { src: '/EstanteMetalico200x150x50400kgportada.jpg.webp', alt: 'رف معدني بحمولة 400 كيلو' },
    { src: '/H14fed00dc95841fd87aab28906701ee2f.jpg.avif', alt: 'رف تخزين صناعي' },
    { src: '/H6b71a8c0b0ca42b183ef3d596811a6f1R.jpg', alt: 'رف تخزين للمستودعات' },
    { src: '/Hbcaacf9a0b9f4914b228d40210c7bf308.jpg.avif', alt: 'رف تخزين متين' },
    { src: '/Regal-metalowy-magazynowy-MRC-5-H-2000mm-4-polki.jpeg', alt: 'رف تخزين بارتفاع 2 متر' },
    { src: '/a6t9c2rh0w6b1mmzirsbg9q80ikwli1i.jpg', alt: 'رف تخزين احترافي' }
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />
      <NoticeBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chocolate-brown/5 via-transparent to-traditional-brown/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-cream-gold to-light-brown text-chocolate-brown px-4 py-2 rounded-full text-small font-semibold mb-6 sm:mb-8 shadow-sm">
              <Crown className="w-4 h-4 ml-2" />
              الرفوف الجديدة عالية الجودة - لا نتعامل مع المستعملة
            </div>
            
            <h1 className="text-hero font-bold text-transparent bg-clip-text bg-gradient-to-r from-chocolate-brown via-traditional-brown to-chocolate-brown mb-6 sm:mb-8">
              رفوف التخزين المثالية للمؤسسات والشركات
              <span className="block text-heading-1 mt-2 bg-gradient-to-r from-metallic-gold to-old-gold bg-clip-text text-transparent">
                بجودة استثنائية
              </span>
            </h1>
            
            <p className="text-lead text-traditional-brown mb-8 sm:mb-12 max-w-4xl mx-auto font-medium">
              تتحمل حتى 200 كيلو للرف الواحد، مواد مقاومة للصدأ والتآكل
              <span className="block text-body text-warm-brown mt-2 font-semibold">
                {config.deliveryInfo}
              </span>
            </p>

            {/* Product Hero Image */}
            <div className="mb-8 sm:mb-12">
              <div className="max-w-2xl mx-auto">
                <img
                  src="/a6t9c2rh0w6b1mmzirsbg9q80ikwli1i.jpg"
                  alt="رفوف معدنية احترافية عالية الجودة للمستودعات والمخازن"
                  className="w-full h-auto rounded-2xl shadow-2xl border-4 border-metallic-gold"
                />
              </div>
            </div>

            <BenefitsGrid benefits={config.benefits} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              {/* City Special Features */}
              {config.specialFeatures.length > 0 && (
                <div className="bg-gradient-to-r from-metallic-gold to-classic-gold border-r-4 border-vegas-gold p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
                  <h3 className="text-heading-3 font-bold text-chocolate-brown mb-3 sm:mb-4">
                    مميزات خاصة لعملاء {config.arabicName}:
                  </h3>
                  <div className="space-y-3">
                    {config.specialFeatures.map((feature, index) => {
                      const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
                      return (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-chocolate-brown" />
                          <span className="text-chocolate-brown font-medium text-body">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <ProductSpecs />

              {/* Key Features */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-body text-chocolate-brown">لا يحتاج تثبيت في الجدار - ثابت وآمن</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-body text-chocolate-brown">أرفف قابلة للتعديل حسب احتياجاتك</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-body text-chocolate-brown">متينة وتدوم لفترة طويلة - مقاومة للرطوبة والحرارة</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cream-gold to-light-brown border-r-4 border-vegas-gold p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warm-brown ml-2" />
                  <p className="text-chocolate-brown font-semibold text-body">مساعدة في الحساب</p>
                </div>
                <p className="text-traditional-brown text-body">
                  نساعدك في حساب عدد الرفوف المطلوبة والأحجام المناسبة لمساحتك
                </p>
              </div>

              {/* Available Options */}
              <div className="bg-gradient-to-r from-light-gold to-cream-gold border-r-4 border-classic-gold p-4 sm:p-6 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-small text-traditional-brown font-medium">متوفر بألوان مختلفة</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-small text-traditional-brown font-medium">أحجام متنوعة حسب الحاجة</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <QuickLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Product Images Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-heading-1 font-bold text-chocolate-brown mb-4">
              أمثلة من منتجاتنا
            </h2>
            <p className="text-lead text-traditional-brown max-w-3xl mx-auto">
              رفوف تخزين عالية الجودة مصممة خصيصاً للاستخدام التجاري والصناعي
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {productImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-cream-gold">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-small text-traditional-brown font-medium text-center">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 