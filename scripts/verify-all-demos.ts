import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

interface DemoTest {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
}

const results: DemoTest[] = [];

function pass(name: string, message: string, details?: any) {
  results.push({ name, status: 'PASS', message, details });
  console.log(`✅ ${name}: ${message}`);
}

function fail(name: string, message: string, details?: any) {
  results.push({ name, status: 'FAIL', message, details });
  console.log(`❌ ${name}: ${message}`);
}

function warn(name: string, message: string, details?: any) {
  results.push({ name, status: 'WARN', message, details });
  console.log(`⚠️  ${name}: ${message}`);
}

// Define expected demos
const EXPECTED_DEMOS = [
  {
    name: 'Ransomware Response',
    fileName: 'DemoLiveActivation',
    route: '/demo/live-activation',
    stakeholderCount: 30,
    impact: '$283K',
    audience: 'CISO, CIO, CTO',
    coordinationTime: '11:47',
    icon: '🔒'
  },
  {
    name: 'M&A Integration',
    fileName: 'DemoMaIntegration',
    route: '/demo/ma-integration',
    stakeholderCount: 45,
    impact: '$4.7M',
    audience: 'CEO, CFO, Board',
    coordinationTime: '11:47',
    icon: '🤝'
  },
  {
    name: 'Product Launch',
    fileName: 'DemoProductLaunch',
    route: '/demo/product-launch',
    stakeholderCount: 50,
    impact: '$10.6M',
    audience: 'CEO, CMO, CPO',
    coordinationTime: '11:47',
    icon: '🚀'
  },
  {
    name: 'Supplier Crisis',
    fileName: 'DemoSupplierCrisis',
    route: '/demo/supplier-crisis',
    stakeholderCount: 35,
    impact: '$160M',
    audience: 'COO, CPO, Supply Chain',
    coordinationTime: '11:47',
    icon: '⚠️'
  },
  {
    name: 'Competitive Response',
    fileName: 'DemoCompetitiveResponse',
    route: '/demo/competitive-response',
    stakeholderCount: 28,
    impact: '$302M',
    audience: 'CEO, CMO, Strategy',
    coordinationTime: '11:47',
    icon: '⚔️'
  },
  {
    name: 'Regulatory Crisis',
    fileName: 'DemoRegulatoryCrisis',
    route: '/demo/regulatory-crisis',
    stakeholderCount: 32,
    impact: '$300M',
    audience: 'CEO, Legal, Compliance',
    coordinationTime: '11:47',
    icon: '⚖️'
  },
  {
    name: 'Customer Crisis',
    fileName: 'DemoCustomerCrisis',
    route: '/demo/customer-crisis',
    stakeholderCount: 24,
    impact: '$120M',
    audience: 'CEO, CRO, Customer Success',
    coordinationTime: '11:47',
    icon: '🚨'
  }
];

async function verifyAllDemos() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           VEXOR DEMO PORTFOLIO VERIFICATION                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('\n📁 PART 1: DEMO COMPONENT FILES\n');
  console.log('─'.repeat(70));
  
  const srcDir = 'client';
  
  if (!existsSync(resolve(process.cwd(), srcDir))) {
    fail('Setup', 'No source directory found');
    return;
  }
  
  pass('Setup', `Source directory found: /${srcDir}`);
  
  // Check each demo component
  for (const demo of EXPECTED_DEMOS) {
    let found = false;
    let foundPath = '';
    
    const possiblePaths = [
      join(srcDir, 'src/pages', demo.fileName + '.tsx'),
    ];
    
    for (const path of possiblePaths) {
      const fullPath = resolve(process.cwd(), path);
      if (existsSync(fullPath)) {
        found = true;
        foundPath = path;
        break;
      }
    }
    
    if (found) {
      pass(`File: ${demo.name}`, `Found at ${foundPath}`);
      
      const content = readFileSync(resolve(process.cwd(), foundPath), 'utf-8');
      
      const hasTodo = content.includes('TODO') || content.includes('FIXME') || content.includes('PLACEHOLDER');
      if (hasTodo) {
        warn(`Content: ${demo.name}`, 'Contains TODO/FIXME/PLACEHOLDER comments');
      } else {
        pass(`Content: ${demo.name}`, 'No placeholder comments');
      }
      
      const hasStakeholders = content.includes('stakeholder') || content.includes('Stakeholder');
      const hasTimer = content.includes('timer') || content.includes('Timer') || content.includes('elapsed');
      const hasMetrics = content.includes('metrics') || content.includes('Metrics') || content.includes('coordination');
      const hasConfetti = content.includes('confetti') || content.includes('Confetti');
      
      if (hasStakeholders && hasTimer && hasMetrics) {
        pass(`Structure: ${demo.name}`, 'Contains core demo elements');
      } else {
        const missing = [];
        if (!hasStakeholders) missing.push('stakeholders');
        if (!hasTimer) missing.push('timer');
        if (!hasMetrics) missing.push('metrics');
        fail(`Structure: ${demo.name}`, `Missing: ${missing.join(', ')}`);
      }
      
      if (hasConfetti) {
        pass(`Animation: ${demo.name}`, 'Includes celebration/confetti');
      } else {
        warn(`Animation: ${demo.name}`, 'May be missing celebration animation');
      }
      
      const hasSpecificData = content.includes(demo.stakeholderCount.toString());
      
      if (hasSpecificData) {
        pass(`Data: ${demo.name}`, 'Contains demo-specific stakeholder count');
      } else {
        warn(`Data: ${demo.name}`, `Expected ${demo.stakeholderCount} stakeholders`);
      }
      
    } else {
      fail(`File: ${demo.name}`, `Component file not found`);
    }
  }

  console.log('\n🛣️  PART 2: ROUTING CONFIGURATION\n');
  console.log('─'.repeat(70));
  
  const routingFile = join(srcDir, 'src/App.tsx');
  
  let routingContent = '';
  
  const fullPath = resolve(process.cwd(), routingFile);
  if (existsSync(fullPath)) {
    routingContent = readFileSync(fullPath, 'utf-8');
    pass('Routing', `Found routing file: ${routingFile}`);
    
    for (const demo of EXPECTED_DEMOS) {
      const hasRoute = routingContent.includes(demo.route);
      
      if (hasRoute) {
        pass(`Route: ${demo.name}`, `${demo.route} registered`);
      } else {
        fail(`Route: ${demo.name}`, `${demo.route} NOT registered`);
      }
    }
  } else {
    warn('Routing', 'No routing file found');
  }

  console.log('\n🎯 PART 3: DEMO SELECTOR PAGE\n');
  console.log('─'.repeat(70));
  
  const selectorPath = join(srcDir, 'src/pages/DemoSelector.tsx');
  
  const selectorFullPath = resolve(process.cwd(), selectorPath);
  if (existsSync(selectorFullPath)) {
    const selectorContent = readFileSync(selectorFullPath, 'utf-8');
    pass('Demo Selector', `Found at ${selectorPath}`);
    
    let demosListed = 0;
    for (const demo of EXPECTED_DEMOS) {
      if (selectorContent.includes(demo.name) || selectorContent.includes(demo.route)) {
        demosListed++;
      }
    }
    
    if (demosListed === 7) {
      pass('Demo Selector', 'All 7 demos listed');
    } else {
      warn('Demo Selector', `Only ${demosListed}/7 demos listed`);
    }
    
  } else {
    warn('Demo Selector', 'No demo selector page found');
  }

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                        SUMMARY                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const total = results.length;
  
  console.log(`✅ Passed:   ${passCount}/${total}`);
  console.log(`❌ Failed:   ${failCount}/${total}`);
  console.log(`⚠️  Warnings: ${warnCount}/${total}`);
  console.log(`📊 Success Rate: ${((passCount / total) * 100).toFixed(1)}%\n`);
  
  console.log('📋 Demo-by-Demo Status:\n');
  
  for (const demo of EXPECTED_DEMOS) {
    const demoResults = results.filter(r => r.name.includes(demo.name));
    const demoPasses = demoResults.filter(r => r.status === 'PASS').length;
    const demoFails = demoResults.filter(r => r.status === 'FAIL').length;
    
    const emoji = demoFails > 0 ? '❌' : demoPasses >= 3 ? '✅' : '⚠️';
    console.log(`${emoji} ${demo.name}: ${demoPasses} checks passed, ${demoFails} failed`);
  }
}

verifyAllDemos().catch(error => {
  console.error('\n❌ VERIFICATION FAILED:\n');
  console.error(error);
  process.exit(1);
});
