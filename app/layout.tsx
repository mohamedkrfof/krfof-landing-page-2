import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

// Configure Inter for Latin text with optimized loading
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

// Configure IBM Plex Arabic for Arabic text with RTL support
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

export const metadata: Metadata = {
  title: 'دليل حلول التخزين المتقدمة - شركة خبراء الرفوف المحدودة',
  description: 'احصل على دليلك المجاني لأحدث حلول التخزين والرفوف الذكية في المملكة العربية السعودية',
  keywords: 'حلول التخزين، الرفوف الذكية، المستودعات، السعودية، التخزين الصناعي',
  authors: [{ name: 'شركة خبراء الرفوف المحدودة' }],
  openGraph: {
    title: 'دليل حلول التخزين المتقدمة',
    description: 'احصل على دليلك المجاني لأحدث حلول التخزين والرفوف الذكية',
    type: 'website',
    locale: 'ar_SA',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Font Preloading for Performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        
        {/* Google Tag Manager - NEW CLEAN CONTAINER */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TFWF4C3V');
            `
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-632-400-8142"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-632-400-8142');
            `
          }}
        />

        {/* Meta Pixel - PRODUCTION */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1828066298063484');
              fbq('track', 'PageView');
            `
          }}
        />

        {/* Snapchat Pixel */}
        <Script
          id="snapchat-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '0d75ef7a-3830-4fce-b470-fee261e4b06e', {
                'user_email': ''
              });
              snaptr('track', 'PAGE_VIEW');
            `
          }}
        />

        {/* TikTok Pixel */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('CKHS5RRC77UFTHK7BKJ0');
                ttq.page();
              }(window, document, 'ttq');
            `
          }}
        />
      </head>
      <body className={`${inter.variable} ${ibmPlexArabic.variable} font-arabic`}>
        {/* Google Tag Manager (noscript) - NEW CLEAN CONTAINER */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFWF4C3V"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  )
} 