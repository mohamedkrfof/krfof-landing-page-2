'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام'),
  quantity: z.string().min(1, 'الكمية المطلوبة مطلوبة'),
});

type FormData = z.infer<typeof formSchema>;

export default function QuickLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to multiple endpoints
      const promises = [
        // Zapier webhook (handles HubSpot integration)
        fetch('https://hooks.zapier.com/hooks/catch/19651289/2a1vdak/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            leadMagnet: 'طلب عرض أسعار رفوف جديدة',
            source: 'krfof-leadmagnet',
            timestamp: new Date().toISOString(),
          }),
        }),

        // Pixel tracking
        fetch('/api/pixels/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_generated',
            data: data,
          }),
        }),
      ];

      await Promise.all(promises);
      setIsSubmitted(true);
      reset();
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

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl shadow-lg">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">تم استلام طلبك بنجاح! 🎉</h3>
        <p className="text-green-700 mb-6 text-lg">
          سنتواصل معك في أسرع وقت لتقديم عرض أسعار مفصل ومساعدتك في اختيار الرفوف المناسبة
        </p>
        <div className="bg-green-100 p-4 rounded-lg border border-green-300">
          <p className="text-green-800 font-semibold">
            📞 للاستفسارات العاجلة: +966 50 977 0658
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="lead-form" className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-metallic-gold scroll-mt-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-chocolate-brown mb-3">
          احصل على عرض أسعار مجاني الآن
        </h3>
        <p className="text-traditional-brown text-base sm:text-lg">
          أدخل بياناتك وسنتواصل معك في أسرع وقت
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg transition-colors"
              placeholder="أدخل اسمك الكامل"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              رقم الهاتف *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg transition-colors"
              placeholder="+966 5X XXX XXXX"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            البريد الإلكتروني *
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg transition-colors"
            placeholder="example@company.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            الكمية المطلوبة تقريباً *
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <label className="flex items-center p-2 md:p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="1-5"
                className="w-4 h-4 md:w-5 md:h-5 text-amber-600 focus:ring-amber-500 focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-700">1-5 رفوف</span>
            </label>
            
            <label className="flex items-center p-2 md:p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="5-10"
                className="w-4 h-4 md:w-5 md:h-5 text-amber-600 focus:ring-amber-500 focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-700">5-10 رفوف</span>
            </label>
            
            <label className="flex items-center p-2 md:p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
              <input
                type="radio"
                {...register('quantity')}
                value="10+"
                className="w-4 h-4 md:w-5 md:h-5 text-amber-600 focus:ring-amber-500 focus:ring-2"
              />
              <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-700">أكثر من 10 رفوف</span>
            </label>
          </div>
          {errors.quantity && (
            <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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

        <p className="text-xs text-gray-500 text-center mt-4">
          بالنقر على "احصل على عرض أسعار فوري" فإنك توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </form>
    </div>
  );
} 