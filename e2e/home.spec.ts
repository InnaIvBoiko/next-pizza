import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it');
    });

    test('loads without errors', async ({ page }) => {
        await expect(page).toHaveTitle(/Next Pizza/i);
    });

    test('shows the hero title', async ({ page }) => {
        // dict.home.hero.title = "La vera pizza italiana, a casa tua"
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        await expect(
            page.getByText(/La vera pizza italiana/i).first()
        ).toBeVisible();
    });

    test('nav link to menu is present', async ({ page }) => {
        await expect(page.getByRole('link', { name: /menu/i }).first()).toBeVisible();
    });

    test('clicking the menu nav link navigates to /it/menu', async ({ page }) => {
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
