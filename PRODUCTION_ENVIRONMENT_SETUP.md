# 🚀 Production Environment Setup Guide

## 🔧 Environment Variables Required

To deploy this project to production, you need to configure the following environment variables. Create a `.env.local` file in your project root with these values:

```bash
# =============================================================================
# HUBSPOT INTEGRATION
# =============================================================================
# Get these from HubSpot Settings → Integrations → Private Apps
HUBSPOT_ACCESS_TOKEN=your_hubspot_private_app_token_here
# Optional: Your HubSpot Portal ID (found in Settings → Account Information)
HUBSPOT_PORTAL_ID=your_hubspot_portal_id_here

# =============================================================================
# META (FACEBOOK) PIXEL & CONVERSIONS API
# =============================================================================
# Get these from Meta Business Manager → Events Manager → Conversions API
META_ACCESS_TOKEN=your_meta_conversions_api_token_here
META_DATASET_ID=1828066298063484
META_PIXEL_ID=1828066298063484
# Optional: For testing events (remove in production)
# META_TEST_EVENT_CODE=TEST12345

# =============================================================================
# SNAPCHAT PIXEL & CONVERSIONS API
# =============================================================================
# Get these from Snapchat Ads Manager → Assets → Pixels → Conversions API
SNAPCHAT_ACCESS_TOKEN=your_snapchat_access_token_here
SNAPCHAT_PIXEL_ID=0d75ef7a-3830-4fce-b470-fee261e4b06e

# =============================================================================
# TIKTOK EVENTS API
# =============================================================================
# Get these from TikTok Ads Manager → Assets → Events → Events API
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token_here
TIKTOK_PIXEL_ID=CKHS5RRC77UFTHK7BKJ0

# =============================================================================
# GOOGLE ANALYTICS 4
# =============================================================================
# Get these from Google Analytics → Admin → Data Streams → Measurement Protocol
GA4_MEASUREMENT_ID=AW-632-400-8142
GA4_API_SECRET=your_ga4_api_secret_here

# =============================================================================
# ZAPIER WEBHOOK (ALREADY CONFIGURED)
# =============================================================================
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/23446220/uoz8ssr/

# =============================================================================
# OPTIONAL: ADDITIONAL TRACKING
# =============================================================================
# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID=GTM-TFWF4C3V

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_BRAND_NAME=شركة خبراء الرفوف المحدودة
```

## 🔗 How to Get Each Token

### 1. HubSpot Private App Token
1. Go to your HubSpot account → Settings → Integrations → Private Apps
2. Click "Create a private app"
3. Set name: "Lead Magnet Integration"
4. Go to "Scopes" tab and enable:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.notes.write`
5. Click "Create app" and copy the token

### 2. Meta Conversions API Token
1. Go to Meta Business Manager → Events Manager
2. Select your pixel (1828066298063484)
3. Go to Settings → Conversions API
4. Click "Generate Access Token"
5. Copy the token

### 3. Snapchat Conversions API Token
1. Go to Snapchat Ads Manager → Assets → Pixels
2. Select your pixel (0d75ef7a-3830-4fce-b470-fee261e4b06e)
3. Go to "Conversions API" tab
4. Click "Generate Token"
5. Copy the token

### 4. TikTok Events API Token
1. Go to TikTok Ads Manager → Assets → Events
2. Select your pixel (CKHS5RRC77UFTHK7BKJ0)
3. Go to "Events API" tab
4. Click "Generate Access Token"
5. Copy the token

### 5. Google Analytics 4 API Secret
1. Go to Google Analytics → Admin → Data Streams
2. Select your web data stream
3. Go to "Measurement Protocol API secrets"
4. Create a new secret
5. Copy the secret value

## 🚨 Critical Security Notes

1. **Never commit .env.local to version control**
2. **Add .env.local to your .gitignore file**
3. **Set these variables in your deployment platform**
4. **Regularly rotate access tokens for security**
5. **Monitor API usage and error logs**

## 📋 Deployment Platform Setup

### Vercel
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable from the list above
4. Redeploy your project

### Netlify
1. Go to your Netlify site dashboard
2. Click "Site settings" → "Environment variables"
3. Add each variable from the list above
4. Redeploy your project

## 🧪 Testing Setup

After setting up environment variables, test your integrations:

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test HubSpot integration**:
   ```bash
   node test-hubspot-now.js
   ```

3. **Test pixel tracking**:
   ```bash
   node test-hybrid-integration.js
   ```

4. **Test form submission**:
   - Go to http://localhost:3000/landing/riyadh
   - Fill out the form with test data
   - Check browser console for tracking events
   - Verify data appears in HubSpot, Google Sheets, and Meta Events Manager

## ⚡ Production Deployment Checklist

- [ ] Environment variables configured
- [ ] HubSpot Private App created and tested
- [ ] Meta Conversions API token working
- [ ] Snapchat/TikTok API tokens configured
- [ ] Google Analytics 4 API secret set
- [ ] Form submissions tested end-to-end
- [ ] All pixel events firing correctly
- [ ] Error handling working properly
- [ ] Performance optimized (build passes)
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate active
- [ ] Monitoring set up for API failures

## 🔍 Troubleshooting Common Issues

### HubSpot API Errors
- **401 Unauthorized**: Check your `HUBSPOT_ACCESS_TOKEN`
- **403 Forbidden**: Verify your private app has correct scopes
- **Rate limit**: HubSpot has API rate limits, implement retry logic

### Meta Pixel Errors
- **Invalid access token**: Check your `META_ACCESS_TOKEN`
- **Parameter errors**: Verify data is properly hashed for PII fields
- **Dataset ID mismatch**: Ensure `META_DATASET_ID` matches your pixel ID

### General API Errors
- **Network errors**: Check internet connectivity and API endpoints
- **Timeout errors**: Implement proper timeout handling
- **Invalid JSON**: Verify request payload format

## 🎯 Expected Results After Setup

Once properly configured, you should see:
- **Form submissions** → Data in Google Sheets via Zapier
- **HubSpot contacts** → New contacts with lead scoring
- **Meta Events Manager** → Lead events with comprehensive parameters
- **Snapchat/TikTok** → Conversion events tracking
- **Google Analytics** → Goal completions and events

## 📞 Support

If you encounter issues:
1. Check error logs in your deployment platform
2. Test individual integrations using the provided test scripts
3. Verify all environment variables are correctly set
4. Ensure API tokens have not expired 