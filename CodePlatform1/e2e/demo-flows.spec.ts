import { test, expect } from '@playwright/test';

test.describe('Demo Flows - Critical Business Paths', () => {
  
  test('Executive Demo presentation flows work correctly', async ({ page }) => {
    // Navigate to Executive Demo
    await page.goto('/executive-demo');
    
    // Verify page loads with correct branding
    await expect(page).toHaveTitle(/Phronex|Executive Demo/);
    await expect(page.getByText('Executive Demo Presentation')).toBeVisible();
    
    // Test demo controls are present and functional
    await expect(page.getByTestId('button-play')).toBeVisible();
    await expect(page.getByTestId('button-pause')).toBeVisible();
    await expect(page.getByTestId('button-skip-forward')).toBeVisible();
    await expect(page.getByTestId('button-skip-back')).toBeVisible();
    
    // Verify demo steps are displayed
    await expect(page.getByText('Strategic Signal Detection')).toBeVisible();
    await expect(page.getByText('AI competitor breakthrough detected')).toBeVisible();
    
    // Test progress indicators work
    const progressBars = page.locator('[role="progressbar"]');
    await expect(progressBars.first()).toBeVisible();
    
    // Verify metrics are displayed with realistic values
    await expect(page.getByText('847%')).toBeVisible(); // Competitor AI Patents
    await expect(page.getByText('312%')).toBeVisible(); // Customer AI Inquiries
    
    // Test demo navigation
    await page.getByTestId('button-play').click();
    
    // Verify demo progresses (wait for content to appear)
    await expect(page.getByText('Automated Trigger Activation')).toBeVisible({ timeout: 5000 });
    
    // Test demo phases are accessible
    const detectionTab = page.getByText('Detection');
    const planningTab = page.getByText('Planning');
    const responseTab = page.getByText('Response');
    
    await expect(detectionTab).toBeVisible();
    await expect(planningTab).toBeVisible();  
    await expect(responseTab).toBeVisible();
    
    // Click through demo phases
    await planningTab.click();
    await expect(page.getByText('Strategic Response Planning')).toBeVisible();
    
    await responseTab.click();
    await expect(page.getByText('Crisis Response Execution')).toBeVisible();
  });

  test('AI Intelligence Demo showcases all modules correctly', async ({ page }) => {
    // Navigate to AI Intelligence Demo
    await page.goto('/demo/ai-intelligence');
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/AI Intelligence|Demo/);
    await expect(page.getByText('AI Intelligence Suite Demo')).toBeVisible();
    
    // Verify all AI modules are displayed
    await expect(page.getByText('Pulse Intelligence')).toBeVisible();
    await expect(page.getByText('Flux Adaptations')).toBeVisible();
    await expect(page.getByText('Prism Insights')).toBeVisible();
    await expect(page.getByText('Echo Cultural Analytics')).toBeVisible();
    await expect(page.getByText('Nova Innovations')).toBeVisible();
    
    // Test demo scenario buttons
    const supplyChainBtn = page.getByText('Supply Chain Disruption');
    const marketOpportunityBtn = page.getByText('Market Opportunity');
    const orgChangeBtn = page.getByText('Organizational Change');
    
    await expect(supplyChainBtn).toBeVisible();
    await expect(marketOpportunityBtn).toBeVisible();
    await expect(orgChangeBtn).toBeVisible();
    
    // Test running a demo scenario
    await supplyChainBtn.click();
    
    // Verify analysis starts
    await expect(page.getByText('Analyzing scenario...')).toBeVisible();
    
    // Wait for analysis to complete - use explicit wait for results
    await expect(page.getByText(/confidence/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Immediate action required/i)).toBeVisible();
    await expect(page.getByText(/stakeholders/i)).toBeVisible();
    
    // Verify recommendations are shown
    await expect(page.getByText('Activate crisis response protocols')).toBeVisible();
    await expect(page.getByText('Notify C-suite and board')).toBeVisible();
    
    // Test custom scenario input
    const customInput = page.getByTestId('input-custom-scenario');
    await expect(customInput).toBeVisible();
    
    await customInput.fill('Major cybersecurity breach affecting customer data');
    await page.getByTestId('button-analyze-custom').click();
    
    // Verify custom analysis runs
    await expect(page.getByText('Analyzing scenario...')).toBeVisible();
    
    // Verify custom analysis results - wait for completion
    await expect(page.getByText(/confidence/i)).toBeVisible({ timeout: 10000 });
  });

  test('Organization management displays realistic demo data', async ({ page }) => {
    // Navigate to organizations page
    await page.goto('/organizations');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Organizations|Phronex/);
    
    // Verify realistic organizations are displayed
    await expect(page.getByText('TechFlow Dynamics')).toBeVisible();
    await expect(page.getByText('Meridian Manufacturing')).toBeVisible();
    await expect(page.getByText('Catalyst Financial Group')).toBeVisible();
    
    // Verify realistic industry data
    await expect(page.getByText('Software & Technology')).toBeVisible();
    await expect(page.getByText('Manufacturing')).toBeVisible();
    await expect(page.getByText('Financial Services')).toBeVisible();
    
    // Verify realistic employee counts
    await expect(page.getByText('8,500')).toBeVisible(); // TechFlow Dynamics
    await expect(page.getByText('12,000')).toBeVisible(); // Meridian Manufacturing
    await expect(page.getByText('3,200')).toBeVisible(); // Catalyst Financial Group
    
    // Verify headquarters locations
    await expect(page.getByText('San Francisco')).toBeVisible();
    await expect(page.getByText('Detroit')).toBeVisible();
    await expect(page.getByText('Charlotte')).toBeVisible();
    
    // Test organization interaction
    const techFlowCard = page.locator('[data-testid*="card-organization"]').filter({ hasText: 'TechFlow Dynamics' });
    await expect(techFlowCard).toBeVisible();
    
    // Click on organization to view details
    await techFlowCard.click();
    
    // Verify organization details are shown
    await expect(page.getByText('Software & Technology')).toBeVisible();
    await expect(page.getByText('8,500 employees')).toBeVisible();
  });

  test('Home page loads and navigation works correctly', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Verify Phronex Kairosync branding
    await expect(page.getByText('Phronex')).toBeVisible();
    await expect(page.getByText('Kairosync')).toBeVisible();
    
    // Verify main navigation is present
    await expect(page.getByTestId('nav-strategic-planning')).toBeVisible();
    await expect(page.getByTestId('nav-strategic-scenarios')).toBeVisible();
    await expect(page.getByTestId('nav-organizations')).toBeVisible();
    
    // Test navigation to demo pages
    const executiveDemo = page.getByText('Executive Demo');
    if (await executiveDemo.isVisible()) {
      await executiveDemo.click();
      await expect(page).toHaveURL(/executive-demo/);
      await expect(page.getByText('Executive Demo Presentation')).toBeVisible();
    }
    
    // Navigate back and test AI Intelligence demo
    await page.goto('/');
    const aiDemo = page.getByText('AI Intelligence');
    if (await aiDemo.isVisible()) {
      await aiDemo.click();
      await expect(page.getByText('Pulse Intelligence')).toBeVisible();
    }
  });

  test('Strategic scenarios display realistic business data', async ({ page }) => {
    // Navigate to scenarios page
    await page.goto('/scenarios');
    
    // Verify page loads
    await expect(page.getByText(/Strategic Scenarios|Scenarios/)).toBeVisible();
    
    // Verify realistic scenario titles are displayed
    await expect(page.getByText('AI-Powered Customer Service Transformation')).toBeVisible();
    await expect(page.getByText('Supply Chain Resilience Initiative')).toBeVisible();
    await expect(page.getByText('Cybersecurity Infrastructure Overhaul')).toBeVisible();
    
    // Verify scenario categories
    await expect(page.getByText('Technology Integration')).toBeVisible();
    await expect(page.getByText('Operational Excellence')).toBeVisible();
    await expect(page.getByText('Risk Management')).toBeVisible();
    
    // Verify confidence scores and timelines
    await expect(page.getByText(/85%/)).toBeVisible();
    await expect(page.getByText(/6-12 months/)).toBeVisible();
    await expect(page.getByText(/High priority/)).toBeVisible();
    
    // Test scenario interaction
    const firstScenario = page.locator('[data-testid*="card-scenario"]').first();
    await expect(firstScenario).toBeVisible();
    
    // Click on scenario to view details
    await firstScenario.click();
    
    // Verify scenario details load
    await expect(page.getByText(/Description|Overview/)).toBeVisible();
    await expect(page.getByText(/Timeline|Duration/)).toBeVisible();
    await expect(page.getByText(/Priority|Confidence/)).toBeVisible();
  });
});