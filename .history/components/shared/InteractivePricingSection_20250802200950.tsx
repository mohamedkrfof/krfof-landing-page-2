'use client';

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
        <div className="inline-flex items-center bg-gradient-to-r from-chocolate-brown to-traditional-brown text-light-gold px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-md">
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
            {quantity}
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
          dir="rtl"
          style={{
            background: `linear-gradient(to left, #3B82F6 0%, #3B82F6 ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb ${((quantity - 5) / (50 - 5)) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>50 رف (الحد الأقصى)</span>
          <span>5 رفوف (الحد الأدنى)</span>
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
            {totalDiscountedPrice.toLocaleString()} ريال
          </div>
          <div className="text-sm text-gray-600">
            بدلاً من <span className="line-through text-red-500 font-semibold">{totalOriginalPrice.toLocaleString()} ريال</span>
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <div className="bg-cream-gold border border-metallic-gold rounded-lg p-4 mb-4">
        <div className="text-center">
          <p className="text-chocolate-brown font-semibold">
            🎉 توفر {totalSavings.toLocaleString()} ريال!
          </p>
          <p className="text-sm text-traditional-brown mt-1">
            سعر الرف الواحد: {discountedPrice} ريال بدلاً من {originalPrice} ريال
          </p>
        </div>
      </div>

      {/* Simple Benefits */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-classic-gold rounded-full ml-3"></span>
          توصيل مجاني للكميات الكبيرة
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-classic-gold rounded-full ml-3"></span>
          يمكن دمج أحجام مختلفة
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1E40AF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1E40AF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}