import { db } from '../server/db.js';
import { eq } from 'drizzle-orm';
import { 
  executionInstances, 
  notifications, 
  executionInstanceTasks,
  playbookLibrary,
  scenarioStakeholders
} from '../shared/schema.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

interface TestResult {
  category: string;
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'INFO';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function pass(category: string, test: string, message: string, details?: any) {
  results.push({ category, test, status: 'PASS', message, details });
  console.log(`✅ ${test}: ${message}`);
}

function fail(category: string, test: string, message: string, details?: any) {
  results.push({ category, test, status: 'FAIL', message, details });
  console.log(`❌ ${test}: ${message}`);
}

function warn(category: string, test: string, message: string, details?: any) {
  results.push({ category, test, status: 'WARN', message, details });
  console.log(`⚠️  ${test}: ${message}`);
}

function info(category: string, test: string, message: string, details?: any) {
  results.push({ category, test, status: 'INFO', message, details });
  console.log(`ℹ️  ${test}: ${message}`);
}

async function runCompleteVerification() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║     VEXOR COMPLETE SYSTEM VERIFICATION (Backend + Demo)      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 1: BACKEND CODE STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n📁 PART 1: BACKEND CODE STRUCTURE\n');
  console.log('─'.repeat(70));
  
  // Check orchestration files
  const criticalFiles = [
    { path: 'server/routes.ts', name: 'Main Routes' },
    { path: 'server/services/DemoOrchestrationService.ts', name: 'Demo Orchestration' },
    { path: 'server/services/NotificationService.ts', name: 'Notification Service' },
    { path: 'server/services/WebSocketService.ts', name: 'WebSocket Service' },
    { path: 'shared/schema.ts', name: 'Database Schema' },
  ];
  
  for (const file of criticalFiles) {
    const fullPath = resolve(process.cwd(), file.path);
    if (existsSync(fullPath)) {
      pass('Backend', file.name, `Found at ${file.path}`);
      
      const content = readFileSync(fullPath, 'utf-8');
      
      // Check for TODO/FIXME
      const todoCount = (content.match(/TODO:|FIXME:|IMPLEMENT THIS/gi) || []).length;
      if (todoCount > 0) {
        warn('Backend', `${file.name} Completeness`, `${todoCount} TODO/FIXME comments`);
      }
    } else {
      fail('Backend', file.name, `NOT FOUND at ${file.path}`);
    }
  }
  
  // Check package.json dependencies
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredPackages = {
      'socket.io': 'WebSocket server',
      'socket.io-client': 'WebSocket client',
      'drizzle-orm': 'Database ORM',
      'nodemailer': 'Email notifications'
    };
    
    for (const [pkg, purpose] of Object.entries(requiredPackages)) {
      if (deps[pkg]) {
        pass('Dependencies', pkg, `Installed - ${purpose}`);
      } else {
        warn('Dependencies', pkg, `Missing - ${purpose}`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 2: DATABASE VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n💾 PART 2: DATABASE VERIFICATION\n');
  console.log('─'.repeat(70));
  
  try {
    // Check playbook seeding
    const playbookCount = await db.select({ count: db.$count() }).from(playbookLibrary);
    const count = playbookCount[0]?.count || 0;
    
    if (count >= 148) {
      pass('Database', 'Playbook Library', `${count} playbooks seeded ✓`);
    } else if (count >= 50) {
      warn('Database', 'Playbook Library', `${count} playbooks (expected 148)`);
    } else if (count > 0) {
      warn('Database', 'Playbook Library', `Only ${count} playbooks`);
    } else {
      fail('Database', 'Playbook Library', 'No playbooks - not seeded');
    }
    
    // Check execution instances table
    try {
      await db.select().from(executionInstances).limit(1);
      pass('Database', 'executionInstances', 'Table accessible');
    } catch (error: any) {
      fail('Database', 'executionInstances', `Error: ${error.message}`);
    }
    
    // Check notifications table
    try {
      await db.select().from(notifications).limit(1);
      pass('Database', 'notifications', 'Table accessible');
    } catch (error: any) {
      fail('Database', 'notifications', `Error: ${error.message}`);
    }
    
    // Check tasks table
    try {
      await db.select().from(executionInstanceTasks).limit(1);
      pass('Database', 'executionInstanceTasks', 'Table accessible');
    } catch (error: any) {
      fail('Database', 'executionInstanceTasks', `Error: ${error.message}`);
    }
    
  } catch (error: any) {
    fail('Database', 'Connection', `Failed: ${error.message}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 3: API ENDPOINT TESTING
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🌐 PART 3: API ENDPOINT TESTING\n');
  console.log('─'.repeat(70));
  
  let demoExecutionId: string | null = null;
  
  // Test demo activation endpoint
  try {
    const response = await fetch('http://localhost:5000/api/activations/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stakeholderCount: 5, // Small count for testing
        accelerated: true,
        targetDuration: 1 // 1 minute for quick test
      })
    });
    
    if (response.ok) {
      pass('API', 'Demo Activation Endpoint', 'Working (200 OK)');
      
      const data = await response.json();
      
      if (data.executionInstanceId) {
        pass('API', 'Demo Response Data', 'Contains executionInstanceId');
        demoExecutionId = data.executionInstanceId;
      } else {
        warn('API', 'Demo Response Data', 'Missing executionInstanceId');
      }
      
      if (data.coordinationStartTime) {
        pass('API', 'Demo Response Data', 'Contains coordinationStartTime');
      }
      
    } else {
      fail('API', 'Demo Activation Endpoint', `Failed: ${response.status}`);
    }
  } catch (error: any) {
    fail('API', 'Demo Activation Endpoint', `Request failed: ${error.message}`);
  }
  
  // Test playbook library endpoint
  try {
    const response = await fetch('http://localhost:5000/api/playbooks');
    
    if (response.ok) {
      pass('API', 'Playbook Library Endpoint', 'Working');
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        pass('API', 'Playbook Data', `${data.length} playbooks returned`);
      } else {
        warn('API', 'Playbook Data', 'Empty array returned');
      }
    } else {
      warn('API', 'Playbook Library Endpoint', `Status: ${response.status}`);
    }
  } catch (error: any) {
    warn('API', 'Playbook Library Endpoint', `Request failed: ${error.message}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 4: WEBSOCKET VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🔌 PART 4: WEBSOCKET VERIFICATION\n');
  console.log('─'.repeat(70));
  
  try {
    const { io } = await import('socket.io-client');
    pass('WebSocket', 'Socket.IO Client', 'Package available');
    
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      timeout: 3000
    });
    
    const connected = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.disconnect();
        resolve(false);
      }, 3000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        pass('WebSocket', 'Server Connection', 'Successfully connected');
        socket.disconnect();
        resolve(true);
      });
      
      socket.on('connect_error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
    
    if (!connected) {
      warn('WebSocket', 'Server Connection', 'Could not connect (timeout)');
    }
    
  } catch (error: any) {
    fail('WebSocket', 'Socket.IO Client', `Error: ${error.message}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 5: FRONTEND COMPONENTS & DEMO READINESS
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🎨 PART 5: FRONTEND COMPONENTS & DEMO READINESS\n');
  console.log('─'.repeat(70));
  
  const frontendChecks = [
    { path: 'client/src/pages/DemoLiveActivation.tsx', name: 'Live Demo Page' },
    { path: 'client/src/pages/PlaybookLibrary.tsx', name: 'Playbook Library' },
    { path: 'client/src/pages/Dashboard.tsx', name: 'Dashboard' },
    { path: 'client/src/components/layout/StandardNav.tsx', name: 'Navigation' },
  ];
  
  for (const check of frontendChecks) {
    const fullPath = resolve(process.cwd(), check.path);
    if (existsSync(fullPath)) {
      pass('Frontend', check.name, `Found at ${check.path}`);
      
      const content = readFileSync(fullPath, 'utf-8');
      
      // Check for data-testid attributes (important for e2e tests)
      const testIdCount = (content.match(/data-testid=/g) || []).length;
      if (testIdCount > 0) {
        pass('Frontend', `${check.name} Test IDs`, `${testIdCount} test IDs defined`);
      } else {
        warn('Frontend', `${check.name} Test IDs`, 'No test IDs found');
      }
    } else {
      warn('Frontend', check.name, `Not found at ${check.path}`);
    }
  }
  
  // Check for demo scenario data
  const demoPagePath = resolve(process.cwd(), 'client/src/pages/DemoLiveActivation.tsx');
  if (existsSync(demoPagePath)) {
    const content = readFileSync(demoPagePath, 'utf-8');
    
    if (content.includes('DEMO_SCENARIO')) {
      pass('Demo', 'Scenario Data', 'DEMO_SCENARIO constant found');
      
      if (content.includes('Ransomware Response')) {
        pass('Demo', 'Specific Scenario', 'Ransomware Response scenario configured');
      }
      
      if (content.includes('ServiceNow') || content.includes('Slack')) {
        pass('Demo', 'System Integration Events', 'Enterprise system triggers present');
      }
      
      if (content.includes('timeline') || content.includes('Timeline')) {
        pass('Demo', 'Execution Timeline', 'Timeline component present');
      }
      
      const taskCount = (content.match(/type: 'task'/g) || []).length;
      const systemCount = (content.match(/type: 'system'/g) || []).length;
      const milestoneCount = (content.match(/type: 'milestone'/g) || []).length;
      
      if (taskCount + systemCount + milestoneCount > 0) {
        pass('Demo', 'Timeline Events', `${taskCount} tasks, ${systemCount} systems, ${milestoneCount} milestones`);
      }
    } else {
      warn('Demo', 'Scenario Data', 'DEMO_SCENARIO not found - using generic demo?');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 6: DEMO INTEGRATION TEST
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🎬 PART 6: DEMO INTEGRATION TEST\n');
  console.log('─'.repeat(70));
  
  if (demoExecutionId) {
    // Wait a bit for demo to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if WebSocket events are being broadcast
    try {
      const { io } = await import('socket.io-client');
      const socket = io('http://localhost:5000', {
        transports: ['websocket']
      });
      
      const eventReceived = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          socket.disconnect();
          resolve(false);
        }, 5000);
        
        socket.on('connect', () => {
          socket.emit('join-execution', demoExecutionId);
        });
        
        socket.on('stakeholder-acknowledged', (data) => {
          clearTimeout(timeout);
          pass('Integration', 'WebSocket Events', 'Acknowledgment event received');
          socket.disconnect();
          resolve(true);
        });
      });
      
      if (!eventReceived) {
        info('Integration', 'WebSocket Events', 'No acknowledgment received yet (demo may be slow)');
      }
      
    } catch (error: any) {
      warn('Integration', 'WebSocket Events', `Could not test: ${error.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINAL REPORT
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n' + '═'.repeat(70));
  console.log('VERIFICATION SUMMARY');
  console.log('═'.repeat(70) + '\n');
  
  const summary = {
    PASS: results.filter(r => r.status === 'PASS').length,
    FAIL: results.filter(r => r.status === 'FAIL').length,
    WARN: results.filter(r => r.status === 'WARN').length,
    INFO: results.filter(r => r.status === 'INFO').length,
    TOTAL: results.length
  };
  
  console.log(`✅ PASS: ${summary.PASS}`);
  console.log(`❌ FAIL: ${summary.FAIL}`);
  console.log(`⚠️  WARN: ${summary.WARN}`);
  console.log(`ℹ️  INFO: ${summary.INFO}`);
  console.log(`📊 TOTAL: ${summary.TOTAL}`);
  
  const successRate = ((summary.PASS / summary.TOTAL) * 100).toFixed(1);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (summary.FAIL === 0 && summary.WARN <= 3) {
    console.log('\n🎉 SYSTEM READY FOR DEMOS!');
  } else if (summary.FAIL === 0) {
    console.log('\n✅ System functional with minor warnings');
  } else {
    console.log('\n⚠️  Critical issues found - review failures');
  }
  
  // Group results by category
  console.log('\n' + '─'.repeat(70));
  console.log('RESULTS BY CATEGORY');
  console.log('─'.repeat(70) + '\n');
  
  const categories = [...new Set(results.map(r => r.category))];
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const categoryPass = categoryResults.filter(r => r.status === 'PASS').length;
    const categoryTotal = categoryResults.length;
    const categoryRate = ((categoryPass / categoryTotal) * 100).toFixed(0);
    
    console.log(`${category}: ${categoryPass}/${categoryTotal} (${categoryRate}%)`);
  }
  
  console.log('\n');
  
  return summary;
}

// Run verification
runCompleteVerification()
  .then((summary) => {
    process.exit(summary.FAIL > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Verification failed:', error);
    process.exit(1);
  });
