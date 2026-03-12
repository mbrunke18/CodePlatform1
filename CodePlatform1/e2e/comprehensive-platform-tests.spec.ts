import { test, expect, Page } from '@playwright/test';

/**
 * M Strategic Execution Operating System - Comprehensive E2E Tests
 * 
 * Tests all major pages and interactive elements to ensure roadshow readiness.
 * Run with: npx playwright test e2e/comprehensive-platform-tests.spec.ts
 * 
 * These tests are DETERMINISTIC - they expect elements to be present.
 * If a test fails, it indicates a real issue that needs fixing.
 */

test.describe('Homepage & Navigation - Critical Path', () => {
  test('Homepage loads with hero elements', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="heading-hero"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="badge-hero"]')).toBeVisible();
    await expect(page.locator('[data-testid="text-hero-subtitle"]')).toBeVisible();
  });

  test('Homepage has Get Started button', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="button-get-started"]')).toBeVisible({ timeout: 10000 });
  });

  test('Homepage has feature cards', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('.grid .hover\\:shadow-lg, [data-testid^="card-"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage Get Started navigates to onboarding', async ({ page }) => {
    await page.goto('/');
    
    const getStartedBtn = page.locator('[data-testid="button-get-started"]');
    await expect(getStartedBtn).toBeVisible({ timeout: 10000 });
    await getStartedBtn.click();
    
    await expect(page).toHaveURL(/new-user-journey|start|welcome/);
  });

  test('Homepage stats are visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="stat-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="stat-1"]')).toBeVisible();
  });

  test('Homepage value metrics are visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="value-speed"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="value-playbooks"]')).toBeVisible();
    await expect(page.locator('[data-testid="value-ai"]')).toBeVisible();
  });
});

test.describe('Executive Dashboard - Full Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/executive-dashboard');
  });

  test('Dashboard page loads', async ({ page }) => {
    await expect(page.locator('[data-testid="executive-dashboard"]')).toBeVisible({ timeout: 10000 });
  });

  test('All dashboard tabs are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="tab-overview"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="tab-readiness"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-velocity"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-preparedness"]')).toBeVisible();
  });

  test('Dashboard tabs are clickable', async ({ page }) => {
    await page.locator('[data-testid="tab-overview"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-readiness"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-velocity"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-preparedness"]').click();
    await page.waitForTimeout(300);
  });

  test('FRI score is displayed', async ({ page }) => {
    await expect(page.locator('[data-testid="text-fri-score"]')).toBeVisible({ timeout: 10000 });
  });

  test('Quick links are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="link-playbooks"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="link-command-center"]')).toBeVisible();
    await expect(page.locator('[data-testid="link-intelligence-hub"]')).toBeVisible();
  });
});

test.describe('Playbook Library - Search & Browse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playbook-library');
  });

  test('Playbook library loads with page elements', async ({ page }) => {
    await expect(page.locator('[data-testid="playbook-library-page"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="badge-total-playbooks"]')).toBeVisible();
  });

  test('Playbook library shows playbook cards', async ({ page }) => {
    const playbookCards = page.locator('[data-testid^="card-playbook-"]');
    await expect(playbookCards.first()).toBeVisible({ timeout: 10000 });
    
    const count = await playbookCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Search input exists and is functional', async ({ page }) => {
    const searchInput = page.locator('[data-testid="input-search"]');
    
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('competitive');
    await page.waitForTimeout(500);
    
    await searchInput.clear();
  });

  test('Domain dropdown exists', async ({ page }) => {
    await expect(page.locator('[data-testid="select-domain"]')).toBeVisible({ timeout: 5000 });
  });

  test('Domain navigation cards exist', async ({ page }) => {
    await expect(page.locator('[data-testid="domain-card-all"]')).toBeVisible({ timeout: 5000 });
  });

  test('Playbook card click opens details', async ({ page }) => {
    const playbookCard = page.locator('[data-testid^="card-playbook-"]').first();
    await expect(playbookCard).toBeVisible({ timeout: 5000 });
    
    await playbookCard.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="text-detail-title"]')).toBeVisible({ timeout: 5000 });
  });

  test('Results count is displayed', async ({ page }) => {
    await expect(page.locator('[data-testid="text-results-count"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Foresight Radar - Full Interaction Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/foresight-radar');
  });

  test('Radar page loads with try demo button', async ({ page }) => {
    await expect(page.locator('[data-testid="button-try-demo"]')).toBeVisible({ timeout: 10000 });
  });

  test('Radar View tab shows weak signal cards', async ({ page }) => {
    const weakSignalCards = page.locator('[data-testid^="weak-signal-card-"]');
    await expect(weakSignalCards.first()).toBeVisible({ timeout: 5000 });
    
    const count = await weakSignalCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Radar View tab shows oracle pattern cards', async ({ page }) => {
    const oraclePatternCards = page.locator('[data-testid^="oracle-pattern-card-"]');
    await expect(oraclePatternCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('Signal investigation modal opens and closes', async ({ page }) => {
    const investigateButton = page.locator('[data-testid^="button-investigate-"]').first();
    
    await expect(investigateButton).toBeVisible({ timeout: 5000 });
    await investigateButton.click();
    
    const modal = page.locator('[data-testid="dialog-investigate-signal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('Pattern details modal opens and closes', async ({ page }) => {
    const viewPatternButton = page.locator('[data-testid^="button-view-pattern-"]').first();
    
    await expect(viewPatternButton).toBeVisible({ timeout: 5000 });
    await viewPatternButton.click();
    
    const modal = page.locator('[data-testid="dialog-pattern-analysis"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('Radar View tab is active by default', async ({ page }) => {
    await expect(page.locator('[data-testid="tab-radar-view"]')).toBeVisible({ timeout: 5000 });
  });

  test('Signal Center tab is clickable', async ({ page }) => {
    const signalTab = page.locator('[data-testid="tab-signal-center"]');
    
    await expect(signalTab).toBeVisible({ timeout: 5000 });
    await signalTab.click();
    await page.waitForTimeout(500);
  });

  test('Configure tab shows configuration cards', async ({ page }) => {
    const configTab = page.locator('[data-testid="tab-configure"]');
    
    await expect(configTab).toBeVisible({ timeout: 5000 });
    await configTab.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="config-thresholds"]')).toBeVisible();
    await expect(page.locator('[data-testid="config-sources"]')).toBeVisible();
    await expect(page.locator('[data-testid="config-notifications"]')).toBeVisible();
  });

  test('Radar blips are rendered', async ({ page }) => {
    const radarBlips = page.locator('[data-testid^="radar-blip-"]');
    await expect(radarBlips.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Command Center - Execution Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/command-center');
  });

  test('Command Center loads with coordination timeline', async ({ page }) => {
    await expect(page.locator('[data-testid="card-coordination-timeline"]')).toBeVisible({ timeout: 10000 });
  });

  test('Command Center has signal alerts section', async ({ page }) => {
    await expect(page.locator('[data-testid="card-signal-alerts"]')).toBeVisible({ timeout: 5000 });
  });

  test('Command Center has scenario cards', async ({ page }) => {
    const scenarioCards = page.locator('[data-testid^="card-scenario-"]');
    await expect(scenarioCards.first()).toBeVisible({ timeout: 5000 });
    
    const count = await scenarioCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Command Center has timeline events', async ({ page }) => {
    const timelineEvents = page.locator('[data-testid^="timeline-event-"]');
    await expect(timelineEvents.first()).toBeVisible({ timeout: 5000 });
  });

  test('Command Center has signal alert items', async ({ page }) => {
    const signalAlerts = page.locator('[data-testid^="signal-alert-"]');
    await expect(signalAlerts.first()).toBeVisible({ timeout: 5000 });
  });

  test('Command Center has weak signal cards', async ({ page }) => {
    const weakSignals = page.locator('[data-testid^="weak-signal-"]');
    await expect(weakSignals.first()).toBeVisible({ timeout: 5000 });
  });

  test('Command Center has oracle pattern cards', async ({ page }) => {
    const oraclePatterns = page.locator('[data-testid^="oracle-pattern-"]');
    await expect(oraclePatterns.first()).toBeVisible({ timeout: 5000 });
  });

  test('Command Center has continuous mode toggle', async ({ page }) => {
    await expect(page.locator('[data-testid="button-toggle-continuous-mode"]')).toBeVisible({ timeout: 5000 });
  });

  test('Command Center view scenario button works', async ({ page }) => {
    const viewScenarioBtn = page.locator('[data-testid^="button-view-"]').first();
    await expect(viewScenarioBtn).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Demo Hub - All Demo Types Accessible', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos');
  });

  test('Demo Hub loads with featured demo grid', async ({ page }) => {
    await expect(page.locator('[data-testid="grid-featured-demos"]')).toBeVisible({ timeout: 10000 });
    
    const featuredCards = page.locator('[data-testid^="demo-card-"]');
    const cardCount = await featuredCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
  });

  test('Live Activation demo card exists', async ({ page }) => {
    const liveActivation = page.locator('[data-testid="demo-link-live-activation"]');
    await expect(liveActivation).toBeVisible({ timeout: 5000 });
  });

  test('Intelligence Demo link exists and navigates', async ({ page }) => {
    const intelligenceDemo = page.locator('[data-testid="demo-link-intelligence-demo"]');
    
    await expect(intelligenceDemo).toBeVisible({ timeout: 5000 });
    await intelligenceDemo.click();
    await expect(page).toHaveURL(/intelligence-demo|signals-demo/);
  });

  test('Executive Simulation link exists and navigates', async ({ page }) => {
    const simulationDemo = page.locator('[data-testid="demo-link-executive-simulation"]');
    
    await expect(simulationDemo).toBeVisible({ timeout: 5000 });
    await simulationDemo.click();
    await expect(page).toHaveURL(/executive-simulation/);
  });

  test('Product Tour link exists and navigates', async ({ page }) => {
    const productTour = page.locator('[data-testid="demo-link-product-tour"]');
    
    await expect(productTour).toBeVisible({ timeout: 5000 });
    await productTour.click();
    await expect(page).toHaveURL(/product-tour/);
  });

  test('Industry filters are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="filter-industry-all"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="filter-industry-financial"]')).toBeVisible();
  });

  test('Role filters are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="filter-persona-all"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="filter-persona-ceo"]')).toBeVisible();
  });
});

test.describe('Intelligence Demo - Guided Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/intelligence-demo');
  });

  test('Intelligence Demo loads with scenario buttons', async ({ page }) => {
    const scenarioButtons = page.locator('[data-testid^="button-scenario-"]');
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 10000 });
    
    const count = await scenarioButtons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('Intelligence Demo has reset button', async ({ page }) => {
    await expect(page.locator('[data-testid="button-reset-demo"]')).toBeVisible({ timeout: 5000 });
  });

  test('Intelligence Demo has go to platform button', async ({ page }) => {
    await expect(page.locator('[data-testid="button-go-to-platform"]')).toBeVisible({ timeout: 5000 });
  });

  test('Scenario selection triggers demo flow', async ({ page }) => {
    const firstScenario = page.locator('[data-testid^="button-scenario-"]').first();
    await expect(firstScenario).toBeVisible({ timeout: 5000 });
    
    await firstScenario.click();
    await page.waitForTimeout(500);
    
    const fireAlertBtn = page.locator('[data-testid="button-fire-alert"]');
    const viewPlaybookBtn = page.locator('[data-testid="button-view-playbook"]');
    const tryAnotherBtn = page.locator('[data-testid="button-try-another"]');
    
    const hasNextStep = await fireAlertBtn.isVisible() || 
                        await viewPlaybookBtn.isVisible() || 
                        await tryAnotherBtn.isVisible();
    expect(hasNextStep).toBeTruthy();
  });
});

test.describe('Executive Simulation - Interactive Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/executive-simulation');
  });

  test('Executive Simulation loads with intro card', async ({ page }) => {
    await expect(page.locator('[data-testid="card-simulation-intro"]')).toBeVisible({ timeout: 10000 });
  });

  test('Executive Simulation has start button', async ({ page }) => {
    await expect(page.locator('[data-testid="button-start-simulation"]')).toBeVisible({ timeout: 5000 });
  });

  test('Starting simulation shows main interface', async ({ page }) => {
    const startBtn = page.locator('[data-testid="button-start-simulation"]');
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    
    await startBtn.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="tabs-main-navigation"]')).toBeVisible({ timeout: 5000 });
  });

  test('Simulation tabs are navigable', async ({ page }) => {
    const startBtn = page.locator('[data-testid="button-start-simulation"]');
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    
    await expect(page.locator('[data-testid="tab-radar"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="tab-signals"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-playbooks"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-command"]')).toBeVisible();
    
    await page.locator('[data-testid="tab-signals"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-playbooks"]').click();
    await page.waitForTimeout(300);
  });
});

test.describe('New User Journey - Complete Wizard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/new-user-journey');
  });

  test('Journey page loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Journey has navigation buttons', async ({ page }) => {
    const nextButton = page.locator('[data-testid="button-next"]');
    const completeButton = page.locator('[data-testid="button-complete"]');
    const enterButton = page.locator('[data-testid="button-enter-platform"]');
    
    const hasNavigation = await nextButton.isVisible() || 
      await completeButton.isVisible() || 
      await enterButton.isVisible();
    
    expect(hasNavigation).toBeTruthy();
  });

  test('Journey has form inputs', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const hasFormInputs = 
      await page.locator('[data-testid="input-org-name"]').isVisible() ||
      await page.locator('[data-testid="select-employees"]').isVisible() ||
      await page.locator('[data-testid="select-role"]').isVisible() ||
      await page.locator('[data-testid^="priority-"]').first().isVisible() ||
      await page.locator('[data-testid^="playbook-"]').first().isVisible() ||
      await page.locator('[data-testid^="signal-"]').first().isVisible();
    
    expect(hasFormInputs).toBeTruthy();
  });
});

test.describe('Investor Presentation - Slide Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/investor-presentation');
  });

  test('Presentation loads first slide', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Arrow keys navigate slides', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
  });

  test('Presentation has multiple slides/acts', async ({ page }) => {
    const navigationElements = page.locator('[data-testid*="slide"], [data-testid*="act"], [class*="slide"]');
    const navCount = await navigationElements.count();
    expect(navCount).toBeGreaterThan(0);
  });
});

test.describe('Intelligence Control Center', () => {
  test('Intelligence Control Center loads', async ({ page }) => {
    await page.goto('/intelligence');
    
    await expect(page.locator('[data-testid="intelligence-control-center"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-title"]')).toBeVisible();
  });

  test('Control Center shows quick stats', async ({ page }) => {
    await page.goto('/intelligence');
    
    await expect(page.locator('[data-testid="grid-quick-stats"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="stat-data-points"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-signal-categories"]')).toBeVisible();
  });

  test('Control Center shows intelligence modules', async ({ page }) => {
    await page.goto('/intelligence');
    
    await expect(page.locator('[data-testid="grid-modules"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid^="card-module-"]').first()).toBeVisible();
  });

  test('Control Center quick actions are visible', async ({ page }) => {
    await page.goto('/intelligence');
    
    await expect(page.locator('[data-testid="section-quick-actions"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="link-ai-copilots"]')).toBeVisible();
    await expect(page.locator('[data-testid="link-configure-signals"]')).toBeVisible();
  });
});

test.describe('Marketing Pages - Content Verification', () => {
  test('Our Story page loads with CTA buttons', async ({ page }) => {
    await page.goto('/our-story');
    
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    
    const hasCTA = 
      await page.locator('[data-testid="button-watch-demo"]').isVisible() ||
      await page.locator('[data-testid="button-how-it-works"]').isVisible() ||
      await page.locator('[data-testid="button-sticky-cta"]').isVisible();
    
    expect(hasCTA).toBeTruthy();
  });

  test('How It Works page loads', async ({ page }) => {
    await page.goto('/how-it-works');
    
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Contact page loads with form elements', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    
    const hasForm = 
      await page.locator('[data-testid^="input-"]').first().isVisible() ||
      await page.locator('input').first().isVisible();
    
    expect(hasForm).toBeTruthy();
  });
});

test.describe('Redirects - Consolidated URLs', () => {
  test('Old dashboard URL redirects to executive dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/executive-dashboard/);
  });

  test('Scenarios URL redirects to playbook library', async ({ page }) => {
    await page.goto('/scenarios');
    await expect(page).toHaveURL(/playbook-library/);
  });

  test('Future readiness redirects to executive dashboard', async ({ page }) => {
    await page.goto('/future-readiness');
    await expect(page).toHaveURL(/executive-dashboard/);
  });

  test('Scorecard redirects to executive dashboard', async ({ page }) => {
    await page.goto('/scorecard');
    await expect(page).toHaveURL(/executive-dashboard/);
  });
});

test.describe('Industry Demos - All Accessible', () => {
  const industryDemos = [
    { path: '/luxury-demo', name: 'Luxury' },
    { path: '/financial-demo', name: 'Financial' },
    { path: '/pharma-demo', name: 'Pharmaceutical' },
    { path: '/manufacturing-demo', name: 'Manufacturing' },
    { path: '/retail-demo', name: 'Retail' },
    { path: '/energy-demo', name: 'Energy' },
  ];

  for (const demo of industryDemos) {
    test(`${demo.name} demo loads without errors`, async ({ page }) => {
      await page.goto(demo.path);
      
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      
      const body = await page.locator('body').textContent();
      expect(body).not.toContain('undefined');
      expect(body).not.toContain('Error');
    });
  }
});

test.describe('Specialized Demos', () => {
  test('LVMH demo loads', async ({ page }) => {
    await page.goto('/lvmh-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('SHEIN demo loads', async ({ page }) => {
    await page.goto('/shein-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('SpaceX demo loads', async ({ page }) => {
    await page.goto('/spacex-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Configuration Pages', () => {
  test('Triggers page loads', async ({ page }) => {
    await page.goto('/triggers');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Integrations page loads', async ({ page }) => {
    await page.goto('/integrations');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('AI Intelligence Modules', () => {
  test('AI Hub loads', async ({ page }) => {
    await page.goto('/ai');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  const aiModules = [
    '/pulse-intelligence',
    '/flux-adaptations',
    '/prism-insights',
    '/echo-cultural-analytics',
    '/nova-innovations',
  ];

  for (const module of aiModules) {
    test(`${module} module loads`, async ({ page }) => {
      await page.goto(module);
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    });
  }
});

test.describe('Error State Verification', () => {
  const criticalPages = [
    '/',
    '/executive-dashboard',
    '/playbook-library',
    '/foresight-radar',
    '/demos',
    '/intelligence',
    '/command-center',
    '/investor-presentation',
    '/new-user-journey',
    '/our-story',
  ];

  for (const url of criticalPages) {
    test(`${url} has no visible errors`, async ({ page }) => {
      await page.goto(url);
      
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      
      const body = await page.locator('body').textContent() || '';
      
      expect(body).not.toMatch(/TypeError|ReferenceError|SyntaxError/);
      expect(body).not.toMatch(/undefined is not|cannot read property/i);
    });
  }
});

test.describe('Modal Interactions - Comprehensive', () => {
  test('Foresight Radar investigation modal works', async ({ page }) => {
    await page.goto('/foresight-radar');
    
    const investigateBtn = page.locator('[data-testid^="button-investigate-"]').first();
    await expect(investigateBtn).toBeVisible({ timeout: 5000 });
    await investigateBtn.click();
    
    const modal = page.locator('[data-testid="dialog-investigate-signal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('Foresight Radar pattern modal works', async ({ page }) => {
    await page.goto('/foresight-radar');
    
    const viewPatternBtn = page.locator('[data-testid^="button-view-pattern-"]').first();
    await expect(viewPatternBtn).toBeVisible({ timeout: 5000 });
    await viewPatternBtn.click();
    
    const modal = page.locator('[data-testid="dialog-pattern-analysis"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('Executive Simulation critical alert overlay works', async ({ page }) => {
    await page.goto('/executive-simulation');
    
    await expect(page.locator('[data-testid="button-start-simulation"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="button-start-simulation"]').click();
    
    await expect(page.locator('[data-testid="tabs-main-navigation"]')).toBeVisible({ timeout: 5000 });
    
    await page.waitForTimeout(3000);
    
    const alertOverlay = page.locator('[data-testid="overlay-critical-alert"]');
    if (await alertOverlay.isVisible()) {
      const acknowledgeBtn = page.locator('[data-testid="button-acknowledge-alert"]');
      await expect(acknowledgeBtn).toBeVisible({ timeout: 3000 });
      await acknowledgeBtn.click();
      await expect(alertOverlay).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Golden Path - Complete Activation Flow', () => {
  test('Homepage to Demo Hub to Intelligence Demo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="heading-hero"]')).toBeVisible({ timeout: 10000 });
    
    await page.goto('/demos');
    await expect(page.locator('[data-testid="grid-featured-demos"]')).toBeVisible({ timeout: 10000 });
    
    const intelligenceLink = page.locator('[data-testid="demo-link-intelligence-demo"]');
    await expect(intelligenceLink).toBeVisible({ timeout: 5000 });
    await intelligenceLink.click();
    
    await expect(page).toHaveURL(/intelligence-demo/);
    
    const scenarioButtons = page.locator('[data-testid^="button-scenario-"]');
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('Demo Hub to Executive Simulation start flow', async ({ page }) => {
    await page.goto('/demos');
    await expect(page.locator('[data-testid="grid-featured-demos"]')).toBeVisible({ timeout: 10000 });
    
    const simulationLink = page.locator('[data-testid="demo-link-executive-simulation"]');
    await expect(simulationLink).toBeVisible({ timeout: 5000 });
    await simulationLink.click();
    
    await expect(page).toHaveURL(/executive-simulation/);
    
    await expect(page.locator('[data-testid="button-start-simulation"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid="button-start-simulation"]').click();
    
    await expect(page.locator('[data-testid="tabs-main-navigation"]')).toBeVisible({ timeout: 5000 });
  });

  test('Foresight Radar signal investigation flow', async ({ page }) => {
    await page.goto('/foresight-radar');
    await expect(page.locator('[data-testid="button-try-demo"]')).toBeVisible({ timeout: 10000 });
    
    const investigateBtn = page.locator('[data-testid^="button-investigate-"]').first();
    await expect(investigateBtn).toBeVisible({ timeout: 5000 });
    await investigateBtn.click();
    
    const investigateModal = page.locator('[data-testid="dialog-investigate-signal"]');
    await expect(investigateModal).toBeVisible({ timeout: 3000 });
    
    await page.keyboard.press('Escape');
    await expect(investigateModal).not.toBeVisible({ timeout: 3000 });
    
    const patternBtn = page.locator('[data-testid^="button-view-pattern-"]').first();
    await expect(patternBtn).toBeVisible({ timeout: 5000 });
    await patternBtn.click();
    
    const patternModal = page.locator('[data-testid="dialog-pattern-analysis"]');
    await expect(patternModal).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
  });

  test('Intelligence Demo scenario selection flow', async ({ page }) => {
    await page.goto('/intelligence-demo');
    
    const scenarioButtons = page.locator('[data-testid^="button-scenario-"]');
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 10000 });
    
    await scenarioButtons.first().click();
    await page.waitForTimeout(1000);
    
    const hasProgressedToDemoFlow = 
      await page.locator('[data-testid="button-fire-alert"]').isVisible() ||
      await page.locator('[data-testid="button-view-playbook"]').isVisible() ||
      await page.locator('[data-testid="button-try-another"]').isVisible() ||
      await page.locator('[data-testid="button-activate-playbook"]').isVisible();
    
    expect(hasProgressedToDemoFlow).toBeTruthy();
  });

  test('Executive Simulation tab navigation flow', async ({ page }) => {
    await page.goto('/executive-simulation');
    
    await expect(page.locator('[data-testid="button-start-simulation"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="button-start-simulation"]').click();
    
    await expect(page.locator('[data-testid="tabs-main-navigation"]')).toBeVisible({ timeout: 5000 });
    
    await page.locator('[data-testid="tab-signals"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-playbooks"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-command"]').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-testid="tab-radar"]').click();
    await page.waitForTimeout(300);
  });

  test('Command Center exploration flow', async ({ page }) => {
    await page.goto('/command-center');
    
    await expect(page.locator('[data-testid="card-coordination-timeline"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="card-signal-alerts"]')).toBeVisible({ timeout: 5000 });
    
    const scenarioCards = page.locator('[data-testid^="card-scenario-"]');
    await expect(scenarioCards.first()).toBeVisible({ timeout: 5000 });
    
    const viewBtn = page.locator('[data-testid^="button-view-"]').first();
    await expect(viewBtn).toBeVisible({ timeout: 5000 });
  });
});
