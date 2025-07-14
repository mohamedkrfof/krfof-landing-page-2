import { Crown, Truck, Package, Clock, Wrench } from 'lucide-react';
import { Benefit } from '@/lib/types';

interface BenefitsGridProps {
  benefits: Benefit[];
}

const iconMap = {
  Crown,
  Truck,
  Package,
  Clock,
  Wrench,
};

export default function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto">
      {benefits.map((benefit, index) => {
        const IconComponent = iconMap[benefit.icon as keyof typeof iconMap];
        
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} p-4 sm:p-6 rounded-2xl shadow-lg border ${benefit.border}`}
          >
            <div className={`w-12 h-12 ${benefit.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <IconComponent className="w-6 h-6 text-chocolate-brown" />
            </div>
            <h3 className="text-heading-3 font-bold text-chocolate-brown mb-2">{benefit.title}</h3>
            <p className="text-body text-traditional-brown">{benefit.description}</p>
          </div>
        );
      })}
    </div>
  );
} 