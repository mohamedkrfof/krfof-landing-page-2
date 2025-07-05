import { Phone } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
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
              priority
            />
          </div>
          <div className="flex items-center" dir="ltr">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-traditional-brown ml-2" />
            <span className="text-sm sm:text-base font-medium text-traditional-brown">+966 50 977 0658</span>
          </div>
        </div>
      </div>
    </header>
  );
} 