import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should render successfully', async ({ page }) => {
    await page.goto('/');
    const baseElement = await page.$('body');
    expect(baseElement).toBeTruthy();
  });
});