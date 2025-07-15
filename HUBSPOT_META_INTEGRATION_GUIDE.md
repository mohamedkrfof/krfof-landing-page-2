# 🚀 HubSpot + Meta + Website Integration Guide

## 📋 **Complete Customer Journey Automation**

### **🎯 What This Integration Does:**

```
1. Lead Capture → Website Form → HubSpot Contact + Meta Lead Event
2. Lead Qualification → HubSpot Status Change → Meta Enhanced Lead Event  
3. Opportunity Creation → HubSpot Deal → Meta InitiateCheckout Event
4. Deal Won → HubSpot Deal Closed → Meta Purchase Event (Real Value)
```

**Result**: Every customer touchpoint updates Meta automatically for perfect attribution and optimization.

---

## 🏗️ **Architecture Overview**

### **Data Flow:**
```
Website Form Submission
    ↓
HubSpot Contact Created (with lead scoring)
    ↓ 
Meta Lead Event (immediate tracking)
    ↓
HubSpot Workflows (qualification, nurturing)
    ↓
HubSpot Webhooks → Your API → Meta Events
    ↓
Meta receives: Lead → InitiateCheckout → Purchase
```

### **Event Mapping:**
| HubSpot Action | Meta Event | Value | Purpose |
|----------------|------------|-------|---------|
| Form Submit | Lead | 100 SAR | Initial lead capture |
| Lead Qualified | Lead | 200 SAR | Qualified lead signal |
| Deal Created | InitiateCheckout | 500 SAR | Purchase intent |
| Deal Won | Purchase | **Real Deal Amount** | Actual conversion |

---

## 🔧 **Implementation Steps**

### **Step 1: Environment Variables Setup**

Add to your `.env.local`:

```bash
# HubSpot Integration
HUBSPOT_ACCESS_TOKEN=your_hubspot_private_app_token
HUBSPOT_PORTAL_ID=your_hubspot_portal_id
HUBSPOT_WEBHOOK_SECRET=your_webhook_secret

# Meta Conversions API (existing)
META_ACCESS_TOKEN=your_meta_access_token
META_DATASET_ID=1828066298063484
META_PIXEL_ID=1828066298063484
META_TEST_EVENT_CODE=TEST12345 # Optional for testing

# Website Domain
NEXT_PUBLIC_DOMAIN=https://krfof-leadmagnet.vercel.app
```

### **Step 2: HubSpot Setup**

#### **2.1 Create Private App:**
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create new app with these scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.schemas.contacts.read`
   - `crm.schemas.deals.read`

#### **2.2 Setup Webhooks:**
1. Go to HubSpot → Settings → Integrations → Webhooks
2. Create webhook pointing to: `https://your-domain.com/api/hubspot/webhook`
3. Subscribe to these events:
   - `contact.propertyChange` (for lead status updates)
   - `deal.creation` (for new opportunities)
   - `deal.propertyChange` (for deal stage changes)

#### **2.3 Create Custom Properties (Optional):**
- `meta_lead_event_id` (Single-line text)
- `lead_score_calculated` (Number)
- `meta_tracking_status` (Single-line text)

### **Step 3: Meta Conversions API Setup**

Your existing setup is perfect! The integration uses:
- **Dataset ID**: `1828066298063484`
- **Access Token**: Already configured
- **Events**: Lead, InitiateCheckout, Purchase, ViewContent

### **Step 4: Test the Integration**

#### **4.1 Test Form Submission:**
```bash
curl -X POST https://your-domain.com/api/hubspot/contact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "أحمد محمد",
    "phone": "+966501234567",
    "quantity": "5",
    "city": "الرياض"
  }'
```

#### **4.2 Test Webhook:**
```bash
curl -X POST https://your-domain.com/api/hubspot/webhook \
  -H "Content-Type: application/json" \
  -d '[{
    "eventId": 1,
    "subscriptionId": 12345,
    "portalId": 12345678,
    "occurredAt": 1640995200000,
    "subscriptionType": "contact.propertyChange",
    "attemptNumber": 0,
    "objectId": 12345,
    "changeSource": "CRM_UI",
    "changeFlag": "NEW",
    "propertyName": "hs_lead_status",
    "propertyValue": "qualified"
  }]'
```

---

## ⚠️ **Challenges & Solutions**

### **1. Data Synchronization Timing**
**Challenge**: HubSpot updates might happen before Meta events are processed
**Solution**: 
- Use event IDs for deduplication
- Implement retry logic with exponential backoff
- Store lead tracking data for reference

### **2. Customer Matching Across Platforms**
**Challenge**: Ensuring same customer is tracked consistently
**Solution**:
- Use HubSpot Contact ID as external_id in Meta
- Hash all PII consistently (SHA-256)
- Store email as primary identifier

### **3. Event Deduplication**
**Challenge**: Preventing duplicate events from multiple sources
**Solution**:
- Unique event IDs with source prefix
- Browser events: `lead_browser_timestamp_random`
- Server events: `lead_server_contactid_timestamp`
- Webhook events: `status_contactid_timestamp`

### **4. Privacy & Compliance**
**Challenge**: GDPR/CCPA compliance with data sharing
**Solution**:
- Hash all PII before sending to Meta
- Include consent tracking in forms
- Implement data deletion workflows

### **5. Webhook Reliability**
**Challenge**: HubSpot webhooks might fail or retry
**Solution**:
- Implement idempotency using event IDs
- Verify webhook signatures
- Handle retries gracefully

### **6. Deal Value Tracking**
**Challenge**: Mapping HubSpot deal amounts to Meta accurately
**Solution**:
- Use real deal amounts for Purchase events
- Apply probability multipliers for pipeline stages
- Track currency conversion if needed

### **7. Error Handling**
**Challenge**: API failures shouldn't break the customer experience
**Solution**:
- Wrap all external API calls in try-catch
- Log errors without exposing sensitive data
- Continue form processing even if tracking fails

---

## 📊 **Monitoring & Optimization**

### **Key Metrics to Track:**
- Lead Event Success Rate (should be >95%)
- Webhook Processing Time (should be <2 seconds)
- Meta Event Delivery Rate (check Meta Events Manager)
- HubSpot Contact Creation Rate

### **Debug Tools:**
- Meta Events Manager → Test Events
- HubSpot → Settings → Webhooks → Recent Deliveries
- Your application logs
- Browser Network tab for client-side events

### **Performance Optimization:**
- Batch webhook processing for high volume
- Cache HubSpot contact data temporarily
- Use Promise.all() for parallel API calls
- Implement proper rate limiting

---

## 🚀 **Advanced Features**

### **1. Lead Scoring Integration**
Update Meta with lead scores for better optimization:
```javascript
custom_data: {
  value: calculateLeadValue(hubspotScore),
  lead_quality: mapScoreToQuality(hubspotScore),
  predicted_ltv: calculatePredictedValue(deal)
}
```

### **2. Attribution Mapping**
Track campaign attribution from form to purchase:
```javascript
custom_data: {
  utm_source: originalUtmSource,
  utm_campaign: originalCampaign,
  attribution_touchpoints: touchpointHistory
}
```

### **3. Custom Audiences**
Create Meta audiences based on HubSpot data:
- Qualified leads
- High-value prospects
- Deal pipeline stages
- Customer segments

---

## 🔒 **Security Best Practices**

### **1. API Security:**
- Use environment variables for all tokens
- Implement webhook signature verification
- Rate limit webhook endpoints
- Validate all input data

### **2. Data Protection:**
- Hash all PII using SHA-256
- Never log sensitive data
- Implement proper error handling
- Use HTTPS for all communications

### **3. Access Control:**
- Minimum required HubSpot scopes
- Separate test and production tokens
- Regular token rotation
- Monitor API usage

---

## 📈 **Expected Results**

### **Attribution Improvement:**
- 25-40% better conversion tracking
- Reduced customer acquisition cost
- Improved ROAS (Return on Ad Spend)

### **Optimization Benefits:**
- Better audience targeting
- Improved ad delivery
- Enhanced lookalike audiences
- Real-time conversion optimization

### **Business Intelligence:**
- Complete customer journey visibility
- Accurate revenue attribution
- Pipeline forecasting
- Campaign performance insights

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **Form Not Creating HubSpot Contacts:**
1. Check `HUBSPOT_ACCESS_TOKEN` validity
2. Verify API scopes include contact write permissions
3. Check HubSpot API rate limits

#### **Meta Events Not Appearing:**
1. Verify `META_ACCESS_TOKEN` permissions
2. Check Meta Events Manager for errors
3. Ensure event IDs are unique
4. Validate data format (hashed emails, etc.)

#### **Webhooks Not Firing:**
1. Check webhook URL is publicly accessible
2. Verify webhook signature validation
3. Check HubSpot webhook configuration
4. Monitor webhook delivery logs

#### **Duplicate Events:**
1. Implement proper event ID generation
2. Check for multiple webhook subscriptions
3. Ensure client/server event deduplication

---

## 📞 **Support & Resources**

### **Documentation:**
- [HubSpot Webhooks API](https://developers.hubspot.com/docs/api/webhooks)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### **Testing Tools:**
- [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper)
- [HubSpot API Testing Tool](https://developers.hubspot.com/docs/api/working-with-oauth)
- [Webhook.site](https://webhook.site) for testing webhooks

This integration creates a powerful, unified tracking system that provides complete visibility into your customer journey while maximizing Meta's advertising optimization capabilities. 