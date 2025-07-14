import { NextRequest, NextResponse } from 'next/server';
import { EnhancedTrackingService } from '@/lib/tracking/enhancedTrackingService';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const url = new URL(request.url);
    const isDebugMode = url.searchParams.get('debug') === 'true' || request.headers.get('x-debug-mode') === 'true';
    
    // Validate required fields
    if (!data.email || !data.phone || !data.name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, phone, name' },
        { status: 400 }
      );
    }

    // Get enhanced tracking service instance
    const trackingService = EnhancedTrackingService.getInstance();

    // Prepare lead data with additional context
    const leadData = {
      email: data.email,
      phone: data.phone,
      name: data.name,
      quantity: data.quantity,
      
      // Additional fields that might be available
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      company: data.company,
      industry: data.industry,
      company_size: data.company_size,
      job_title: data.job_title,
      interest_level: data.interest_level,
      budget_range: data.budget_range,
      timeline: data.timeline,
      
      // Form metadata
      form_name: data.form_name || 'lead_form',
      form_page: data.form_page || request.nextUrl.pathname,
      form_step: data.form_step || 'completion',
      completion_time: data.completion_time,
      
      // Campaign data
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_term: data.utm_term,
      utm_content: data.utm_content,
      
      // Additional tracking data
      url: data.url || request.nextUrl.href,
      referrer: data.referrer,
      timestamp: data.timestamp || new Date().toISOString(),
      
      // Client data (if available)
      client_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    };

    // Debug logging: Show all input parameters
    if (isDebugMode) {
      console.log('🔍 DEBUG: Enhanced Tracking Input Parameters:', {
        total_input_parameters: Object.keys(leadData).length,
        parameters: Object.keys(leadData),
        sample_data: {
          email: leadData.email ? '***@***.com' : 'not provided',
          phone: leadData.phone ? '+966***' : 'not provided',
          name: leadData.name ? 'provided' : 'not provided',
          quantity: leadData.quantity || 'not provided',
          utm_parameters: {
            source: leadData.utm_source || 'not provided',
            medium: leadData.utm_medium || 'not provided',
            campaign: leadData.utm_campaign || 'not provided',
          },
          business_data: {
            industry: leadData.industry || 'not provided',
            company_size: leadData.company_size || 'not provided',
            interest_level: leadData.interest_level || 'not provided',
          },
        },
      });
    }

    // Track lead using enhanced tracking service
    const result = await trackingService.trackLead(leadData);

    // Enhanced logging for debug mode
    if (isDebugMode) {
      console.log('🔍 DEBUG: Enhanced Tracking Processing Results:', {
        event_id: result.event_id,
        success_count: result.success_count,
        failure_count: result.failure_count,
        total_platforms: result.total_platforms,
        platform_results: result.results.map(r => ({
          platform: r.platform,
          success: r.success,
          error: r.error,
          response_data: r.response_data ? 'included' : 'not included',
        })),
      });
    }

         // Calculate parameter statistics for debug mode
     let debugInfo: Record<string, unknown> = {};
     if (isDebugMode) {
       const leadDataObj = leadData as Record<string, unknown>;
       debugInfo = {
         enhanced_parameters: {
           total_count: Object.keys(leadData).length,
           user_data_count: ['email', 'phone', 'name', 'city', 'state', 'zipCode', 'country', 'client_ip', 'user_agent'].filter(key => leadDataObj[key]).length,
           custom_data_count: ['quantity', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'industry', 'company_size', 'job_title', 'interest_level', 'budget_range', 'timeline'].filter(key => leadDataObj[key]).length,
           form_data_count: ['form_name', 'form_page', 'form_step', 'completion_time'].filter(key => leadDataObj[key]).length,
           meta_data_count: ['url', 'referrer', 'timestamp'].filter(key => leadDataObj[key]).length,
         },
         expected_enrichments: {
           lead_value: 'calculated from quantity',
           lead_type: 'determined from quantity',
           device_data: 'collected automatically',
           session_data: 'tracked automatically',
           geographic_data: 'enhanced from location',
           customer_segmentation: 'assigned based on profile',
         },
         platform_specific_parameters: {
           meta: {
             hashed_user_data: 'SHA-256 hashed fields',
             advanced_matching: 'multiple identifiers',
             custom_data: 'comprehensive business intelligence',
             device_context: 'technical specifications',
           },
           google: {
             measurement_protocol: 'GA4 format',
             client_id: 'unique identifier',
             custom_dimensions: 'business metrics',
             user_properties: 'behavioral data',
           },
           tiktok: {
             events_api: 'TikTok format',
             context_data: 'page and user context',
             custom_properties: 'business intelligence',
           },
           snapchat: {
             conversions_api: 'Snapchat format',
             hashed_identifiers: 'privacy compliant',
             custom_data: 'conversion details',
           },
         },
       };
     }

    // Standard logging for all requests
    console.log('📊 Enhanced tracking results:', {
      event_id: result.event_id,
      success_count: result.success_count,
      failure_count: result.failure_count,
      total_platforms: result.total_platforms,
      platform_results: result.results.map(r => ({
        platform: r.platform,
        success: r.success,
        error: r.error,
      })),
    });

         // Return success response with detailed results
     const response: Record<string, unknown> = {
       success: true,
       event_id: result.event_id,
       tracking_results: {
         total_platforms: result.total_platforms,
         successful_platforms: result.success_count,
         failed_platforms: result.failure_count,
         platform_details: result.results.map(r => ({
           platform: r.platform,
           success: r.success,
           error: r.error,
         })),
       },
       timestamp: result.timestamp,
     };

     // Add debug info if in debug mode
     if (isDebugMode) {
       response.debug_info = debugInfo;
     }

     return NextResponse.json(response);

  } catch (error) {
    console.error('Enhanced tracking API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Enhanced tracking failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const trackingService = EnhancedTrackingService.getInstance();
    const config = trackingService.getConfig();
    
    return NextResponse.json({
      status: 'healthy',
      service: 'enhanced-tracking',
      enabled_platforms: Object.entries(config.platforms)
        .filter(([, platformConfig]) => platformConfig.enabled)
        .map(([platform]) => platform),
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
} 