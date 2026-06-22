import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it');
    });

    test('loads without errors', async ({ page }) => {
        await expect(page).toHaveTitle(/Next Pizza/i);
    });

    test('shows the hero title', async ({ page }) => {
        // The h1 is always visible; avoid getByText().first() which picks up
        // the hidden <p class="hidden sm:block"> subtitle in the header nav.
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    });

    test('nav link to menu is present', async ({ page }, testInfo) => {
        // On mobile the nav links are inside the burger menu, not directly visible.
        const vp = page.viewportSize();
        if (vp && vp.width < 640) {
            testInfo.skip(true, 'Nav links are in the burger menu on mobile');
            return;
        }
        await expect(page.getByRole('link', { name: /menu/i }).first()).toBeVisible();
    });

    test('clicking the menu nav link navigates to /it/menu', async ({ page }, testInfo) => {
        const vp = page.viewportSize();
        if (vp && vp.width < 640) {
            testInfo.skip(true, 'Nav links are in the burger menu on mobile');
            return;
        }
        await page.getByRole('link', { name: /menu/i }).first().click();
        await expect(page).toHaveURL(/\/it\/menu/);
    });

    test('About Us section is visible', async ({ page }) => {
        await page.getByText('Chi siamo').first().scrollIntoViewIfNeeded();
        await expect(page.getByText('Chi siamo').first()).toBeVisible();
    });

    test('How It Works section is visible', async ({ page }) => {
        await page.getByText('Come funziona').first().scrollIntoViewIfNeeded();
        await expect(page.getByText('Come funziona').first()).toBeVisible();
    });
});
