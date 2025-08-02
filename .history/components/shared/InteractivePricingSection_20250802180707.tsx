'use client';

import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
import { useState } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';

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
    <div className={`bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-md">
          <Tag className="w-4 h-4 ml-2" />
          عرض خاص - وفر {savingsPercentage}%
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          حاسبة التوفير
        </h3>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-base font-semibold text-gray-700">
            عدد الرفوف:
          </label>
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <SlidingNumber value={quantity} />
            <span className="text-lg">رف</span>
          </div>
        </div>
        
        <input
          type="range"
          value={quantity}
          min={5}
          max={50}
          step={1}
          onChange={(e) => handleQuantityChange(+e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>5 رفوف (الحد الأدنى)</span>
          <span>50 رف (الحد الأقصى)</span>
        </div>
      </div>

      {/* Main Price Display */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-800">المبلغ المطلوب دفعه</h4>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            <SlidingNumber value={totalDiscountedPrice} /> ريال
          </div>
          <div className="text-sm text-gray-600">
            بدلاً من <span className="line-through text-red-500 font-semibold">{totalOriginalPrice.toLocaleString()} ريال</span>
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="text-center">
          <p className="text-green-800 font-semibold">
            🎉 توفر <SlidingNumber value={totalSavings} /> ريال!
          </p>
          <p className="text-sm text-green-600 mt-1">
            سعر الرف الواحد: {discountedPrice} ريال بدلاً من {originalPrice} ريال
          </p>
        </div>
      </div>

      {/* Simple Benefits */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full ml-3"></span>
          توصيل مجاني للكميات الكبيرة
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full ml-3"></span>
          يمكن دمج أحجام مختلفة
        </div>
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