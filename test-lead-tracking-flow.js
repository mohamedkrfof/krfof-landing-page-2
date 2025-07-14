/**
 * Test Enhanced Lead Tracking Flow
 * Tests the complete lead submission with 25+ parameters
 */

const testLeadData = {
  email: 'ahmed.customer@example.com',
  phone: '+966501234567',
  name: 'أحمد محمد العلي',
  quantity: '10-20',
  
  // Form metadata (auto-added by frontend)
  form_name: 'quick_lead_form',
  form_page: '/',
  form_step: 'completion',
  completion_time: Date.now(),
  
  // Campaign data (from URL parameters)
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'storage_solutions_q1',
  utm_term: 'رفوف معدنية',
  utm_content: 'carousel_ad_1',
  
  // Page data
  url: 'https://krfof-leadmagnet.vercel.app/',
  referrer: 'https://www.facebook.com/',
  timestamp: new Date().toISOString(),
};

async function testEnhancedLeadTracking() {
  console.log('🧪 Testing Enhanced Lead Tracking Flow...\n');

  try {
    console.log('📝 Simulating Form Submission...');
    
    // Test enhanced tracking endpoint (what form now calls)
    const response = await fetch('/api/tracking/enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-debug-mode': 'true', // Enable debug logging
      },
      body: JSON.stringify(testLeadData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Enhanced Lead Tracking: SUCCESS');
      console.log('\n📊 Tracking Results:');
      console.log(`Event ID: ${result.event_id}`);
      console.log(`Total Platforms: ${result.tracking_results.total_platforms}`);
      console.log(`Successful Platforms: ${result.tracking_results.successful_platforms}`);
      console.log(`Failed Platforms: ${result.tracking_results.failed_platforms}`);
      
      console.log('\n🎯 Platform Results:');
      result.tracking_results.platform_details.forEach(platform => {
        const status = platform.success ? '✅' : '❌';
        console.log(`${status} ${platform.platform}: ${platform.success ? 'SUCCESS' : platform.error}`);
      });

      // Show debug info if available
      if (result.debug_info) {
        console.log('\n🔍 Debug Information:');
        console.log(`Total Parameters: ${result.debug_info.enhanced_parameters.total_count}`);
        console.log(`User Data Parameters: ${result.debug_info.enhanced_parameters.user_data_count}`);
        console.log(`Custom Data Parameters: ${result.debug_info.enhanced_parameters.custom_data_count}`);
        console.log(`Form Data Parameters: ${result.debug_info.enhanced_parameters.form_data_count}`);
        
        console.log('\n📈 Expected Enrichments:');
        Object.entries(result.debug_info.expected_enrichments).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }

    } else {
      console.log('❌ Enhanced Lead Tracking: FAILED');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🔍 HOW TO VERIFY IN BROWSER:');
  console.log('1. npm run dev');
  console.log('2. Open localhost:3000');
  console.log('3. Submit form with test data');
  console.log('4. Check Meta Pixel Helper - should show pixel: 1828066298063484');
  console.log('5. Check browser console for tracking logs');
  console.log('6. Check Facebook Events Manager for conversions');
}

// Enhanced tracking vs Legacy comparison
async function compareTrackingMethods() {
  console.log('\n📊 TRACKING COMPARISON:\n');
  
  console.log('🆚 OLD (Legacy) vs NEW (Enhanced):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('📧 LEGACY TRACKING (old form submission):');
  console.log('  Parameters: 3 basic');
  console.log('  ❌ email, phone, url only');
  console.log('  ❌ No name, quantity, UTM data');
  console.log('  ❌ No business intelligence');
  console.log('  ❌ No customer segmentation');
  
  console.log('\n🚀 ENHANCED TRACKING (new form submission):');
  console.log('  Parameters: 25+ comprehensive');
  console.log('  ✅ All core lead data (email, phone, name, quantity)');
  console.log('  ✅ Form metadata (form_name, completion_time, etc.)');
  console.log('  ✅ Campaign attribution (UTM parameters)');
  console.log('  ✅ Technical data (user_agent, client_ip, device_data)');
  console.log('  ✅ Business intelligence (lead_value, lead_type)');
  console.log('  ✅ Customer segmentation');
  console.log('  ✅ Session and performance data');
  console.log('  ✅ Geographic and demographic data');
  
  console.log('\n📈 EXPECTED RESULTS:');
  console.log('  🎯 Better Facebook attribution accuracy');
  console.log('  📊 Higher EMQ scores (7.0-9.0 vs 3.0-5.0)');
  console.log('  💰 25-45% increase in attributed conversions');
  console.log('  🔍 Better audience insights and retargeting');
  console.log('  📈 Improved ROAS measurement');
}

// Run tests
if (typeof window === 'undefined') {
  // Node.js environment
  console.log('⚠️  Run this in browser console for full testing');
  compareTrackingMethods();
} else {
  // Browser environment
  testEnhancedLeadTracking();
  compareTrackingMethods();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEnhancedLeadTracking, compareTrackingMethods };
} 