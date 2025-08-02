#!/usr/bin/env node

/**
 * Test script for Zapier webhook integration
 * This script tests the /api/zapier-webhook endpoint
 */

const https = require('https');

// Test data - sample lead form submission
const testData = {
  name: 'أحمد محمد',
  email: 'ahmed.test@example.com',
  phone: '+966501234567',
  quantity: '5',
  leadMagnet: 'رفوف تخزين معدنية - طلب عرض أسعار',
  timestamp: new Date().toISOString(),
  url: 'https://krfof-leadmagnet.vercel.app/landing/riyadh',
  referrer: 'https://google.com',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'riyadh-shelving-2024',
  utm_term: 'رفوف تخزين',
  utm_content: 'ad-variant-a',
  deviceInfo: {
    platform: 'Win32',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  city: 'riyadh',
  fbp: 'fb.1.1704067200000.12345',
  fbc: 'fb.1.1704067200000.IwAR0abcdef123',
};

async function testZapierWebhook() {
  console.log('🧪 Testing Zapier webhook integration...\n');
  console.log('📤 Test data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/zapier-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success Response:');
      console.log(JSON.stringify(result, null, 2));
      
      console.log('\n🎯 Expected data in Zapier:');
      console.log('- Name:', testData.name);
      console.log('- Email:', testData.email);
      console.log('- Phone:', testData.phone);
      console.log('- Quantity:', testData.quantity);
      console.log('- Lead Score: ~75 (estimated)');
      console.log('- Estimated Value: ~1,615 SAR (5 units × 340 × 0.95 bulk discount)');
      console.log('- Priority: medium (has phone, 5+ quantity)');
      console.log('- UTM Source:', testData.utm_source);
      console.log('- City:', testData.city);
      
    } else {
      const errorResult = await response.json();
      console.log('❌ Error Response:');
      console.log(JSON.stringify(errorResult, null, 2));
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js dev server is running:');
      console.log('   npm run dev');
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🔗 Zapier webhook URL: https://hooks.zapier.com/hooks/catch/23446220/uuymrjh/');
  console.log('📝 Check your Zapier dashboard to verify the data was received');
}

// Test direct Zapier webhook (bypass our API)
async function testDirectZapier() {
  console.log('\n🔄 Testing direct Zapier webhook...');
  
  const directPayload = {
    name: testData.name,
    email: testData.email,
    phone: testData.phone,
    quantity: testData.quantity,
    leadMagnet: testData.leadMagnet,
    message: `طلب عرض أسعار رفوف جديدة - الكمية: ${testData.quantity}`,
    timestamp: testData.timestamp,
    source: 'krfof-leadmagnet',
    form_type: 'quote_request',
    page_url: testData.url,
    referrer: testData.referrer,
    user_agent: testData.userAgent,
    utm_source: testData.utm_source,
    utm_medium: testData.utm_medium,
    utm_campaign: testData.utm_campaign,
    utm_term: testData.utm_term,
    utm_content: testData.utm_content,
    device_info: testData.deviceInfo,
    city: testData.city,
    facebook_browser_id: testData.fbp,
    facebook_click_id: testData.fbc,
    lead_score: 75,
    estimated_value: 1615,
    priority: 'medium'
  };

  try {
    const response = await fetch('https://hooks.zapier.com/hooks/catch/23446220/uuymrjh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directPayload),
    });

    console.log(`📊 Direct Zapier Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ Direct Zapier webhook successful!');
      console.log('📝 Check your Zapier dashboard for the new entry');
    } else {
      console.log('❌ Direct Zapier webhook failed');
    }

  } catch (error) {
    console.error('💥 Direct Zapier test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Zapier Webhook Integration Test\n');
  
  // Test 1: Through our API endpoint
  await testZapierWebhook();
  
  // Test 2: Direct to Zapier
  await testDirectZapier();
  
  console.log('\n✨ Test completed! Check console output and Zapier dashboard for results.');
}

// Handle both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  if (typeof fetch === 'undefined') {
    // For Node.js < 18, you might need to install node-fetch
    console.log('⚠️  Note: This test requires Node.js 18+ for fetch support');
    console.log('   Or install node-fetch: npm install node-fetch');
    process.exit(1);
  }
  
  runTests().catch(console.error);
} else {
  // Browser environment
  console.log('🌐 Running in browser environment');
  runTests().catch(console.error);
} 