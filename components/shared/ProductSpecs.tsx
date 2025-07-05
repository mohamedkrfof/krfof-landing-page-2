import { Ruler, Weight, CheckCircle, Shield } from 'lucide-react';
import { ProductSpec } from '@/lib/types';

const iconMap = {
  Ruler,
  Weight,
  CheckCircle,
  Shield,
};

const defaultSpecs: ProductSpec[] = [
  { icon: 'Ruler', text: 'الحجم: 200×200×60 سم' },
  { icon: 'Weight', text: 'تحمل: 200 كيلو لكل رف' },
  { icon: 'CheckCircle', text: '4 أرفف قابلة للتعديل' },
  { icon: 'Shield', text: 'مقاوم للصدأ والتآكل' },
];

interface ProductSpecsProps {
  specs?: ProductSpec[];
  title?: string;
}

export default function ProductSpecs({ 
  specs = defaultSpecs, 
  title = "المواصفات التقنية:" 
}: ProductSpecsProps) {
  return (
    <div className="bg-gradient-to-r from-light-gold to-cream-gold border-r-4 border-classic-gold p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
      <h3 className="text-lg sm:text-xl font-bold text-chocolate-brown mb-3 sm:mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {specs.map((spec, index) => {
          const IconComponent = iconMap[spec.icon as keyof typeof iconMap];
          
          return (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-gold" />
              <span className="text-traditional-brown font-medium text-sm sm:text-base">{spec.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 