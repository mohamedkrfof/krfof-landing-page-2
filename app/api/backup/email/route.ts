import { NextRequest, NextResponse } from 'next/server';

interface EmailBackupData {
  name: string;
  email: string;
  phone?: string;
  quantity?: string;
  company?: string;
  message?: string;
  backup_type: string;
  timestamp?: string;
  utm_source?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: EmailBackupData = await request.json();
    console.log('📧 Sending email backup for lead:', data.email);

    // Create email content
    const emailSubject = `🚨 Lead Backup: ${data.name} - ${data.email}`;
    const emailContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>Lead Backup - ${data.name}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #1976d2; }
        .value { margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Lead Backup Alert</h1>
            <p>طلب جديد من العميل المحتمل</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">اسم العميل / Customer Name:</div>
                <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
                <div class="label">البريد الإلكتروني / Email:</div>
                <div class="value">${data.email}</div>
            </div>
            
            <div class="field">
                <div class="label">رقم الهاتف / Phone:</div>
                <div class="value">${data.phone || 'غير محدد'}</div>
            </div>
            
            <div class="field">
                <div class="label">الكمية المطلوبة / Quantity:</div>
                <div class="value">${data.quantity || 'غير محدد'}</div>
            </div>
            
            <div class="field">
                <div class="label">الشركة / Company:</div>
                <div class="value">${data.company || 'غير محدد'}</div>
            </div>
            
            <div class="field">
                <div class="label">الرسالة / Message:</div>
                <div class="value">${data.message || 'لا توجد رسالة'}</div>
            </div>
            
            <div class="field">
                <div class="label">مصدر الطلب / Source:</div>
                <div class="value">${data.utm_source || 'website'}</div>
            </div>
            
            <div class="field">
                <div class="label">تاريخ الطلب / Timestamp:</div>
                <div class="value">${data.timestamp || new Date().toISOString()}</div>
            </div>
            
            <div class="field">
                <div class="label">نوع النسخ الاحتياطي / Backup Type:</div>
                <div class="value">${data.backup_type}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>شركة خبراء الرفوف المحدودة</p>
            <p>نظام النسخ الاحتياطي للعملاء المحتملين</p>
        </div>
    </div>
</body>
</html>
    `;

    // Email configuration (you can modify this based on your email service)
    const emailData = {
      to: 'mohamed@madaratalkon.com', // Replace with your admin email
      subject: emailSubject,
      html: emailContent,
      from: 'leads-backup@krfof-leadmagnet.vercel.app',
      
      // Lead data as JSON for processing
      lead_data: JSON.stringify(data),
      backup_timestamp: new Date().toISOString(),
    };

    // Option 1: Send via Zapier email webhook (if available)
    if (process.env.ZAPIER_EMAIL_WEBHOOK_URL) {
      try {
        const zapierEmailResponse = await fetch(process.env.ZAPIER_EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });

        if (zapierEmailResponse.ok) {
          console.log('✅ Email backup sent via Zapier');
          return NextResponse.json({
            success: true,
            method: 'zapier_email',
            message: 'Email backup sent successfully via Zapier',
          });
        }
      } catch (error) {
        console.warn('⚠️ Zapier email failed, trying alternative method');
      }
    }

    // Option 2: Send via SendGrid, Mailgun, or other service
    // You can add your preferred email service here
    
    // Option 3: Log email content (for debugging)
    console.log('📧 Email Backup Content (logged):', {
      subject: emailSubject,
      to: emailData.to,
      lead_name: data.name,
      lead_email: data.email,
      timestamp: emailData.backup_timestamp,
    });

    return NextResponse.json({
      success: true,
      method: 'logged',
      message: 'Email backup logged successfully (configure email service for actual sending)',
      backup_data: {
        subject: emailSubject,
        recipient: emailData.to,
        timestamp: emailData.backup_timestamp,
      },
    });

  } catch (error) {
    console.error('❌ Email backup error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email backup error',
      },
      { status: 500 }
    );
  }
} 