import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();
    console.log('🛡️ Creating lead backup for:', leadData.email);

    const backupResults = [];
    const timestamp = new Date().toISOString();

    // 1. Primary Zapier Backup (Multiple webhooks for redundancy)
    const zapierWebhooks = [
      'https://hooks.zapier.com/hooks/catch/23446220/uoz8ssr/', // Working webhook
      'https://hooks.zapier.com/hooks/catch/19651289/2a1vdak/', // Backup webhook
    ];

    for (let i = 0; i < zapierWebhooks.length; i++) {
      try {
        const webhook = zapierWebhooks[i];
        const zapierResponse = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadData,
            backup_source: 'api_backup',
            backup_timestamp: timestamp,
            webhook_index: i + 1,
          }),
        });

        if (zapierResponse.ok) {
          backupResults.push({ 
            method: 'zapier', 
            webhook: webhook.substring(webhook.lastIndexOf('/') + 1), 
            status: 'success' 
          });
          console.log(`✅ Zapier backup ${i + 1} successful`);
          break; // Success, no need to try other webhooks
        } else {
          console.warn(`⚠️ Zapier webhook ${i + 1} failed:`, zapierResponse.status);
          backupResults.push({ 
            method: 'zapier', 
            webhook: webhook.substring(webhook.lastIndexOf('/') + 1), 
            status: 'failed',
            error: zapierResponse.status 
          });
        }
      } catch (error) {
        console.error(`❌ Zapier webhook ${i + 1} error:`, error);
        backupResults.push({ 
          method: 'zapier', 
          webhook: `webhook_${i + 1}`, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // 2. Local Log Backup (Always works)
    try {
      const logEntry = {
        timestamp,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        quantity: leadData.quantity,
        company: leadData.company,
        message: leadData.message,
        source: leadData.source || 'website',
        utm_source: leadData.utm_source,
        utm_medium: leadData.utm_medium,
        utm_campaign: leadData.utm_campaign,
        url: leadData.url,
        referrer: leadData.referrer,
        backup_id: `backup_${Date.now()}`,
      };

      console.log('📋 LEAD BACKUP LOG:', JSON.stringify(logEntry, null, 2));
      backupResults.push({ method: 'log', status: 'success', backup_id: logEntry.backup_id });
    } catch (error) {
      backupResults.push({ 
        method: 'log', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 3. Email Alert (Simple notification)
    try {
      const emailAlert = {
        to: 'mohamed@madaratalkon.com',
        subject: `🚨 New Lead: ${leadData.name}`,
        content: `New lead received: ${leadData.name} (${leadData.email}) - Quantity: ${leadData.quantity}`,
        timestamp,
      };

      console.log('📧 EMAIL ALERT:', emailAlert);
      backupResults.push({ method: 'email_alert', status: 'logged' });
    } catch (error) {
      backupResults.push({ 
        method: 'email_alert', 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Summary
    const successful = backupResults.filter(r => r.status === 'success' || r.status === 'logged').length;
    const total = backupResults.length;

    return NextResponse.json({
      success: true,
      message: `Lead backed up successfully (${successful}/${total} methods)`,
      backup_results: backupResults,
      summary: {
        total_methods: total,
        successful_backups: successful,
        backup_timestamp: timestamp,
      },
      lead_id: `lead_${Date.now()}`,
    });

  } catch (error) {
    console.error('❌ Lead backup system error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown backup error',
      },
      { status: 500 }
    );
  }
} 