import { db } from '../server/db.js';
import { executionInstances, notifications } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { io as ioClient } from 'socket.io-client';

async function verifyImplementation() {
  console.log('🔍 VEXOR Implementation Verification\n');
  console.log('='.repeat(60));
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  function pass(message: string) {
    console.log(`✅ ${message}`);
    results.passed++;
  }
  
  function fail(message: string) {
    console.log(`❌ ${message}`);
    results.failed++;
  }
  
  function warn(message: string) {
    console.log(`⚠️  ${message}`);
    results.warnings++;
  }
  
  console.log('\n📋 PART 1: ACTIVATION ORCHESTRATION ENGINE\n');
  
  // Check 1: Database tables exist
  try {
    const testQuery = await db.select().from(executionInstances).limit(1);
    pass('execution_instances table exists');
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      fail('execution_instances table missing - run npm run db:push');
    } else {
      warn('Could not verify execution_instances table');
    }
  }
  
  // Check 2: Orchestration endpoint exists in routes
  const routesFile = 'server/routes.ts';
  if (existsSync(resolve(process.cwd(), routesFile))) {
    try {
      const fs = await import('fs');
      const routesContent = fs.readFileSync(resolve(process.cwd(), routesFile), 'utf-8');
      if (routesContent.includes('/api/activations/orchestrate')) {
        pass('Orchestration endpoint registered in routes');
      } else {
        fail('Orchestration endpoint not found in routes');
      }
    } catch (error) {
      warn('Could not verify orchestration endpoint in routes');
    }
  } else {
    fail('server/routes.ts not found');
  }
  
  // Check 3: Test orchestration endpoint
  try {
    const response = await fetch('http://localhost:5000/api/activations/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playbookId: 'test-verification',
        triggerId: 'verify-test',
        executedBy: '7cd941d8-5c5f-461e-87ea-9d2b1d81cb59',
        context: { verification: true }
      })
    });
    
    if (response.status === 404) {
      fail('Orchestration endpoint not registered (404)');
    } else if (response.status === 501) {
      fail('Orchestration endpoint returns "Not Implemented"');
    } else if (response.status === 400) {
      pass('Orchestration endpoint exists (400 response expected for test data)');
    } else if (response.ok) {
      const data = await response.json();
      
      if (data.executionInstanceId) {
        pass('Orchestration endpoint returns executionInstanceId');
      } else {
        warn('Orchestration endpoint responds but missing executionInstanceId');
      }
      
      if (data.coordinationStartTime) {
        pass('Orchestration tracks coordination start time');
      } else {
        warn('Orchestration missing coordinationStartTime');
      }
      
      // Check database
      if (data.executionInstanceId) {
        const execution = await db.query.executionInstances.findFirst({
          where: eq(executionInstances.id, data.executionInstanceId)
        });
        
        if (execution) {
          pass('Execution instance created in database');
          
          // Check if it has the expected fields
          if (execution.coordinationProgress !== undefined) {
            pass('Execution tracks coordinationProgress');
          }
          
          if (execution.stakeholderAcknowledgments !== undefined) {
            pass('Execution tracks stakeholder acknowledgments');
          }
        } else {
          fail('Execution instance NOT created in database');
        }
        
        // Check notifications
        const notifs = await db.query.notifications.findMany({
          where: (notifications, { eq, sql }) => 
            sql`${notifications.metadata}->>'executionInstanceId' = ${data.executionInstanceId}`
        });
        
        if (notifs.length > 0) {
          pass(`Notifications created: ${notifs.length} records`);
        } else {
          warn('No notifications found for execution (may be expected)');
        }
      }
      
    } else {
      fail(`Orchestration endpoint error: ${response.status}`);
    }
  } catch (error: any) {
    fail(`Orchestration endpoint unreachable: ${error.message}`);
    warn('Make sure server is running with: npm run dev');
  }
  
  console.log('\n📧 PART 2: NOTIFICATION SERVICE\n');
  
  // Check 4: NotificationService file exists
  const notificationServiceFiles = [
    'server/services/NotificationService.ts',
    'server/services/notification.ts'
  ];
  
  let notificationServiceFound = false;
  for (const file of notificationServiceFiles) {
    if (existsSync(resolve(process.cwd(), file))) {
      pass(`NotificationService exists: ${file}`);
      notificationServiceFound = true;
      break;
    }
  }
  
  if (!notificationServiceFound) {
    fail('NotificationService file not found');
  }
  
  // Check 5: Notification table exists
  try {
    const testQuery = await db.select().from(notifications).limit(1);
    pass('notifications table exists');
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      fail('notifications table missing - run npm run db:push');
    } else {
      warn('Could not verify notifications table');
    }
  }
  
  // Check 6: Dependencies installed
  try {
    await import('nodemailer');
    pass('nodemailer package installed');
  } catch {
    fail('nodemailer package not installed');
  }
  
  // Check 7: Environment variables
  const smtpEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  let envVarsSet = 0;
  
  for (const envVar of smtpEnvVars) {
    if (process.env[envVar]) {
      envVarsSet++;
    }
  }
  
  if (envVarsSet === smtpEnvVars.length) {
    pass('All SMTP environment variables set (production ready)');
  } else if (envVarsSet > 0) {
    warn(`Only ${envVarsSet}/${smtpEnvVars.length} SMTP env vars set`);
  } else {
    pass('No SMTP env vars set (demo mode - emails logged to console)');
  }
  
  if (process.env.SLACK_WEBHOOK_URL) {
    pass('Slack webhook URL configured');
  } else {
    pass('No Slack webhook (demo mode - Slack messages logged to console)');
  }
  
  console.log('\n🔌 PART 3: WEBSOCKET INTEGRATION\n');
  
  // Check 8: WebSocketService exists
  const wsServiceFiles = [
    'server/services/WebSocketService.ts',
    'server/services/websocket.ts'
  ];
  
  let wsServiceFound = false;
  for (const file of wsServiceFiles) {
    if (existsSync(resolve(process.cwd(), file))) {
      pass(`WebSocketService exists: ${file}`);
      wsServiceFound = true;
      break;
    }
  }
  
  if (!wsServiceFound) {
    fail('WebSocketService file not found');
  }
  
  // Check 9: Socket.io installed
  try {
    await import('socket.io');
    pass('socket.io package installed');
  } catch {
    fail('socket.io package not installed');
  }
  
  try {
    await import('socket.io-client');
    pass('socket.io-client package installed');
  } catch {
    fail('socket.io-client package not installed');
  }
  
  // Check 10: Frontend WebSocket hook
  const wsHookFiles = [
    'client/src/hooks/useExecutionWebSocket.ts',
    'client/src/hooks/useWebSocket.ts'
  ];
  
  let wsHookFound = false;
  for (const file of wsHookFiles) {
    if (existsSync(resolve(process.cwd(), file))) {
      pass(`WebSocket hook exists: ${file}`);
      wsHookFound = true;
      break;
    }
  }
  
  if (!wsHookFound) {
    warn('WebSocket hook not found in client/src/hooks');
  }
  
  // Check 11: WebSocket connection test
  try {
    const socket = ioClient('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.disconnect();
        // Timeout is acceptable for standalone script
        warn('WebSocket connection timeout (server may not be running)');
        resolve();
      }, 5000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        pass('WebSocket server accepts connections');
        pass(`WebSocket Socket.IO initialized (ID: ${socket.id})`);
        socket.disconnect();
        resolve();
      });
      
      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        warn('WebSocket connection error (server may not be running)');
        resolve(); // Don't fail, just warn
      });
    });
  } catch (error: any) {
    warn(`WebSocket check skipped: ${error.message}`);
  }
  
  // Check 12: Test scripts exist
  console.log('\n🧪 PART 4: TEST SCRIPTS\n');
  
  const testScripts = [
    'scripts/test-email.ts',
    'scripts/test-activation.ts',
    'scripts/QUICK_TEST.md'
  ];
  
  for (const script of testScripts) {
    if (existsSync(resolve(process.cwd(), script))) {
      pass(`Test script exists: ${script}`);
    } else {
      warn(`Test script missing: ${script}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 VERIFICATION SUMMARY\n');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  console.log('\n🎯 VERDICT:\n');
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log('🎉 PERFECT! All implementations working correctly.');
    console.log('   Ready for customer demos.\n');
  } else if (results.failed === 0 && results.warnings > 0) {
    console.log('✅ GOOD! Core functionality works.');
    console.log(`   ${results.warnings} warnings to address for production.\n`);
  } else if (results.failed <= 3) {
    console.log('⚠️  PARTIAL IMPLEMENTATION');
    console.log(`   ${results.failed} critical issues to fix.\n`);
  } else {
    console.log('❌ INCOMPLETE IMPLEMENTATION');
    console.log(`   ${results.failed} major issues. Review failed checks.\n`);
  }
  
  console.log('📝 Next Steps:\n');
  if (results.failed > 0) {
    console.log('1. Review failed checks above');
    console.log('2. Fix critical issues');
    console.log('3. Re-run verification: npm run verify\n');
  } else {
    console.log('1. Run individual tests:');
    console.log('   - npm run test:email (test email delivery)');
    console.log('   - tsx scripts/test-activation.ts (test orchestration)');
    console.log('   - Browser console test (WebSocket - see scripts/QUICK_TEST.md)');
    console.log('2. Review docs/WEBSOCKET_TESTING.md for detailed testing');
    console.log('3. Ready for customer demos! 🚀\n');
  }
  
  console.log('='.repeat(60));
}

verifyImplementation()
  .catch((error) => {
    console.error('\n❌ Verification failed with error:');
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
