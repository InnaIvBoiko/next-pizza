import { test, expect } from '@playwright/test';

// Authenticated visual regression tests live in authenticated.spec.ts

test.describe('Visual regression — public pages', () => {
    test('home page matches snapshot', async ({ page }) => {
        await page.goto('/it');
        await page.waitForLoadState('networkidle');
        await page.addStyleTag({
            content: `
                [data-testid="cart-button"] { visibility: hidden; }
                .animate-spin, [class*="animate-"] { animation: none !important; }
            `,
        });
        await expect(page).toHaveScreenshot('home.png', { maxDiffPixelRatio: 0.02 });
    });

    test('menu page matches snapshot', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
        await page.addStyleTag({
            content: '.animate-spin, [class*="animate-"] { animation: none !important; }',
        });
        await expect(page).toHaveScreenshot('menu.png', { maxDiffPixelRatio: 0.02 });
    });

    test('product detail page matches snapshot', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
        const firstCard = page.locator('[data-testid="product-card"]').first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        await page.waitForLoadState('networkidle');
        await page.addStyleTag({
            content: '[data-testid="cart-button"] { visibility: hidden; }',
        });
        await expect(page).toHaveScreenshot('product-detail.png', { maxDiffPixelRatio: 0.02 });
    });
});
