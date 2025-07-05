# HubSpot Integration Test Report & Guide

## 📋 Integration Overview

The HubSpot integration is properly configured with the following components:

### ✅ Integration Components
- **API Endpoint**: `/app/api/hubspot/contact/route.ts`
- **Form Component**: `components/QuickLeadForm.tsx`
- **Environment Variable**: `HUBSPOT_ACCESS_TOKEN`

### 📊 Data Flow
1. Form submission in `QuickLeadForm.tsx`
2. Data sent to multiple endpoints (Zapier, HubSpot, Pixel tracking)
3. HubSpot API processes the contact creation
4. Lead scoring and business type detection
5. Optional note creation for detailed information

## 🧪 Testing Methods

### Method 1: Automated Testing (Recommended)

Run the Node.js test script:
```bash
# Start your Next.js development server first
npm run dev

# In another terminal, run the test
node test-hubspot-integration.js
```

### Method 2: Manual Testing with cURL

Make the script executable and run:
```bash
chmod +x test-hubspot-manual.sh
./test-hubspot-manual.sh
```

### Method 3: Frontend Form Testing

1. Start the development server: `npm run dev`
2. Navigate to any landing page (e.g., `http://localhost:3000/landing/riyadh`)
3. Fill out the form with test data
4. Submit and check browser console for responses

## 📝 Test Scenarios

### Scenario 1: Basic Form Data
```json
{
  "name": "أحمد محمد العبدالله",
  "email": "ahmed.test@example.com",
  "phone": "+966501234567",
  "quantity": "5-10"
}
```

### Scenario 2: Complete Form Data
```json
{
  "name": "فاطمة سعد المطيري",
  "email": "fatima@almatiri-company.com",
  "phone": "+966501234567",
  "quantity": "10+",
  "company": "شركة المطيري للمقاولات",
  "message": "نحتاج عرض أسعار شامل للرفوف المعدنية"
}
```

### Scenario 3: Minimal Data
```json
{
  "name": "علي أحمد",
  "email": "ali@gmail.com",
  "phone": "+966555123456",
  "quantity": "1-5"
}
```

## 🎯 Expected Results

### ✅ Successful Response
```json
{
  "success": true,
  "contactId": "12345678901",
  "leadScore": 75
}
```

### ❌ Error Response
```json
{
  "error": "HubSpot sync failed",
  "details": "Error message details"
}
```

## 🔍 Integration Features

### Lead Scoring Algorithm
The integration calculates lead scores based on:
- **Base Score**: 50 points
- **Company Name** (+10): Quality company name (>5 characters)
- **Message** (+15): Detailed message (>20 characters)
- **Saudi Phone** (+20): Saudi phone number (+966)
- **Professional Email** (+10): Non-Gmail/Hotmail domains
- **Desktop Device** (+5): Desktop platform detection

### Business Type Detection
Automatic categorization based on company name:
- مؤسسة/establishment → "establishment"
- شركة/company → "company"
- مصنع/factory → "factory"
- مستودع/warehouse → "warehouse"
- متجر/store → "retail"

### Arabic Market Optimization
- Market region: "saudi_arabia"
- Language preference: "arabic"
- Lead source: "website"
- Lead magnet: "دليل حلول التخزين المتقدمة"

## 🛠️ Troubleshooting

### Common Issues

#### 1. Missing Environment Variable
**Error**: `HubSpot API error: 401`
**Solution**: Add `HUBSPOT_ACCESS_TOKEN` to `.env.local`

#### 2. Invalid HubSpot Token
**Error**: `HubSpot API error: 401`
**Solution**: Verify token has correct permissions in HubSpot

#### 3. Network/Connection Issues
**Error**: Network error or timeout
**Solution**: Check internet connection and HubSpot API status

#### 4. Form Validation Errors
**Error**: Form fields not submitting
**Solution**: Check Zod validation schema in `QuickLeadForm.tsx`

### Environment Setup

Create a `.env.local` file with:
```env
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
```

### HubSpot Token Permissions Required
- `crm.objects.contacts.write`
- `crm.objects.contacts.read`
- `crm.objects.notes.write` (for detailed notes)

## 📊 Testing Checklist

- [ ] Environment variables configured
- [ ] Development server running
- [ ] HubSpot token has correct permissions
- [ ] Basic form submission works
- [ ] Lead scoring calculation works
- [ ] Arabic character handling works
- [ ] Business type detection works
- [ ] Error handling works properly
- [ ] Frontend form integration works
- [ ] Multiple submission scenarios tested

## 🔄 Continuous Testing

### Automated Testing Schedule
Run tests:
- Before deployments
- After HubSpot configuration changes
- Weekly for integration health checks

### Monitoring
- Check HubSpot contact creation logs
- Monitor form submission success rates
- Verify lead scoring accuracy
- Track integration error rates

## 📈 Integration Metrics

Track these metrics for integration health:
- **Success Rate**: Percentage of successful submissions
- **Lead Score Distribution**: Average and range of lead scores
- **Response Time**: API response time metrics
- **Error Rate**: Percentage of failed submissions
- **Data Quality**: Completeness of contact data

## 🚀 Next Steps

1. Run the automated test suite
2. Verify successful contact creation in HubSpot
3. Test form submission from frontend
4. Monitor integration in production
5. Set up alerts for integration failures 