# 🚀 Lead Magnet System - شركة خبراء الرفوف المحدودة

A complete lead magnet system built with Next.js 15, featuring Arabic RTL support, comprehensive pixel tracking, and seamless CRM integration.

## ✨ Features

- **🎯 Lead Capture Form** - Arabic form with validation
- **📊 Triple Integration** - Zapier → Google Sheets, HubSpot CRM, Pixel Tracking
- **🔍 Comprehensive Tracking** - Meta, Snapchat, TikTok, Google Analytics
- **🌐 RTL Support** - Full Arabic language support
- **📱 Mobile Responsive** - Optimized for all devices
- **⚡ Fast Performance** - Built with Next.js 15 and TypeScript

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Setup
⚠️ **IMPORTANT**: Before running the project, you must configure environment variables.

1. **Read the setup guide**: Check `PRODUCTION_ENVIRONMENT_SETUP.md` for detailed instructions
2. **Create `.env.local` file** with the following required variables:

```bash
# Critical environment variables (get from respective platforms)
HUBSPOT_ACCESS_TOKEN=your_hubspot_private_app_token_here
META_ACCESS_TOKEN=your_meta_conversions_api_token_here
SNAPCHAT_ACCESS_TOKEN=your_snapchat_access_token_here
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token_here
GA4_MEASUREMENT_ID=AW-632-400-8142
GA4_API_SECRET=your_ga4_api_secret_here

# Already configured
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/23446220/uoz8ssr/
```

### 3. Test Setup
```bash
# Run integration tests
node test-hubspot-now.js
node test-hybrid-integration.js
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your lead magnet!

## 🚀 Production Deployment

### Automated Deployment (Recommended)
```bash
./deploy-production.sh
```

### Manual Deployment
1. Configure all environment variables (see `PRODUCTION_ENVIRONMENT_SETUP.md`)
2. Run `npm run build` to ensure no errors
3. Test integrations with development server
4. Deploy to your platform (Vercel, Netlify, etc.)
5. Set environment variables in deployment platform
6. Test live deployment

### Production Readiness Checklist
- [ ] Environment variables configured
- [ ] HubSpot Private App created and tested
- [ ] Meta Conversions API token working
- [ ] All pixel integrations tested
- [ ] Form submissions working end-to-end
- [ ] Error handling implemented
- [ ] Performance optimized

## 🔧 Configuration

### HubSpot Setup
1. Go to HubSpot Settings → Integrations → Private Apps
2. Create new private app: "Lead Magnet Integration"
3. Add scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.notes.read`, `crm.objects.notes.write`
4. Copy the token to `HUBSPOT_ACCESS_TOKEN`

### Meta Pixel Setup
1. Go to Meta Business Manager → Events Manager
2. Select your pixel (1828066298063484)
3. Go to Settings → Conversions API
4. Generate access token and add to `META_ACCESS_TOKEN`

### Snapchat Pixel Setup
1. Go to Snapchat Ads Manager → Assets → Pixels
2. Select your pixel (0d75ef7a-3830-4fce-b470-fee261e4b06e)
3. Go to Conversions API → Generate Token
4. Add token to `SNAPCHAT_ACCESS_TOKEN`

### TikTok Events API Setup
1. Go to TikTok Ads Manager → Assets → Events
2. Select your pixel (CKHS5RRC77UFTHK7BKJ0)
3. Go to Events API → Generate Access Token
4. Add token to `TIKTOK_ACCESS_TOKEN`

## 📊 Data Flow

```
Lead Form Submission
    ↓
1. Zapier → Google Sheets (Primary)
    ↓
2. HubSpot CRM → Contact Creation + Lead Scoring
    ↓
3. Pixel Tracking → Meta + Snapchat + TikTok
    ↓
4. Success Response + Thank You Page
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**
```bash
npm i -g vercel
vercel
```

2. **Set Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all the environment variables from `.env.local`

3. **Deploy**
```bash
vercel --prod
```

### Deploy to Other Platforms

The app is compatible with any platform that supports Next.js:
- **Netlify**: Use `@netlify/plugin-nextjs`
- **AWS Amplify**: Direct Next.js support
- **DigitalOcean App Platform**: Node.js app
- **Railway**: Direct deployment

## 📈 Analytics & Tracking

### Configured Pixels:
- **Meta Pixel**: 1828066298063484
- **Snapchat Pixel**: 0d75ef7a-3830-4fce-b470-fee261e4b06e  
- **TikTok Pixel**: CKHS5RRC77UFTHK7BKJ0
- **Google Analytics**: AW-632-400-8142
- **GTM Container**: GTM-PNLX8748

### Data Collected:
- Contact Information (Name, Email, Phone, Company)
- Device Information (Browser, OS, Screen Resolution)
- Engagement Metrics (Time on page, Referrer)
- Geographic Data (Timezone, Language)
- Marketing Attribution (UTM parameters, Click IDs)

## 🔒 Privacy & Compliance

- **Data Hashing**: All PII is hashed before sending to pixels
- **GDPR Compliant**: No personal data stored without consent
- **Secure**: All API communications use HTTPS
- **Transparent**: Clear privacy notice on form

## 🛠️ Development

### File Structure
```
krfof-leadmagnet/
├── app/
│   ├── api/
│   │   ├── hubspot/contact/route.ts    # HubSpot CRM integration
│   │   └── pixels/track/route.ts       # Pixel tracking API
│   ├── layout.tsx                      # Root layout with pixels
│   ├── page.tsx                        # Main landing page
│   └── globals.css                     # Global styles
├── components/
│   └── QuickLeadForm.tsx              # Lead capture form
├── lib/
│   └── utils.ts                       # Utility functions
└── README.md
```

### Key Components:
- **QuickLeadForm**: Main form component with validation
- **Pixel Tracking API**: Server-side conversion tracking
- **HubSpot Integration**: CRM contact creation and scoring
- **Arabic Layout**: RTL support with proper typography

## 📞 Support

For technical support or questions:
- **Email**: mohamed@madaratalkon.com
- **Company**: شركة خبراء الرفوف المحدودة

## 📝 License

This project is proprietary software developed for شركة خبراء الرفوف المحدودة.

---

**Built with ❤️ for the Saudi Arabian market**

# GitHub email verification test - Sun Jul  6 20:32:34 EEST 2025
# Fresh commit test - Mon Jul  7 05:24:16 EEST 2025
