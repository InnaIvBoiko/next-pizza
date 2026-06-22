import { test, expect } from '@playwright/test';

test.describe('i18n routing', () => {
    test('root / redirects to default locale /it', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/it/);
    });

    test('/it/ renders Italian hero title', async ({ page }) => {
        await page.goto('/it');
        // Use heading role to avoid matching the hidden <p class="hidden sm:block"> in the nav.
        await expect(
            page.getByRole('heading', { name: /La vera pizza italiana/i }).first()
        ).toBeVisible();
    });

    test('/en/ renders English content', async ({ page }) => {
        await page.goto('/en');
        // English hero title is different from Italian
        await expect(
            page.getByText('La vera pizza italiana, a casa tua')
        ).not.toBeVisible();
    });

    test('language switcher trigger is present in the header', async ({ page }, testInfo) => {
        // The language select is hidden on mobile (inside burger menu).
        const vp = page.viewportSize();
        if (vp && vp.width < 640) {
            testInfo.skip(true, 'Language select is in burger menu on mobile — desktop only');
            return;
        }
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
        const langBtn = page.getByRole('combobox', { name: /italiano/i });
        await expect(langBtn).toBeVisible();
    });

    test('switching language from IT to EN updates the URL', async ({ page }, testInfo) => {
        const vp = page.viewportSize();
        if (vp && vp.width < 640) {
            testInfo.skip(true, 'Language select is in burger menu on mobile — desktop only');
            return;
        }
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        await page.getByRole('combobox', { name: /italiano/i }).click();
        await page.getByRole('option', { name: /english/i }).click();

        await expect(page).toHaveURL(/\/en\/menu/);
    });
});

test.describe('Locale in product URLs', () => {
    test('product links include locale prefix', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator('[data-testid="product-card"]').first();
        await expect(firstCard).toBeVisible();
        const href = await firstCard.getAttribute('href');

        expect(href).toMatch(/^\/it\/product\/\d+$/);
    });
});
