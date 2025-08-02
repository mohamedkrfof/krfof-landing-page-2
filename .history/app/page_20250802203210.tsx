'use client';

import QuickLeadForm from '@/components/QuickLeadForm';
import { Award, Clock, Shield, CheckCircle, Star, Phone, MapPin, Truck, Package, Wrench, Crown, AlertTriangle, Ruler, Weight } from 'lucide-react';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IPGeolocationService } from '@/lib/ipGeolocation';
import FadeIn from '@/components/motion-primitives/fade-in';
import StaggerContainer, { StaggerItem } from '@/components/motion-primitives/stagger-container';
import Floating from '@/components/motion-primitives/floating';
import Shimmer from '@/components/motion-primitives/shimmer';
import GradientText from '@/components/motion-primitives/gradient-text';
import Pulse from '@/components/motion-primitives/pulse';
import 'keen-slider/keen-slider.min.css';

export default function HomePage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Intelligent city-based redirect
    const redirectToCity = async () => {
      try {
        // Get user's IP and detect city
        const response = await fetch('/api/geolocation');
        if (response.ok) {
          const geoData = await response.json();
          const city = geoData.city?.toLowerCase();
          
          // Map detected cities to landing pages
          const cityMappings: { [key: string]: string } = {
            // Riyadh
            'riyadh': '/landing/riyadh',
            'الرياض': '/landing/riyadh',
            
            // Jeddah
            'jeddah': '/landing/jeddah',
            'جدة': '/landing/jeddah',
            
            // Dammam
            'dammam': '/landing/dammam',
            'الدمام': '/landing/dammam',
            
            // Qassim
            'qassim': '/landing/general',
            'القصيم': '/landing/general',
            
            // Madinah
            'madinah': '/landing/general',
            'المدينة المنورة': '/landing/general',
            'medina': '/landing/general',
            
            // Al Kharj
            'al kharj': '/landing/general',
            'الخرج': '/landing/general',
            'kharj': '/landing/general',
            
            // Al Muzahimiyah
            'al muzahimiyah': '/landing/general',
            'المزاحمية': '/landing/general',
            'muzahimiyah': '/landing/general',
            
            // Makkah
            'makkah': '/landing/general',
            'مكة': '/landing/general',
            'mecca': '/landing/general',
            
            // Taif
            'taif': '/landing/general',
            'الطائف': '/landing/general',
            
            // Khobar
            'khobar': '/landing/general',
            'الخبر': '/landing/general',
            'al khobar': '/landing/general',
            
            // Al Ahsa
            'al ahsa': '/landing/general',
            'الأحساء': '/landing/general',
            'ahsa': '/landing/general',
            
            // Jubail
            'jubail': '/landing/general',
            'الجبيل': '/landing/general',
            
            // Qatif
            'qatif': '/landing/general',
            'القطيف': '/landing/general',
            
            // Dhahran
            'dhahran': '/landing/general',
            'الطهران': '/landing/general',
            
            // Baqiq
            'baqiq': '/landing/general',
            'بقيق': '/landing/general',
          };
          
          if (city && cityMappings[city]) {
            console.log(`🌍 Redirecting to ${cityMappings[city]} based on detected city: ${city}`);
            router.push(cityMappings[city]);
            return;
          }
        }
      } catch (error) {
        console.warn('Geolocation redirect failed, showing general page:', error);
      }
      
      // No redirect needed, show general page
      setIsRedirecting(false);
    };

    redirectToCity();
  }, [router]);
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'free',
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 3,
          spacing: 25,
        },
      },
    },
  });

  // Removed preloader - page loads immediately

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gold via-white to-cream-gold" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-metallic-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="شركة خبراء الرفوف المحدودة"
                width={120}
                height={84}
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            <div className="flex items-center" dir="ltr">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-traditional-brown ml-2" />
              <span className="text-sm sm:text-base font-medium text-traditional-brown">+966 50 977 0658</span>
            </div>
          </div>
        </div>
      </header>

      {/* Important Notice - No Used Shelves */}
      <FadeIn delay={0.2} direction="down">
        <div className="bg-gradient-to-r from-cream-gold to-light-brown border-b border-metallic-gold">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Pulse color="rgba(255, 193, 7, 0.3)">
              <div className="flex items-center justify-center text-center">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warm-brown ml-2" />
                <p className="text-chocolate-brown font-semibold text-sm sm:text-lg">
                  تنبيه مهم: نحن متخصصون في الرفوف الجديدة فقط - لا نتعامل مع الرفوف المستعملة نهائياً
                </p>
              </div>
            </Pulse>
          </div>
        </div>
      </FadeIn>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-chocolate-brown/5 via-transparent to-traditional-brown/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            {/* Main Headline - First Thing Clients See */}
            <FadeIn delay={0.4}>
              <Shimmer className="inline-block mb-6 sm:mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-cream-gold to-light-brown text-chocolate-brown px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                  <Crown className="w-4 h-4 ml-2" />
                  الرفوف الجديدة عالية الجودة - لا نتعامل مع المستعملة
                </div>
              </Shimmer>
            </FadeIn>
            
            <FadeIn delay={0.6}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight">
                <GradientText colors={['#8B4513', '#A0522D', '#CD853F', '#8B4513']}>
                  رفوف التخزين المثالية للمؤسسات والشركات
                </GradientText>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">
                  <GradientText colors={['#FFD700', '#FFA500', '#FF8C00', '#FFD700']}>
                    بجودة استثنائية
                  </GradientText>
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.8}>
              <p className="text-xl sm:text-2xl md:text-3xl text-traditional-brown mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
                تتحمل حتى 200 كيلو للرف الواحد، مواد مقاومة للصدأ والتآكل
                <span className="block text-lg sm:text-xl md:text-2xl text-warm-brown mt-2 font-semibold">
                    توصيل مجاني للرياض وجدة والدمام، كميات كبيرة مع خصومات وضمان لمدة عام كامل
                </span>
              </p>
            </FadeIn>

            {/* Product Hero Image */}
            <FadeIn delay={1.0}>
              <div className="mb-8 sm:mb-12">
                <div className="max-w-2xl mx-auto">
                  <Floating duration={4} intensity={8}>
                    <Shimmer>
                      <img
                        src="/a6t9c2rh0w6b1mmzirsbg9q80ikwli1i.jpg"
                        alt="رفوف معدنية احترافية عالية الجودة للمستودعات والمخازن"
                        className="w-full h-auto rounded-2xl shadow-2xl border-4 border-metallic-gold"
                      />
                    </Shimmer>
                  </Floating>
                </div>
              </div>
            </FadeIn>

            {/* Key Benefits - Professional Gold/Brown Combinations */}
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto">
              <StaggerItem>
                <Shimmer className="bg-gradient-to-br from-light-gold to-cream-gold p-4 sm:p-6 rounded-2xl shadow-lg border border-metallic-gold hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-classic-gold rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-6 h-6 text-chocolate-brown" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-2">جودة استثنائية</h3>
                  <p className="text-sm sm:text-base text-traditional-brown">مواد عالية الجودة مقاومة للصدأ والتآكل</p>
                </Shimmer>
              </StaggerItem>
              
              <StaggerItem>
                <Shimmer className="bg-gradient-to-br from-cream-gold to-light-brown p-4 sm:p-6 rounded-2xl shadow-lg border border-old-gold hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-metallic-gold rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-chocolate-brown" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-2">توصيل مجاني</h3>
                  <p className="text-sm sm:text-base text-traditional-brown">توصيل مجاني للرياض وجدة والدمام</p>
                </Shimmer>
              </StaggerItem>
              
              <StaggerItem>
                <Shimmer className="bg-gradient-to-br from-light-brown to-cream-gold p-4 sm:p-6 rounded-2xl shadow-lg border border-vegas-gold hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-vegas-gold rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-chocolate-brown" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-2">كميات كبيرة</h3>
                  <p className="text-sm sm:text-base text-traditional-brown">مخزون كبير مع خصومات للكميات</p>
                </Shimmer>
              </StaggerItem>
              
              <StaggerItem>
                <Pulse color="rgba(255, 193, 7, 0.3)">
                  <Shimmer className="bg-gradient-to-br from-cream-gold to-light-gold p-4 sm:p-6 rounded-2xl shadow-lg border border-classic-gold hover:shadow-xl transition-shadow duration-300">
                    <div className="w-12 h-12 bg-classic-gold rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-chocolate-brown" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-2">ضمان عام كامل</h3>
                    <p className="text-sm sm:text-base text-traditional-brown">ضمان شامل لمدة سنة كاملة على جميع المنتجات</p>
                  </Shimmer>
                </Pulse>
              </StaggerItem>
            </StaggerContainer>


          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              {/* Product Specifications */}
              <div className="bg-gradient-to-r from-light-gold to-cream-gold border-r-4 border-classic-gold p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-3 sm:mb-4">المواصفات التقنية:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-traditional-brown font-medium text-sm sm:text-base">الحجم: 200×200×60 سم</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-traditional-brown font-medium text-sm sm:text-base">تحمل: 200 كيلو لكل رف</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-traditional-brown font-medium text-sm sm:text-base">4 أرفف قابلة للتعديل</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-traditional-brown font-medium text-sm sm:text-base">مقاوم للصدأ والتآكل</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-base sm:text-lg text-chocolate-brown">لا يحتاج تثبيت في الجدار - ثابت وآمن</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-base sm:text-lg text-chocolate-brown">أرفف قابلة للتعديل حسب احتياجاتك</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-chocolate-brown" />
                  </div>
                  <p className="text-base sm:text-lg text-chocolate-brown">متينة وتدوم لفترة طويلة - مقاومة للرطوبة والحرارة</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cream-gold to-light-brown border-r-4 border-vegas-gold p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warm-brown ml-2" />
                  <p className="text-chocolate-brown font-semibold text-sm sm:text-base">مساعدة في الحساب</p>
                </div>
                <p className="text-traditional-brown text-sm sm:text-base">
                  نساعدك في حساب عدد الرفوف المطلوبة والأحجام المناسبة لمساحتك
                </p>
              </div>

              {/* Available Options */}
              <div className="bg-gradient-to-r from-light-gold to-cream-gold border-r-4 border-classic-gold p-4 sm:p-6 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-sm text-traditional-brown font-medium">متوفر بألوان مختلفة</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
                    <span className="text-sm text-traditional-brown font-medium">أحجام متنوعة حسب الحاجة</span>
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

      {/* Product Images Slider */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="keen-slider" ref={sliderRef}>
            {[
              { src: '/26262636.jpeg', alt: 'رف تخزين معدني قوي' },
              { src: '/71udlh+9LIL.jpg', alt: 'رف تخزين متعدد الطوابق' },
              { src: '/EstanteMetalico200x150x50400kgportada.jpg.webp', alt: 'رف معدني بحمولة 400 كيلو' },
              { src: '/H14fed00dc95841fd87aab28906701ee2f.jpg.avif', alt: 'رف تخزين صناعي' },
              { src: '/H6b71a8c0b0ca42b183ef3d596811a6f1R.jpg', alt: 'رف تخزين للمستودعات' },
              { src: '/Hbcaacf9a0b9f4914b228d40210c7bf308.jpg.avif', alt: 'رف تخزين متين' },
              { src: '/Regal-metalowy-magazynowy-MRC-5-H-2000mm-4-polki.jpeg', alt: 'رف تخزين بارتفاع 2 متر' },
              { src: '/a6t9c2rh0w6b1mmzirsbg9q80ikwli1i.jpg', alt: 'رف تخزين احترافي' }
            ].map((image, index) => (
              <div key={index} className="keen-slider__slide">
                <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-cream-gold">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-chocolate-brown to-traditional-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-classic-gold mb-6">
            جاهز لتحويل مستودعك؟
          </h2>
          <p className="text-xl sm:text-2xl text-light-gold mb-8 max-w-3xl mx-auto">
            احصل على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#lead-form"
              className="bg-classic-gold text-chocolate-brown px-8 py-4 rounded-lg font-bold text-lg hover:bg-metallic-gold transition-colors duration-200 shadow-lg"
            >
              احصل على عرض أسعار مجاني
            </a>
            <a
              href="https://wa.me/966509770658?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته%0A%0Aأرغب%20في%20الاستفسار%20عن%20عروض%20أسعار%20الرفوف%20المعدنية%20الجديدة%20وأحتاج%20إلى%3A%0A%0A-%20عرض%20أسعار%20مفصل%0A-%20معرفة%20الكميات%20المتوفرة%0A-%20تفاصيل%20التوصيل%20والتركيب%0A%0Aشكراً%20لكم"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-warm-brown text-light-gold px-8 py-4 rounded-lg font-bold text-lg hover:bg-deep-brown transition-colors duration-200 shadow-lg flex items-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-brown text-light-gold py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">شركة خبراء الرفوف المحدودة</h3>
              <p className="text-cream-gold mb-4">
                نحن متخصصون في توفير حلول الرفوف الجديدة عالية الجودة للمؤسسات والشركات في جميع أنحاء المملكة العربية السعودية.
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-warm-brown rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-classic-gold" />
                </div>
                <div className="w-10 h-10 bg-warm-brown rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-classic-gold" />
                </div>
                <div className="w-10 h-10 bg-warm-brown rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-classic-gold" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-cream-gold">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 ml-2 text-classic-gold" />
                  رفوف تخزين جديدة
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 ml-2 text-classic-gold" />
                  توصيل وتركيب مجاني
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 ml-2 text-classic-gold" />
                  استشارات مجانية
                </li>
                <li className="flex items-center">
                  <Shield className="w-4 h-4 ml-2 text-classic-gold" />
                  ضمان شامل لمدة عام كامل
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-3 text-cream-gold">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-2 text-classic-gold" />
                  <span>+966 50 977 0658</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2 text-classic-gold" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-warm-brown mt-8 pt-8 text-center text-cream-gold">
            <p>&copy; 2024 شركة خبراء الرفوف المحدودة. جميع الحقوق محفوظة.</p>
            <p className="mt-2 text-sm">رفوف جديدة عالية الجودة - لا نتعامل مع المستعملة</p>
          </div>
        </div>
      </footer>

    </div>
  );
}