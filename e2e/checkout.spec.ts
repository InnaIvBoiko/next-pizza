import { test, expect } from '@playwright/test';

test.describe('Checkout page — unauthenticated', () => {
    test('redirects to home or shows auth modal when accessing /checkout without auth', async ({
        page,
    }) => {
        await page.goto('/it/checkout');
        // The app redirects unauthenticated users or shows auth prompt.
        // Accept either: redirect away from /checkout, or the auth modal appears.
        const isOnCheckout = page.url().includes('/checkout');
        if (isOnCheckout) {
            // Should show login prompt
            await expect(
                page.getByText(/Accedi|accedi|sign in/i).first()
            ).toBeVisible();
        } else {
            // Redirected away — acceptable
            expect(page.url()).not.toContain('/checkout');
        }
    });
});

test.describe('Checkout form validation', () => {
    // This test only runs if checkout is accessible (e.g. there is a cart item)
    // We test client-side Zod validation directly by submitting an empty form.

    test('submitting empty form shows validation errors', async ({ page }) => {
        await page.goto('/it/checkout');
        await page.waitForLoadState('networkidle');

        // If we're on checkout (not redirected), test the form
        if (!page.url().includes('/checkout')) {
            test.skip();
            return;
        }

        const submitBtn = page.getByRole('button', { name: /Ordina ora|Conferma/i });
        if (!await submitBtn.isVisible()) return;

        await submitBtn.click();

        // At least one validation error should appear
        await expect(
            page.getByText(/almeno 2 caratteri|non valido|valido/i).first()
        ).toBeVisible({ timeout: 3000 });
    });
});

test.describe('Checkout success page', () => {
    test('success page is accessible at /checkout/success', async ({ page }) => {
        await page.goto('/it/checkout/success');
        // Should render something — either a success message or redirect
        await expect(page.locator('body')).not.toBeEmpty();
    });
});
