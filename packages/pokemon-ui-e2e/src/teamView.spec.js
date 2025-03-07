import { test, expect } from '@playwright/test';

test('View Loads', async ({ page }) => {
  await page.goto('/team/red');
  const title = await page.title();
  expect(title).toBe('PokemonUi');
});

test('should have a greeting', async ({ page }) => {
  await page.goto('/team/red');
  const greetingLocator = page.getByTestId('greeting');
  await expect(greetingLocator).toHaveText(/Team Selection/gi);
});

test.only('should have a back button', async ({ page }) => {
  await page.goto('/team/red');
  const backLocator = page.getByTestId('back-button');
  await backLocator.click();
  expect(page.url()).not.toContain('/team/red');
});

test('should show selectable pokemon', async ({ page }) => {
  await page.goto('/team/red');
  const bulbasaur = page.getByTestId('pokemon-1');
  await bulbasaur.click();
  //To-do have something assertable happen after selecting a pokemon
  expect(page.url()).toContain('/team/red');
});