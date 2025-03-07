const { test, expect } = require('@playwright/test');

test('View Loads', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const title = await page.title();
  expect(title).toBe('Andrew Post Interview - Profile View');
});