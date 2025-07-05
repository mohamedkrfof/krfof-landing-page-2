import { AlertTriangle } from 'lucide-react';

export default function NoticeBanner() {
  return (
    <div className="bg-gradient-to-r from-cream-gold to-light-brown border-b border-metallic-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center text-center">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warm-brown ml-2" />
          <p className="text-chocolate-brown font-semibold text-sm sm:text-lg">
            تنبيه مهم: نحن متخصصون في الرفوف الجديدة فقط - لا نتعامل مع الرفوف المستعملة نهائياً
          </p>
        </div>
      </div>
    </div>
  );
} 