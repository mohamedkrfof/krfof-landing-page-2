# Direct HubSpot Integration Guide

## Overview
This guide provides multiple options for direct HubSpot integration, addressing the authentication issues encountered with developer accounts.

## The Problem
- **Developer accounts** have limited API access
- **No Private Apps support** on developer accounts
- **Limited to webhooks and timeline events only**
- **Cannot create or modify CRM records**

## Solution Options

### Option 1: Upgrade to HubSpot Free CRM + Private App ⭐ (Recommended)

**Why this is the best option:**
- ✅ Free CRM account (no cost)
- ✅ Full API access including contact creation
- ✅ Proper authentication with scoped permissions
- ✅ Easy token management and rotation
- ✅ Advanced features like custom properties

**Steps to implement:**

1. **Upgrade your HubSpot account:**
   - Go to your HubSpot developer account
   - Upgrade to HubSpot Free CRM (free of charge)
   - Or create a new HubSpot account at hubspot.com

2. **Create a Private App:**
   - In HubSpot, go to Settings → Integrations → Private Apps
   - Click "Create a private app"
   - Set the app name: "Website Lead Integration"
   - Go to the "Scopes" tab
   - Enable these scopes:
     - `crm.objects.contacts.write`
     - `crm.objects.contacts.read`
     - `crm.objects.notes.write` (optional, for notes)
   - Click "Create app"
   - Copy the generated access token

3. **Update environment variables:**
   ```bash
   # In your .env.local file
   HUBSPOT_PRIVATE_APP_TOKEN=your-private-app-token-here
   ```

4. **Test the integration:**
   - Your updated code will automatically use the Private App token
   - Submit a test form to verify it works

### Option 2: HubSpot Forms API

**Why this works:**
- ✅ Works with developer accounts
- ✅ No authentication issues
- ✅ Leverages HubSpot's native form system
- ❌ Requires creating a form in HubSpot UI
- ❌ Less customization options

**Steps to implement:**

1. **Create a form in HubSpot:**
   - Go to Marketing → Forms
   - Create a new form with these fields:
     - Email (required)
     - First Name
     - Last Name
     - Phone
     - Company
     - Message
     - Job Title
   - Publish the form
   - Copy the Form ID from the URL or form settings

2. **Get your Portal ID:**
   - Go to Settings → Account Setup → Account Information
   - Copy your HubSpot ID (Portal ID)

3. **Update environment variables:**
   ```bash
   # In your .env.local file
   HUBSPOT_PORTAL_ID=your-portal-id-here
   HUBSPOT_FORM_ID=your-form-id-here
   ```

4. **Test the integration:**
   - Your updated code will automatically use the Forms API
   - Submit a test form to verify it works

### Option 3: Keep Using Zapier (Simplest)

**Why this works:**
- ✅ Already working
- ✅ No code changes needed
- ✅ Works with any HubSpot account type
- ❌ External dependency
- ❌ Less control over data flow

**No changes needed** - your current Zapier integration is working perfectly!

## Environment Variables Setup

Add these to your `.env.local` file:

```bash
# HubSpot Integration Configuration
# Choose ONE of the following integration methods:

# Option 1: Forms API (Works with Developer Accounts)
# HUBSPOT_PORTAL_ID=your-portal-id-here
# HUBSPOT_FORM_ID=your-form-id-here

# Option 2: Private App (Requires Paid HubSpot Account)
# HUBSPOT_PRIVATE_APP_TOKEN=your-private-app-token-here

# Legacy API Key (Not recommended - for reference only)
# HUBSPOT_ACCESS_TOKEN=eu1-b549-ec3f-4cd9-be80-c79dc4a116c3

# Other integrations (keep these)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-webhook-url
PIXEL_TRACKING_URL=https://your-pixel-tracking-url.com
```

## Code Changes Made

Your `app/api/hubspot/contact/route.ts` has been updated to support both integration methods:

1. **Forms API integration** - Uses HubSpot's native form submission endpoint
2. **Private App integration** - Uses modern HubSpot CRM API with proper authentication
3. **Automatic fallback** - Tries Private App first, then Forms API

## Testing Your Integration

1. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/hubspot/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+966501234567",
       "company": "Test Company",
       "message": "This is a test message"
     }'
   ```

2. **Check the response:**
   - Forms API: Returns `submissionId` and `method: 'forms_api'`
   - Private App: Returns `contactId` and `method: 'private_app'`

## Pricing Comparison

| Option | Cost | Features |
|--------|------|----------|
| **HubSpot Free CRM** | Free | Full CRM, 1M contacts, basic features |
| **HubSpot Starter** | $20/month | Advanced features, automation |
| **HubSpot Professional** | $890/month | Marketing automation, advanced reporting |
| **Developer Account** | Free | Limited to webhooks/timeline events only |

## Recommended Next Steps

1. **Upgrade to HubSpot Free CRM** (recommended)
2. **Create a Private App** with proper scopes
3. **Test your integration** thoroughly
4. **Monitor your HubSpot contact creation** to ensure data is flowing correctly

## FAQ

**Q: Will upgrading to Free CRM affect my existing developer account?**
A: No, you can upgrade seamlessly. All your existing integrations will continue to work.

**Q: What's the difference between Forms API and Private App?**
A: Forms API is simpler but limited. Private App gives you full control over contact creation and custom properties.

**Q: Can I use both methods simultaneously?**
A: Yes, the code is designed to try Private App first, then fall back to Forms API if needed.

**Q: How do I get my Portal ID?**
A: Go to HubSpot Settings → Account Setup → Account Information. Your HubSpot ID is your Portal ID.

**Q: What if I want to stick with Zapier?**
A: That's perfectly fine! Your current Zapier integration is working well. You can remove the HubSpot direct integration if you prefer.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test with the curl command above
4. Check HubSpot's activity logs for incoming data

---

**Next Steps**: Choose your preferred integration method and follow the setup instructions above. The Private App method is recommended for maximum control and features. 