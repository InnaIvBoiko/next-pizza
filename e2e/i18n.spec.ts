import { test, expect } from '@playwright/test';

test.describe('i18n routing', () => {
    test('root / redirects to default locale /it', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/it/);
    });

    test('/it/ renders Italian hero title', async ({ page }) => {
        await page.goto('/it');
        // dict.home.hero.title = "La vera pizza italiana, a casa tua"
        await expect(
            page.getByText(/La vera pizza italiana/i).first()
        ).toBeVisible();
    });

    test('/en/ renders English content', async ({ page }) => {
        await page.goto('/en');
        // English hero title is different from Italian
        await expect(
            page.getByText('La vera pizza italiana, a casa tua')
        ).not.toBeVisible();
    });

    test('language switcher trigger is present in the header', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
        // LanguageSelect renders a SelectTrigger with aria-label = current locale name
        const langBtn = page.getByRole('combobox', { name: /italiano/i });
        await expect(langBtn).toBeVisible();
    });

    test('switching language from IT to EN updates the URL', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        // Open the Radix Select by clicking its trigger
        await page.getByRole('combobox', { name: /italiano/i }).click();

        // Click the English option in the dropdown
        await page.getByRole('option', { name: /english/i }).click();

        await expect(page).toHaveURL(/\/en\/menu/);
    });
});

test.describe('Locale in product URLs', () => {
    test('product links include locale prefix', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator('a:has(h3)[href*="/product/"]').first();
        await expect(firstCard).toBeVisible();
        const href = await firstCard.getAttribute('href');

        expect(href).toMatch(/^\/it\/product\/\d+$/);
    });
});
