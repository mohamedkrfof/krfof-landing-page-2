// Use built-in fetch (Node.js 18+)
async function testProductionHubSpot() {
  console.log('🧪 Testing Production HubSpot Integration...\n');

  const testData = {
    email: 'test-production@example.com',
    name: 'Test Production',
    phone: '+966501234567',
    quantity: '5',
    city: 'الرياض',
    utm_source: 'production_test',
    utm_medium: 'diagnostic',
    utm_campaign: 'hubspot_fix',
    leadMagnet: 'تجربة الإنتاج',
    timestamp: new Date().toISOString()
  };

  try {
    console.log('📍 Testing Production API: https://app.krfof.com/api/hubspot/forms-submit');
    console.log('📋 Test Data:', JSON.stringify(testData, null, 2));

    const response = await fetch('https://app.krfof.com/api/hubspot/forms-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('\n📊 Response Status:', response.status);
    
    const responseData = await response.json();
    console.log('📋 Response Data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success) {
      console.log('✅ PRODUCTION TEST PASSED - HubSpot integration working');
      if (responseData.submission_id) {
        console.log('🎯 HubSpot Submission ID:', responseData.submission_id);
      }
    } else {
      console.log('❌ PRODUCTION TEST FAILED');
      console.log('🔍 Error Details:', responseData.error || 'Unknown error');
    }

  } catch (error) {
    console.log('❌ PRODUCTION TEST ERROR:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting HubSpot Production Test\n');
  console.log('='.repeat(60));
  
  await testProductionHubSpot();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Completed');
  console.log('\n💡 Expected behavior:');
  console.log('✅ Status: 200');
  console.log('✅ success: true');
  console.log('✅ submission_id: present');
  console.log('✅ method: "forms_api"');
}

runTests(); 