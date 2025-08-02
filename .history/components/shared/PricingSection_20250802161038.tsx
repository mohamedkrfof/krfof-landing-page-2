'use client';

import { Crown, CheckCircle } from 'lucide-react';

interface PricingSectionProps {
  className?: string;
}

export default function PricingSection({ className = '' }: PricingSectionProps) {
  const originalPrice = 690;
  const bulkPrice = 325;
  const minQuantity = 5;
  const savings = originalPrice - bulkPrice;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);

  return (
    <div className={`bg-gradient-to-br from-cream-gold via-light-gold to-metallic-gold p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-vegas-gold ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-gradient-to-r from-chocolate-brown to-traditional-brown text-white px-4 py-2 rounded-full text-small font-bold mb-4 shadow-lg">
          <Crown className="w-4 h-4 ml-2" />
          عرض خاص للكميات الكبيرة
        </div>
        
        <h3 className="text-heading-2 font-bold text-chocolate-brown mb-2">
          وفر أكثر مع الكميات الكبيرة
        </h3>
        
        <p className="text-traditional-brown text-body font-medium">
          عند شراء {minQuantity} رفوف أو أكثر
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-classic-gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Price */}
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-body font-semibold text-traditional-brown mb-2">
              السعر العادي
            </h4>
            <div className="relative">
              <span className="text-heading-1 font-bold text-gray-400 line-through">
                {originalPrice} ريال
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
              </div>
            </div>
            <p className="text-small text-gray-500 mt-1">للرف الواحد</p>
          </div>

          {/* Bulk Price */}
          <div className="text-center p-4 bg-gradient-to-br from-metallic-gold to-vegas-gold rounded-lg border-2 border-old-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-chocolate-brown text-white px-3 py-1 text-tiny font-bold rounded-bl-lg">
              وفر {savingsPercentage}%
            </div>
            
            <h4 className="text-body font-semibold text-chocolate-brown mb-2">
              سعر الكمية ({minQuantity}+ رفوف)
            </h4>
            
            <div className="text-heading-1 font-bold text-chocolate-brown">
              {bulkPrice} ريال
            </div>
            
            <p className="text-small text-chocolate-brown mt-1 font-medium">للرف الواحد</p>
            
            <div className="mt-3 p-2 bg-white/80 rounded-lg">
              <p className="text-small font-bold text-traditional-brown">
                توفر {savings} ريال لكل رف!
              </p>
            </div>
          </div>
        </div>

        {/* Savings Calculation Example */}
        <div className="mt-6 p-4 bg-gradient-to-r from-light-brown to-cream-gold rounded-lg border border-classic-gold">
          <h5 className="text-body font-bold text-chocolate-brown mb-3 text-center">
            مثال على التوفير:
          </h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">
                عند شراء 5 رفوف
              </p>
              <p className="text-body font-bold text-chocolate-brown">
                توفر {savings * 5} ريال
              </p>
            </div>
            
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">
                عند شراء 10 رفوف
              </p>
              <p className="text-body font-bold text-chocolate-brown">
                توفر {savings * 10} ريال
              </p>
            </div>
            
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">
                عند شراء 20 رف
              </p>
              <p className="text-body font-bold text-chocolate-brown">
                توفر {savings * 20} ريال
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              العرض ساري على جميع أنواع الرفوف
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              يمكن دمج أحجام مختلفة للوصول للحد الأدنى
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              توصيل مجاني للكميات الكبيرة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}