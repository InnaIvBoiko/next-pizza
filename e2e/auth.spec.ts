import { test, expect } from '@playwright/test';

test.describe('Auth modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
    });

    test('sign in button is visible in the header', async ({ page }) => {
        await expect(
            page.getByRole('button', { name: /Accedi/i }).first()
        ).toBeVisible();
    });

    test('clicking sign in opens the auth modal', async ({ page }) => {
        await page.getByRole('button', { name: /Accedi/i }).first().click();

        await expect(
            page.getByText('Accedi al tuo account Next Pizza')
        ).toBeVisible();
    });

    test('auth modal shows Google sign-in option', async ({ page }) => {
        await page.getByRole('button', { name: /Accedi/i }).first().click();

        await expect(
            page.getByRole('button', { name: /Google/i })
        ).toBeVisible();
    });

    test('auth modal shows email and password fields', async ({ page }) => {
        await page.getByRole('button', { name: /Accedi/i }).first().click();

        // LoginForm renders label as <p> (not <label>), so match by input name
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test('auth modal shows register button', async ({ page }) => {
        await page.getByRole('button', { name: /Accedi/i }).first().click();

        // The switch button label comes from dict.auth.register.submit
        await expect(
            page.getByRole('button', { name: /Registrati/i })
        ).toBeVisible();
    });
});

test.describe('Protected routes', () => {
    test('profile page redirects or prompts login when not authenticated', async ({
        page,
    }) => {
        await page.goto('/it/profile');
        await page.waitForLoadState('networkidle');

        const url = page.url();
        // Either redirected away from /profile, or the auth modal/prompt is shown
        const isOnProfile = url.includes('/profile');
        if (isOnProfile) {
            await expect(
                page.getByText(/Accedi|accedi/i).first()
            ).toBeVisible({ timeout: 3000 });
        }
    });

    test('dashboard redirects non-admin users away', async ({ page }) => {
        await page.goto('/it/dashboard');
        await page.waitForLoadState('networkidle');
        expect(page.url()).not.toMatch(/\/it\/dashboard$/);
    });
});
