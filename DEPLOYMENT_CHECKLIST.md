# 🚀 Deployment Checklist - Lead Magnet System

Complete this checklist before deploying your lead magnet to production.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `HUBSPOT_ACCESS_TOKEN` - HubSpot private app token configured
- [ ] `META_ACCESS_TOKEN` - Meta Conversions API token configured
- [ ] `SNAPCHAT_ACCESS_TOKEN` - Snapchat Conversions API token configured
- [ ] `TIKTOK_ACCESS_TOKEN` - TikTok Events API token configured
- [ ] `ZAPIER_WEBHOOK_URL` - Zapier webhook URL confirmed working

### 2. HubSpot Configuration
- [ ] Private app created with correct scopes
- [ ] Custom properties created in HubSpot:
  - [ ] `lead_source` (Single-line text)
  - [ ] `lead_magnet` (Single-line text)
  - [ ] `lead_score` (Number)
  - [ ] `lead_timestamp` (Date picker)
  - [ ] `device_info` (Multi-line text)
  - [ ] `page_url` (Single-line text)
  - [ ] `referrer` (Single-line text)
  - [ ] `event_id` (Single-line text)
  - [ ] `market_region` (Single-line text)
  - [ ] `language_preference` (Single-line text)
  - [ ] `business_type` (Single-line text)
- [ ] Workflow configured for high-quality leads (score ≥ 70)
- [ ] Sales team notifications set up

### 3. Pixel Configuration
- [ ] Meta Pixel verified and firing correctly
- [ ] Snapchat Pixel verified and firing correctly
- [ ] TikTok Pixel verified and firing correctly
- [ ] Google Analytics/GTM configured and tracking
- [ ] Server-side conversion APIs tested

### 4. Google Sheets Integration
- [ ] Zapier webhook tested and working
- [ ] Google Sheets receiving data correctly
- [ ] All form fields mapping to correct columns
- [ ] Data formatting verified (dates, numbers, etc.)

### 5. Form Testing
- [ ] Form validation working correctly
- [ ] Arabic text displaying properly (RTL)
- [ ] Success message showing after submission
- [ ] Error handling working for failed submissions
- [ ] Mobile responsiveness verified
- [ ] Loading states working correctly

### 6. Performance & SEO
- [ ] Build completed successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Page load speed optimized
- [ ] Meta tags configured for Arabic content
- [ ] OpenGraph tags set up

### 7. Domain & SSL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate installed and working
- [ ] Redirects configured (www → non-www or vice versa)
- [ ] DNS records properly configured

## 🧪 Testing Checklist

### Functional Testing
- [ ] Submit form with valid data → Success
- [ ] Submit form with invalid email → Error shown
- [ ] Submit form with missing required fields → Errors shown
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Test Arabic text rendering correctly

### Integration Testing
- [ ] Form submission → Data appears in Google Sheets
- [ ] Form submission → Contact created in HubSpot
- [ ] Form submission → Pixel events fired
- [ ] Lead scoring working correctly
- [ ] HubSpot notes created with additional details

### Performance Testing
- [ ] Page loads in under 3 seconds
- [ ] Form submission completes in under 5 seconds
- [ ] No JavaScript errors in console
- [ ] No broken images or assets

## 🔐 Security Checklist

- [ ] All API tokens stored as environment variables
- [ ] No sensitive data exposed in client-side code
- [ ] HTTPS enforced on all pages
- [ ] Data hashing implemented for pixel tracking
- [ ] Input validation and sanitization implemented
- [ ] Rate limiting considered for API endpoints

## 📊 Analytics Setup

- [ ] Google Analytics goals configured
- [ ] Conversion tracking set up in Google Ads
- [ ] Meta Pixel events configured in Ads Manager
- [ ] Snapchat Pixel events configured
- [ ] TikTok Pixel events configured
- [ ] UTM parameter tracking working

## 🚀 Deployment Steps

### Vercel Deployment
1. [ ] Connect repository to Vercel
2. [ ] Configure environment variables in Vercel dashboard
3. [ ] Set up custom domain (if applicable)
4. [ ] Deploy to production
5. [ ] Test live site thoroughly

### Post-Deployment
- [ ] Monitor error logs for first 24 hours
- [ ] Verify all pixels firing in respective platforms
- [ ] Check HubSpot for incoming leads
- [ ] Monitor Google Sheets for data flow
- [ ] Test form submissions from production site

## 📈 Monitoring & Maintenance

### Daily Checks (First Week)
- [ ] Check error logs
- [ ] Verify form submissions working
- [ ] Monitor conversion tracking
- [ ] Check HubSpot lead quality

### Weekly Checks
- [ ] Review lead scoring accuracy
- [ ] Monitor page performance
- [ ] Check for any broken integrations
- [ ] Review analytics data

### Monthly Checks
- [ ] Update dependencies if needed
- [ ] Review and optimize lead scoring algorithm
- [ ] Analyze conversion rates and optimize
- [ ] Update content if needed

## 🆘 Emergency Contacts

- **Technical Issues**: mohamed@madaratalkon.com
- **HubSpot Support**: [HubSpot Support Portal]
- **Vercel Support**: [Vercel Support]
- **Meta Business Support**: [Meta Business Help Center]

## 📋 Go-Live Approval

**Approved by**: _________________ **Date**: _________

**Technical Lead**: _________________ **Date**: _________

**Marketing Lead**: _________________ **Date**: _________

---

**✅ All items checked? You're ready to launch!** 🚀 