import { db } from '../server/db.js';
import { notifications } from '../shared/schema.js';
import { notificationService } from '../server/services/NotificationService.js';

async function testEmail() {
  console.log('📧 Testing VEXOR Email Delivery System...\n');
  
  // Step 1: Check environment variables
  console.log('🔍 Step 1: Checking environment configuration...');
  const hasSmtpConfig = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasSlackConfig = !!process.env.SLACK_WEBHOOK_URL;
  
  console.log('   Environment Status:');
  console.log(`   - SMTP_HOST: ${process.env.SMTP_HOST || '❌ NOT SET'}`);
  console.log(`   - SMTP_USER: ${process.env.SMTP_USER || '❌ NOT SET'}`);
  console.log(`   - SMTP_PASS: ${process.env.SMTP_PASS ? '✅ SET (****)' : '❌ NOT SET'}`);
  console.log(`   - SMTP_FROM: ${process.env.SMTP_FROM || 'VEXOR <alerts@vexor.ai> (default)'}`);
  console.log(`   - SLACK_WEBHOOK_URL: ${hasSlackConfig ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`   - APP_URL: ${process.env.APP_URL || 'http://localhost:5000'}\n`);
  
  if (!hasSmtpConfig && !hasSlackConfig) {
    console.log('⚠️  Warning: No delivery channels configured!');
    console.log('   Email and Slack delivery will be simulated (logged to console).\n');
  }
  
  // Step 2: Create test notification
  console.log('📝 Step 2: Creating test notification in database...');
  
  const testNotification = await db.insert(notifications).values({
    organizationId: '00000000-0000-0000-0000-000000000000', // Default org for testing
    userId: '7cd941d8-5c5f-461e-87ea-9d2b1d81cb59',
    type: 'playbook_activated',
    title: 'TEST: VEXOR Email Delivery',
    message: 'This is a test email from VEXOR. If you receive this, email delivery is working correctly!',
    priority: 'medium',
    entityType: 'test',
    entityId: '00000000-0000-0000-0000-000000000001',
    metadata: {
      test: true,
      timestamp: new Date().toISOString(),
      purpose: 'Email delivery verification',
      recipientEmail: process.env.TEST_EMAIL || process.env.SMTP_USER || 'test@example.com'
    }
  }).returning();
  
  const recipientEmail = (testNotification[0].metadata as any)?.recipientEmail || 'test@example.com';
  
  console.log(`✅ Test notification created:`);
  console.log(`   ID: ${testNotification[0].id}`);
  console.log(`   Recipient: ${recipientEmail}`);
  console.log(`   Title: ${testNotification[0].title}\n`);
  
  // Step 3: Attempt delivery
  console.log('📤 Step 3: Attempting notification delivery...');
  console.log('   (This will use configured channels: email, Slack, or console)\n');
  
  try {
    const result = await notificationService.deliverNotification(testNotification[0].id);
    
    console.log('═══════════════════════════════════════════════════════════');
    
    if (result.success) {
      console.log('✅ DELIVERY SUCCESSFUL!\n');
      console.log('   Delivery Results:');
      result.results.forEach((channelResult: any) => {
        if (channelResult.success) {
          console.log(`   ✅ ${channelResult.channel.toUpperCase()}: Delivered successfully`);
        } else {
          console.log(`   ❌ ${channelResult.channel.toUpperCase()}: ${channelResult.error}`);
        }
      });
      
      if (hasSmtpConfig) {
        console.log('\n📬 Check your inbox for the test email!');
        console.log(`   Recipient: ${recipientEmail}`);
      }
      
      if (hasSlackConfig) {
        console.log('\n💬 Check your Slack channel for the test message!');
      }
      
      if (!hasSmtpConfig && !hasSlackConfig) {
        console.log('\n💡 To enable real delivery:');
        console.log('   1. Add SMTP credentials to your Secrets');
        console.log('   2. Or add SLACK_WEBHOOK_URL for Slack delivery');
        console.log('   3. Run this test again');
      }
    } else {
      console.log('❌ DELIVERY FAILED\n');
      console.log('   Delivery Results:');
      result.results.forEach((channelResult: any) => {
        console.log(`   ${channelResult.success ? '✅' : '❌'} ${channelResult.channel.toUpperCase()}: ${channelResult.error || 'OK'}`);
      });
      
      console.log('\n💡 Troubleshooting:');
      if (!hasSmtpConfig) {
        console.log('   - Add SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS)');
      }
      console.log('   - Check that email address is valid');
      console.log('   - For Gmail, use an App Password (not regular password)');
      console.log('   - Check SMTP server allows connections from Replit');
    }
    
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Step 4: Verify database update
    console.log('💾 Step 4: Verifying database record...');
    const updatedNotification = await db.query.notifications.findFirst({
      where: (notifications, { eq }) => eq(notifications.id, testNotification[0].id)
    });
    
    if (updatedNotification?.sentAt) {
      console.log('✅ Notification marked as sent in database');
      console.log(`   Sent at: ${updatedNotification.sentAt}`);
    } else {
      console.log('⚠️  Notification not marked as sent (expected if all channels failed)');
    }
    
  } catch (error: any) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('❌ ERROR DURING DELIVERY\n');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    console.log('\n💡 Common Issues:');
    console.log('   1. SMTP credentials not set or incorrect');
    console.log('   2. Gmail App Password not generated (regular password won\'t work)');
    console.log('   3. SMTP server blocking connections');
    console.log('   4. Network/firewall issues');
    console.log('═══════════════════════════════════════════════════════════\n');
  }
  
  // Final summary
  console.log('✨ Test Complete!\n');
  console.log('Summary:');
  console.log(`- Test notification ID: ${testNotification[0].id}`);
  console.log(`- Recipient: ${recipientEmail}`);
  console.log(`- SMTP configured: ${hasSmtpConfig ? 'Yes' : 'No'}`);
  console.log(`- Slack configured: ${hasSlackConfig ? 'Yes' : 'No'}`);
  
  if (!hasSmtpConfig && !hasSlackConfig) {
    console.log('\n📝 To enable real email delivery, add these to your Secrets:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASS=your-app-password (generate at https://myaccount.google.com/apppasswords)');
    console.log('   SMTP_FROM=VEXOR <alerts@vexor.ai>');
  }
}

// Run the test
testEmail()
  .catch((error) => {
    console.error('\n❌ Fatal error:');
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
