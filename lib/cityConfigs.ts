import { CityConfig, SeoMeta } from './types';

export const cityConfigs: Record<string, CityConfig> = {
  general: {
    name: 'general',
    arabicName: 'عام',
    deliveryInfo: 'توصيل مجاني للرياض وجدة والدمام، كميات كبيرة مع خصومات وضمان لمدة عام كامل',
    benefits: [
      {
        icon: 'Crown',
        title: 'جودة استثنائية',
        description: 'مواد عالية الجودة مقاومة للصدأ والتآكل',
        gradientFrom: 'from-light-gold',
        gradientTo: 'to-cream-gold',
        border: 'border-metallic-gold',
        iconBg: 'bg-classic-gold'
      },
      {
        icon: 'Truck',
        title: 'توصيل مجاني',
        description: 'توصيل مجاني للرياض وجدة والدمام',
        gradientFrom: 'from-cream-gold',
        gradientTo: 'to-light-brown',
        border: 'border-old-gold',
        iconBg: 'bg-metallic-gold'
      },
      {
        icon: 'Package',
        title: 'كميات كبيرة',
        description: 'مخزون كبير مع خصومات للكميات',
        gradientFrom: 'from-light-brown',
        gradientTo: 'to-cream-gold',
        border: 'border-vegas-gold',
        iconBg: 'bg-vegas-gold'
      }
    ],
    specialFeatures: []
  },
  
  riyadh: {
    name: 'riyadh',
    arabicName: 'الرياض',
    deliveryInfo: 'توصيل مجاني إلى جميع أنحاء المملكة، شحن خلال 24 ساعة مع تركيب مجاني في الرياض، كميات كبيرة مع خصومات، وضمان لمدة عام كامل',
    benefits: [
      {
        icon: 'Crown',
        title: 'جودة استثنائية',
        description: 'مواد عالية الجودة مقاومة للصدأ والتآكل',
        gradientFrom: 'from-light-gold',
        gradientTo: 'to-cream-gold',
        border: 'border-metallic-gold',
        iconBg: 'bg-classic-gold'
      },
      {
        icon: 'Clock',
        title: 'شحن سريع',
        description: 'شحن خلال 24 ساعة في الرياض',
        gradientFrom: 'from-cream-gold',
        gradientTo: 'to-light-brown',
        border: 'border-old-gold',
        iconBg: 'bg-metallic-gold'
      },
      {
        icon: 'Wrench',
        title: 'تركيب مجاني',
        description: 'تركيب مجاني لعملاء الرياض',
        gradientFrom: 'from-light-brown',
        gradientTo: 'to-cream-gold',
        border: 'border-vegas-gold',
        iconBg: 'bg-vegas-gold'
      }
    ],
    specialFeatures: [
      { icon: 'Clock', text: 'شحن خلال 24 ساعة فقط' },
      { icon: 'Wrench', text: 'تركيب مجاني بواسطة فريق متخصص' },
      { icon: 'Shield', text: 'خدمة ما بعد البيع السريعة' }
    ]
  },

  jeddah: {
    name: 'jeddah',
    arabicName: 'جدة',
    deliveryInfo: 'توصيل مجاني إلى جميع أنحاء المملكة، شحن خلال 48 ساعة مع تركيب مجاني في جدة، كميات كبيرة مع خصومات، وضمان لمدة عام كامل',
    benefits: [
      {
        icon: 'Crown',
        title: 'جودة استثنائية',
        description: 'مواد عالية الجودة مقاومة للصدأ والتآكل',
        gradientFrom: 'from-light-gold',
        gradientTo: 'to-cream-gold',
        border: 'border-metallic-gold',
        iconBg: 'bg-classic-gold'
      },
      {
        icon: 'Truck',
        title: 'توصيل سريع',
        description: 'شحن خلال 48 ساعة في جدة',
        gradientFrom: 'from-cream-gold',
        gradientTo: 'to-light-brown',
        border: 'border-old-gold',
        iconBg: 'bg-metallic-gold'
      },
      {
        icon: 'Wrench',
        title: 'تركيب احترافي',
        description: 'تركيب مجاني لعملاء جدة',
        gradientFrom: 'from-light-brown',
        gradientTo: 'to-cream-gold',
        border: 'border-vegas-gold',
        iconBg: 'bg-vegas-gold'
      }
    ],
    specialFeatures: [
      { icon: 'Truck', text: 'شحن خلال 48 ساعة' },
      { icon: 'Wrench', text: 'تركيب مجاني بواسطة فريق متخصص' },
      { icon: 'Shield', text: 'خدمة عملاء متميزة' }
    ]
  },

  dammam: {
    name: 'dammam',
    arabicName: 'الدمام',
    deliveryInfo: 'توصيل مجاني إلى جميع أنحاء المملكة، شحن خلال 48 ساعة مع تركيب مجاني في الدمام، كميات كبيرة مع خصومات، وضمان لمدة عام كامل',
    benefits: [
      {
        icon: 'Crown',
        title: 'جودة استثنائية',
        description: 'مواد عالية الجودة مقاومة للصدأ والتآكل',
        gradientFrom: 'from-light-gold',
        gradientTo: 'to-cream-gold',
        border: 'border-metallic-gold',
        iconBg: 'bg-classic-gold'
      },
      {
        icon: 'Truck',
        title: 'توصيل موثوق',
        description: 'شحن خلال 48 ساعة في الدمام',
        gradientFrom: 'from-cream-gold',
        gradientTo: 'to-light-brown',
        border: 'border-old-gold',
        iconBg: 'bg-metallic-gold'
      },
      {
        icon: 'Package',
        title: 'خدمة شاملة',
        description: 'تركيب وضمان شامل',
        gradientFrom: 'from-light-brown',
        gradientTo: 'to-cream-gold',
        border: 'border-vegas-gold',
        iconBg: 'bg-vegas-gold'
      }
    ],
    specialFeatures: [
      { icon: 'Truck', text: 'شحن خلال 48 ساعة' },
      { icon: 'Wrench', text: 'تركيب مجاني بواسطة فريق متخصص' },
      { icon: 'Package', text: 'خدمات إضافية للمؤسسات الكبيرة' }
    ]
  }
};

export const seoConfigs: Record<string, SeoMeta> = {
  general: {
    title: 'دليل حلول التخزين المتقدمة - شركة خبراء الرفوف المحدودة',
    description: 'احصل على دليلك المجاني لأحدث حلول التخزين والرفوف الذكية في المملكة العربية السعودية',
    keywords: 'حلول التخزين، الرفوف الذكية، المستودعات، السعودية، التخزين الصناعي'
  },
  riyadh: {
    title: 'رفوف التخزين في الرياض - شحن خلال 24 ساعة | شركة خبراء الرفوف',
    description: 'رفوف تخزين عالية الجودة في الرياض مع شحن خلال 24 ساعة وتركيب مجاني. احصل على عرض أسعار فوري',
    keywords: 'رفوف تخزين الرياض، رفوف معدنية الرياض، حلول التخزين الرياض، شحن سريع الرياض'
  },
  jeddah: {
    title: 'رفوف التخزين في جدة - شحن خلال 48 ساعة | شركة خبراء الرفوف',
    description: 'رفوف تخزين عالية الجودة في جدة مع شحن خلال 48 ساعة وتركيب مجاني. احصل على عرض أسعار فوري',
    keywords: 'رفوف تخزين جدة، رفوف معدنية جدة، حلول التخزين جدة، توصيل سريع جدة'
  },
  dammam: {
    title: 'رفوف التخزين في الدمام - شحن خلال 48 ساعة | شركة خبراء الرفوف',
    description: 'رفوف تخزين عالية الجودة في الدمام مع شحن خلال 48 ساعة وتركيب مجاني. احصل على عرض أسعار فوري',
    keywords: 'رفوف تخزين الدمام، رفوف معدنية الدمام، حلول التخزين الدمام، توصيل موثوق الدمام'
  }
}; 