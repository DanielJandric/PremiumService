import { test, expect } from '@playwright/test';

test('templates preview renders a PDF', async ({ page }) => {
  await page.goto('/templates');
  await page.getByRole('button', { name: 'Aperçu PDF' }).click();
  const iframe = page.locator('iframe');
  await expect(iframe).toBeVisible();
});

