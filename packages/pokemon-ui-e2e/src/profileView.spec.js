import { test, expect } from '@playwright/test';

test('View Loads', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBe('PokemonUi');
});

test('should have a greeting as the title', async ({ page }) => {
  await page.goto('/');
  const greetingLocator = page.getByTestId('greeting');
  await expect(greetingLocator).toHaveText(/Profile Selection/gi);
});

test('should navigate to the team view when a profile is selected', async ({ page }) => {
  await page.goto('/');

  // Click the red profile button
  const redProfile = page.getByTestId('profile-button-red');
  await redProfile.click();
  expect(page.url()).toContain('/team/red');

  // Navigate back to the profile selection view
  await page.goBack();

  // Click the blue profile button
  const blueProfile = page.getByTestId('profile-button-blue');
  await blueProfile.click();
  expect(page.url()).toContain('/team/blue');
});