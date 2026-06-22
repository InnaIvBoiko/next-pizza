import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join(__dirname, 'fixtures', 'user-session.json');

// ---------------------------------------------------------------------------
// Unauthenticated redirect — no session needed
// ---------------------------------------------------------------------------
test('unauthenticated /it/profile redirects away', async ({ page }) => {
    await page.goto('/it/profile');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/\/profile/);
});

// ---------------------------------------------------------------------------
// Authenticated tests
// Session file is created by globalSetup (which runs before test collection),
// so fs.existsSync() reliably returns true when credentials were provided.
// ---------------------------------------------------------------------------
test.describe('authenticated', () => {
    if (fs.existsSync(SESSION_FILE)) {
        test.use({ storageState: SESSION_FILE });
    }

    test.beforeEach(async ({}, testInfo) => {
        if (!fs.existsSync(SESSION_FILE)) {
            testInfo.skip(true, 'No user session — set TEST_USER_EMAIL and TEST_USER_PASSWORD');
        }
    });

    // -------------------------------------------------------------------------
    // Profile page
    // -------------------------------------------------------------------------
    test.describe('Profile page', () => {
        test('shows the profile page', async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await expect(page.getByText('Il mio profilo')).toBeVisible();
        });

        test('shows Dati tab by default', async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await expect(page.getByText('E-mail')).toBeVisible();
            await expect(page.getByText('Nome completo')).toBeVisible();
        });

        test('has Indirizzi tab', async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await page.getByRole('tab', { name: /Indirizzi/i }).click();
            await expect(page.getByText('Indirizzi di consegna')).toBeVisible();
        });

        test('has Ordini tab', async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await page.getByRole('tab', { name: /Ordini/i }).click();
            await expect(
                page.getByText(/I miei ordini|Non hai ancora effettuato ordini/i).first()
            ).toBeVisible();
        });
    });

    // -------------------------------------------------------------------------
    // Address management
    // -------------------------------------------------------------------------
    test.describe('Address management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await page.getByRole('tab', { name: /Indirizzi/i }).click();
        });

        test('Aggiungi indirizzo button is present', async ({ page }) => {
            await expect(
                page.getByRole('button', { name: /Aggiungi indirizzo/i })
            ).toBeVisible();
        });

        test('clicking Aggiungi indirizzo opens the form', async ({ page }) => {
            await page.getByRole('button', { name: /Aggiungi indirizzo/i }).click();
            await expect(page.locator('input[name="street"]')).toBeVisible();
            await expect(page.locator('input[name="houseNumber"]')).toBeVisible();
            await expect(page.locator('input[name="city"]')).toBeVisible();
            await expect(page.locator('input[name="postalCode"]')).toBeVisible();
        });

        test('adding an address shows a success toast', async ({ page }) => {
            await page.getByRole('button', { name: /Aggiungi indirizzo/i }).click();
            await page.locator('input[name="street"]').fill('Via Test Playwright');
            await page.locator('input[name="houseNumber"]').fill('99');
            await page.locator('input[name="city"]').fill('Roma');
            await page.locator('input[name="postalCode"]').fill('00100');
            await page.getByRole('button', { name: /^Salva$/i }).click();
            await expect(page.getByText(/Indirizzo aggiunto/i)).toBeVisible({ timeout: 5000 });
        });
    });

    // -------------------------------------------------------------------------
    // Checkout
    // -------------------------------------------------------------------------
    test.describe('Checkout form', () => {
        test('checkout page is accessible', async ({ page }) => {
            await page.goto('/it/checkout');
            await page.waitForLoadState('networkidle');
            await expect(page.getByText('Il tuo ordine')).toBeVisible();
        });

        test('personal-data section is visible', async ({ page }) => {
            await page.goto('/it/checkout');
            await page.waitForLoadState('networkidle');
            await expect(page.getByText('2. Dati personali')).toBeVisible();
        });

        test('email field is pre-filled from session', async ({ page }) => {
            await page.goto('/it/checkout');
            await page.waitForLoadState('networkidle');
            await page.waitForFunction(() => {
                const el = document.querySelector('input[name="email"]') as HTMLInputElement | null;
                return el && el.value.includes('@');
            }, { timeout: 5000 });
            const value = await page.locator('input[name="email"]').inputValue();
            expect(value).toContain('@');
        });
    });

    // -------------------------------------------------------------------------
    // Visual regression — authenticated pages
    // -------------------------------------------------------------------------
    test.describe('Visual regression', () => {
        test('profile page matches snapshot', async ({ page }) => {
            await page.goto('/it/profile');
            await page.waitForLoadState('networkidle');
            await page.addStyleTag({ content: 'p.font-medium { filter: blur(6px); }' });
            await expect(page).toHaveScreenshot('profile.png', { maxDiffPixelRatio: 0.02 });
        });

        test('checkout page matches snapshot', async ({ page }) => {
            await page.goto('/it/checkout');
            await page.waitForLoadState('networkidle');
            await page.addStyleTag({
                content: `
                    input[name="email"], input[name="firstName"],
                    input[name="lastName"], input[name="phone"] { filter: blur(6px); }
                `,
            });
            await expect(page).toHaveScreenshot('checkout.png', { maxDiffPixelRatio: 0.02 });
        });
    });
});
