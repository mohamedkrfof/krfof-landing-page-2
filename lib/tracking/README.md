# Enhanced Tracking Architecture

## 🚀 Overview

This enhanced tracking system provides comprehensive conversion tracking to Meta (Facebook), Google Analytics, TikTok, Snapchat, and other advertising platforms. It's designed to send every possible parameter these platforms can consume while maintaining security through proper data encryption and following each platform's best practices.

## 🏗️ Architecture

### Core Components

1. **EnhancedTrackingService** - Main orchestrator that manages all tracking operations
2. **DataEnrichmentService** - Collects comprehensive user, device, and session data
3. **EncryptionService** - Handles SHA-256 hashing for sensitive data according to platform standards
4. **Platform Adapters** - Individual adapters for each advertising platform
5. **Configuration Manager** - Centralized configuration for all platforms and settings

### Data Flow

```
Form Submission → Session Storage → Thank You Page → Enhanced Tracking API → Platform Adapters → Ad Platforms
```

## 🔧 Features

### ✅ Comprehensive Data Collection

- **User Data**: Email, phone, name, location (all properly hashed)
- **Device Data**: Browser, OS, screen resolution, timezone
- **Session Data**: Visit duration, page views, referrer, UTM parameters
- **Custom Data**: Lead value, product category, customer segmentation
- **Performance Data**: Page load times, form completion time
- **Campaign Data**: UTM parameters, ad click IDs, campaign attribution

### ✅ Multi-Platform Support

- **Meta (Facebook)**: Conversions API with all available parameters
- **Google Analytics 4**: Measurement Protocol
- **TikTok**: Events API
- **Snapchat**: Conversions API
- **Twitter**: Conversions API (configurable)
- **LinkedIn**: Conversions API (configurable)
- **Pinterest**: Conversions API (configurable)

### ✅ Security & Privacy

- **SHA-256 Encryption**: All sensitive data hashed according to platform standards
- **GDPR Compliance**: Data processing options and consent management
- **CCPA Compliance**: Privacy controls and opt-out mechanisms
- **Do Not Track**: Respects user privacy preferences

### ✅ Reliability

- **Parallel Processing**: All platforms called simultaneously for speed
- **Retry Mechanisms**: Automatic retries for failed requests
- **Fallback Systems**: Backup platforms if primary fails
- **Error Handling**: Comprehensive error logging and recovery

## 🚀 Usage

### Basic Implementation

```typescript
import { EnhancedTrackingService } from '@/lib/tracking/enhancedTrackingService';

const trackingService = EnhancedTrackingService.getInstance();

// Track a lead conversion
const result = await trackingService.trackLead({
  email: 'user@example.com',
  phone: '+966501234567',
  name: 'أحمد محمد',
  quantity: '5-10',
});

console.log(`Tracked to ${result.success_count} platforms`);
```

### API Endpoint Usage

```typescript
// POST /api/tracking/enhanced
{
  "email": "user@example.com",
  "phone": "+966501234567",
  "name": "أحمد محمد",
  "quantity": "5-10",
  "utm_source": "google",
  "utm_campaign": "storage_solutions"
}
```

### Thank You Page Integration

The system automatically triggers on the thank you page when lead data is available in session storage.

## 🔐 Environment Variables

Add these to your `.env.local` file:

```bash
# Meta (Facebook)
META_ACCESS_TOKEN=your_meta_access_token
META_PIXEL_ID=your_meta_pixel_id

# Google Analytics 4
GA4_MEASUREMENT_ID=your_ga4_measurement_id
GA4_API_SECRET=your_ga4_api_secret

# TikTok
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token
TIKTOK_PIXEL_ID=CKHS5RRC77UFTHK7BKJ0

# Snapchat
SNAPCHAT_ACCESS_TOKEN=your_snapchat_access_token
SNAPCHAT_PIXEL_ID=0d75ef7a-3830-4fce-b470-fee261e4b06e

# Twitter (optional)
TWITTER_ACCESS_TOKEN=your_twitter_access_token

# LinkedIn (optional)
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

# Pinterest (optional)
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
```

## 📊 Data Sent to Platforms

### Meta (Facebook) Parameters

**User Data (SHA-256 hashed):**
- `em` - Email
- `ph` - Phone number
- `fn` - First name
- `ln` - Last name
- `ct` - City
- `st` - State
- `zp` - Zip code
- `country` - Country code
- `client_ip_address` - IP address
- `client_user_agent` - User agent
- `fbc` - Facebook click ID
- `fbp` - Facebook browser ID

**Custom Data:**
- `value` - Lead value in SAR
- `currency` - Currency code
- `content_name` - Product name
- `content_category` - Product category
- `lead_type` - Lead qualification
- `customer_segmentation` - Customer type
- `device_type` - Device category
- `lead_source` - Traffic source
- `page_referrer` - Referrer URL
- `user_language` - User language
- `session_duration` - Session length
- `page_view_count` - Pages viewed
- `form_completion_time` - Time to complete form

### Google Analytics 4 Parameters

**Event Data:**
- `client_id` - Unique user identifier
- `event_category` - "lead_generation"
- `event_label` - Lead type
- `value` - Lead value
- `currency` - Currency code
- `page_location` - Current page URL
- `page_referrer` - Referrer URL
- `user_agent` - Browser user agent
- `ip_override` - User IP address

**User Properties:**
- `lead_source` - Traffic source
- `customer_segmentation` - Customer type
- `device_type` - Device category

### TikTok Parameters

**Event Data:**
- `pixel_code` - TikTok pixel ID
- `event` - "CompleteRegistration"
- `timestamp` - Event timestamp
- `context.page.url` - Current page URL
- `context.page.referrer` - Referrer URL
- `context.user.email` - Hashed email
- `context.user.phone_number` - Hashed phone
- `properties.value` - Lead value
- `properties.currency` - Currency code
- `properties.content_name` - Product name

### Snapchat Parameters

**Event Data:**
- `pixel_id` - Snapchat pixel ID
- `event` - "SIGN_UP"
- `event_conversion_type` - "WEB"
- `timestamp` - Event timestamp
- `hashed_email` - SHA-256 hashed email
- `hashed_phone_number` - SHA-256 hashed phone
- `user_agent` - Browser user agent
- `custom_data.value` - Lead value
- `custom_data.currency` - Currency code

## 🔧 Configuration

### Platform Configuration

```typescript
import { createTrackingConfig } from '@/lib/tracking/config';

// Custom configuration
const config = createTrackingConfig({
  platforms: {
    meta: { enabled: true },
    google: { enabled: true },
    tiktok: { enabled: false }, // Disable TikTok
    snapchat: { enabled: true },
  },
  default_currency: 'SAR',
  enable_debug: process.env.NODE_ENV === 'development',
});

// Apply configuration
trackingService.updateConfig(config);
```

### Environment-Specific Settings

The system automatically applies different configurations based on the environment:

- **Development**: Only Meta enabled, debug logging on
- **Staging**: Meta + Google enabled, debug logging on
- **Production**: All platforms enabled, debug logging off

## 🧪 Testing

### Test the Tracking Service

```typescript
import { EnhancedTrackingService } from '@/lib/tracking/enhancedTrackingService';

const trackingService = EnhancedTrackingService.getInstance();

// Run test tracking
const result = await trackingService.testTracking();
console.log('Test results:', result);
```

### Test API Endpoint

```bash
# Test the enhanced tracking API
curl -X POST http://localhost:3000/api/tracking/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+966501234567",
    "name": "أحمد محمد",
    "quantity": "5-10"
  }'
```

### Health Check

```bash
# Check service health
curl http://localhost:3000/api/tracking/enhanced
```

## 🔍 Monitoring & Debugging

### Debug Mode

Enable debug mode in development:

```typescript
trackingService.updateConfig({
  enable_debug: true,
  log_errors: true,
});
```

### Error Handling

All errors are logged and tracked:

```typescript
{
  "success_count": 2,
  "failure_count": 1,
  "results": [
    {
      "platform": "meta",
      "success": true,
      "event_id": "lead_1234567890_abc123"
    },
    {
      "platform": "google",
      "success": true,
      "event_id": "lead_1234567890_abc123"
    },
    {
      "platform": "tiktok",
      "success": false,
      "error": "Invalid access token"
    }
  ]
}
```

## 🚀 Extending the System

### Adding New Platforms

1. **Define Platform Types**:
```typescript
// lib/tracking/types.ts
export interface LinkedInEvent {
  conversion_id: string;
  conversionHappenedAt: number;
  // ... other fields
}
```

2. **Create Platform Adapter**:
```typescript
// lib/tracking/enhancedTrackingService.ts
private async sendToLinkedIn(event: EnhancedTrackingEvent): Promise<TrackingResponse> {
  // Implementation
}
```

3. **Add Configuration**:
```typescript
// lib/tracking/config.ts
linkedin: {
  enabled: true,
  endpoint: 'https://api.linkedin.com/rest/conversionEvents',
  retry_attempts: 3,
  timeout: 30000,
}
```

### Custom Data Enrichment

```typescript
// lib/tracking/dataEnrichment.ts
export class CustomDataEnrichmentService extends DataEnrichmentService {
  enhanceCustomData(baseData: Partial<CustomData>, leadData: any): CustomData {
    const enhanced = super.enhanceCustomData(baseData, leadData);
    
    // Add custom business logic
    enhanced.industry = this.detectIndustry(leadData);
    enhanced.lead_score = this.calculateLeadScore(leadData);
    
    return enhanced;
  }
}
```

## 📈 Performance Optimization

### Parallel Processing

All platforms are called simultaneously to minimize latency:

```typescript
const platformPromises = [
  this.sendToMeta(event),
  this.sendToGoogle(event),
  this.sendToTikTok(event),
  this.sendToSnapchat(event),
];

const results = await Promise.allSettled(platformPromises);
```

### Batch Processing

For high-volume scenarios, events can be batched:

```typescript
trackingService.updateConfig({
  batch_size: 10,
  batch_timeout: 5000,
});
```

### Rate Limiting

Each platform has configured rate limits:

```typescript
rate_limit: {
  requests_per_second: 100,
  burst_limit: 200,
}
```

## 🔒 Security Best Practices

### Data Encryption

All sensitive data is SHA-256 hashed:

```typescript
const encryptionService = EncryptionService.getInstance();
const hashedEmail = await encryptionService.hashEmail(email);
```

### Privacy Compliance

- GDPR compliance with data processing options
- CCPA compliance with privacy controls
- Do Not Track header respect
- User consent management

### Access Control

- Environment-specific API keys
- Rate limiting per platform
- Request validation and sanitization
- Error message sanitization

## 🎯 Lead Value Calculation

The system automatically calculates lead values based on quantity:

```typescript
const LEAD_VALUES = {
  '1-5': 1500,    // 3 shelves × 500 SAR
  '5-10': 3750,   // 7.5 shelves × 500 SAR
  '10+': 7500,    // 15 shelves × 500 SAR
};
```

## 📊 Customer Segmentation

Automatic customer segmentation based on behavior:

- `new_customer_to_business` - First-time visitors
- `existing_customer_to_business` - Returning visitors
- `high_value_lead` - 10+ quantity requests
- `medium_value_lead` - 5-10 quantity requests
- `standard_lead` - 1-5 quantity requests

## 🎨 Best Practices

### Implementation

1. **Always hash sensitive data** before sending to platforms
2. **Use parallel processing** for multiple platforms
3. **Implement proper error handling** with fallbacks
4. **Respect privacy settings** and user consent
5. **Monitor and log** all tracking activities

### Data Quality

1. **Validate all input data** before processing
2. **Normalize data formats** (phone numbers, emails)
3. **Enrich data** with additional context
4. **Calculate accurate values** for business intelligence

### Performance

1. **Use singleton pattern** for service instances
2. **Implement caching** for frequently accessed data
3. **Batch requests** when possible
4. **Set appropriate timeouts** for API calls

## 📚 References

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Google Analytics 4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [TikTok Events API Documentation](https://ads.tiktok.com/marketing_api/docs?id=1741601162187777)
- [Snapchat Conversions API Documentation](https://marketingapi.snapchat.com/docs/conversion.html)

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**: Check environment variables
2. **Rate Limiting**: Implement proper delays between requests
3. **Data Validation**: Ensure all required fields are present
4. **CORS Issues**: Configure proper headers for cross-origin requests

### Debug Commands

```bash
# Check service status
curl localhost:3000/api/tracking/enhanced

# Test with sample data
curl -X POST localhost:3000/api/tracking/enhanced \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"+966501234567","name":"Test User"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 