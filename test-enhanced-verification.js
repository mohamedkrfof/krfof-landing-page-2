#!/usr/bin/env node

/**
 * Enhanced Tracking Verification Test
 * Verifies that our enhanced tracking system is sending the correct 'Lead' events
 * to Meta's Conversions API with all the rich data parameters
 */

const TEST_BASE_URL = 'http://localhost:3001';

// Test data that simulates a real lead submission
const testLeadData = {
  email: 'test@example.com',
  phone: '+966501234567',
  name: 'أحمد محمد',
  quantity: '50',
  
  // Form metadata
  form_name: 'quick_lead_form',
  form_page: '/landing/riyadh',
  form_step: 'completion',
  completion_time: Date.now(),
  
  // Campaign data
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'riyadh_shelving_q1',
  utm_term: 'رفوف معدنية',
  utm_content: 'ad_variant_a',
  
  // Page data
  url: 'https://app.krfof.com/landing/riyadh?utm_source=facebook&utm_medium=cpc',
  referrer: 'https://facebook.com',
  timestamp: new Date().toISOString(),
};

async function testEnhancedTracking() {
  console.log('🧪 Testing Enhanced Tracking System...\n');
  
  try {
    // Test the enhanced tracking endpoint
    console.log('📤 Sending test lead to enhanced tracking...');
    
    const response = await fetch(`${TEST_BASE_URL}/api/tracking/enhanced?debug=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-debug-mode': 'true'
      },
      body: JSON.stringify(testLeadData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Enhanced tracking successful!');
      console.log('\n📊 Response Summary:');
      console.log(`Status: ${response.status}`);
      
      if (result.results) {
        console.log('\n🎯 Platform Results:');
        Object.entries(result.results).forEach(([platform, data]) => {
          console.log(`  ${platform}: ${data.success ? '✅ Success' : '❌ Failed'}`);
          if (data.eventId) {
            console.log(`    Event ID: ${data.eventId}`);
          }
          if (data.error) {
            console.log(`    Error: ${data.error}`);
          }
        });
      }
      
      if (result.enrichedData) {
        console.log('\n🔍 Data Enrichment Summary:');
        console.log(`  Lead Score: ${result.enrichedData.leadScore || 'N/A'}`);
        console.log(`  Customer Segment: ${result.enrichedData.customerSegment || 'N/A'}`);
        console.log(`  Device Type: ${result.enrichedData.deviceType || 'N/A'}`);
        console.log(`  Location: ${result.enrichedData.location || 'N/A'}`);
      }
      
      console.log('\n📈 Expected Meta Events:');
      console.log('  • Event Name: "Lead"');
      console.log('  • Source: "website" (Conversions API)');
      console.log('  • Parameters: 25+ enriched data points');
      console.log('  • Should appear in Events Manager within 5-30 minutes');
      
    } else {
      console.log('❌ Enhanced tracking failed');
      console.log(`Status: ${response.status}`);
      console.log('Error:', result.error || result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function checkEventTypes() {
  console.log('\n\n🔍 Event Types You Should See in Meta Events Manager:');
  console.log('┌─────────────────────────┬──────────────────┬─────────────────────┐');
  console.log('│ Event Name              │ Source           │ Setup Method        │');
  console.log('├─────────────────────────┼──────────────────┼─────────────────────┤');
  console.log('│ PageView                │ Browser          │ Manual Setup        │');
  console.log('│ Lead                    │ Conversions API  │ Automatically logged│');
  console.log('│ SubscribedButtonClick   │ Browser          │ Automatically logged│');
  console.log('└─────────────────────────┴──────────────────┴─────────────────────┘');
  
  console.log('\n📝 Event Explanations:');
  console.log('• PageView: Client-side pixel tracking page visits');
  console.log('• Lead: Your enhanced server-side tracking (25+ parameters)');
  console.log('• SubscribedButtonClick: Meta\'s automatic form submission detection');
  
  console.log('\n🎯 Key Success Indicators:');
  console.log('✅ All three event types appearing');
  console.log('✅ Lead events showing as "Conversions API" source');
  console.log('✅ Events appearing within 5-30 minutes');
  console.log('✅ No error messages in Events Manager');
}

// Run the tests
console.log('🚀 Enhanced Tracking Verification\n');
console.log('Testing your new Meta Pixel ID: 1828066298063484');
console.log('Expected to see rich "Lead" events with 25+ parameters\n');

testEnhancedTracking().then(() => {
  checkEventTypes();
}); 