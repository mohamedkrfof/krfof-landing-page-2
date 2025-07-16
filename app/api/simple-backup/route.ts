import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Simple backup: just log everything and try Zapier
    const timestamp = new Date().toISOString();
    const backupId = `backup_${Date.now()}`;
    
    console.log('🛡️ SIMPLE BACKUP SYSTEM');
    console.log('📋 Backup ID:', backupId);
    console.log('📋 Lead Data:', JSON.stringify(data, null, 2));
    console.log('📋 Timestamp:', timestamp);
    
    // Try Zapier webhook (working one)
    let zapierSuccess = false;
    try {
      const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/23446220/uoz8ssr/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          backup_id: backupId,
          backup_timestamp: timestamp,
        }),
      });
      
      zapierSuccess = zapierResponse.ok;
      console.log(zapierSuccess ? '✅ Zapier backup successful' : '⚠️ Zapier backup failed');
    } catch (error) {
      console.warn('⚠️ Zapier backup error:', error);
    }
    
    return NextResponse.json({
      success: true,
      backup_id: backupId,
      timestamp: timestamp,
      zapier_success: zapierSuccess,
      message: 'Backup completed - check console logs',
    });
    
  } catch (error) {
    console.error('❌ Simple backup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Backup failed',
      timestamp: new Date().toISOString(),
    });
  }
} 