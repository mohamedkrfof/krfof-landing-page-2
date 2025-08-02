'use client';

import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
import { useState } from 'react';
import { Crown, CircleCheckBig } from 'lucide-react';

interface InteractivePricingSectionProps {
  className?: string;
  onQuantityChange?: (quantity: number) => void;
}

export default function InteractivePricingSection({ className = '', onQuantityChange }: InteractivePricingSectionProps) {
  const [quantity, setQuantity] = useState(5);
  
  const originalPrice = 690;
  const discountedPrice = 325;
  const savingsPerShelf = originalPrice - discountedPrice;
  
  const totalOriginalPrice = originalPrice * quantity;
  const totalDiscountedPrice = discountedPrice * quantity;
  const totalSavings = savingsPerShelf * quantity;
  const savingsPercentage = Math.round((savingsPerShelf / originalPrice) * 100);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
    <div className={`bg-gradient-to-br from-cream-gold via-light-gold to-metallic-gold p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-vegas-gold ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-gradient-to-r from-chocolate-brown to-traditional-brown text-white px-4 py-2 rounded-full text-small font-bold mb-4 shadow-lg">
          <Crown className="w-4 h-4 ml-2" />
          عرض خاص للكميات الكبيرة
        </div>
        <h3 className="text-heading-2 font-bold text-chocolate-brown mb-2">
          احسب توفيرك مع الكميات الكبيرة
        </h3>
        <p className="text-traditional-brown text-body font-medium">
          اختر الكمية المطلوبة واشاهد التوفير الفوري
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-classic-gold">
        {/* Quantity Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-body font-semibold text-chocolate-brown">
              عدد الرفوف المطلوبة:
            </label>
            <div className="flex items-center gap-2 font-mono text-heading-2 font-bold text-chocolate-brown">
              <SlidingNumber value={quantity} />
              <span>رف</span>
            </div>
          </div>
          
          <input
            type="range"
            value={quantity}
            min={5}
            max={50}
            step={1}
            onChange={(e) => handleQuantityChange(+e.target.value)}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb 100%)`
            }}
          />
          
          <div className="flex justify-between text-small text-gray-600 mt-2">
            <span>5 رفوف (الحد الأدنى)</span>
            <span>50 رف (الحد الأقصى)</span>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Original Price */}
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-body font-semibold text-traditional-brown mb-2">السعر العادي</h4>
            <div className="relative">
              <div className="text-heading-1 font-bold text-gray-400 line-through">
                <SlidingNumber value={totalOriginalPrice} /> ريال
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
              </div>
            </div>
            <p className="text-small text-gray-500 mt-1">المجموع الكلي</p>
          </div>

          {/* Discounted Price */}
          <div className="text-center p-4 bg-gradient-to-br from-metallic-gold to-vegas-gold rounded-lg border-2 border-old-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-chocolate-brown text-white px-3 py-1 text-tiny font-bold rounded-bl-lg">
              وفر {savingsPercentage}%
            </div>
            <h4 className="text-body font-semibold text-chocolate-brown mb-2">سعر العرض</h4>
            <div className="text-heading-1 font-bold text-chocolate-brown">
              <SlidingNumber value={totalDiscountedPrice} /> ريال
            </div>
            <p className="text-small text-chocolate-brown mt-1 font-medium">المجموع بعد الخصم</p>
            <div className="mt-3 p-2 bg-white/80 rounded-lg">
              <p className="text-small font-bold text-traditional-brown">
                توفر <SlidingNumber value={totalSavings} /> ريال!
              </p>
            </div>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="p-4 bg-gradient-to-r from-light-brown to-cream-gold rounded-lg border border-classic-gold mb-6">
          <h5 className="text-body font-bold text-chocolate-brown mb-3 text-center">تفاصيل التوفير:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">سعر الرف الواحد</p>
              <p className="text-body font-bold text-chocolate-brown">{discountedPrice} ريال</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">التوفير لكل رف</p>
              <p className="text-body font-bold text-chocolate-brown">{savingsPerShelf} ريال</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-small font-semibold text-traditional-brown mb-1">إجمالي التوفير</p>
              <p className="text-body font-bold text-chocolate-brown">
                <SlidingNumber value={totalSavings} /> ريال
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CircleCheckBig className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              العرض ساري على جميع أنواع الرفوف
            </p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CircleCheckBig className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              يمكن دمج أحجام مختلفة للوصول للحد الأدنى
            </p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 bg-metallic-gold rounded-full flex items-center justify-center flex-shrink-0">
              <CircleCheckBig className="w-3 h-3 text-chocolate-brown" />
            </div>
            <p className="text-small text-traditional-brown font-medium">
              توصيل مجاني للكميات الكبيرة
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #D4AF37;
          cursor: pointer;
          border: 2px solid #8B4513;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #D4AF37;
          cursor: pointer;
          border: 2px solid #8B4513;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}