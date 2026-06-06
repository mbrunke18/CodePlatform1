import { type Page, expect } from '@playwright/test';
import { getStableBodyText } from '../helpers/shared';

export class RequestAccessPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/request-access');
    await this.page.waitForLoadState('load');
  }

  async getBodyText(): Promise<string> {
    return getStableBodyText(this.page);
  }

  async submitButton() {
    return this.page.locator('[data-testid="request-access-submit"]');
  }

  async isSubmitVisible(): Promise<boolean> {
    const btn = await this.submitButton();
    return btn.isVisible();
  }

  async assertFoundingPartnerLanguage(): Promise<void> {
    const bodyText = await this.getBodyText();
    const hasLanguage =
      /founding partner|executive access|request executive access|access request|request access/i.test(bodyText);
    expect(hasLanguage, 'Founding Partner language must be present on /request-access').toBe(true);
  }

  async assertNoRetiredPilotLanguage(): Promise<void> {
    const bodyText = await this.getBodyText();
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
    expect(bodyText).not.toContain('Now in Pilot');
  }
}
