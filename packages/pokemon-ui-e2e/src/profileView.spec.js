import { test, expect } from '@playwright/test';

test('View Loads', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBe('PokemonUi');
});

test('should have a greeting as the title', async ({ page }) => {
  await page.goto('/');
  const title = await page.textContent('h1');
  expect(title).toMatch(/Welcome pokemon-ui/gi);
});