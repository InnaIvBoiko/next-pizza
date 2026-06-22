import { test, expect } from '@playwright/test';

const PRODUCT_CARD = 'a:has(h3)[href*="/product/"]';

test.describe('Cart drawer', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
    });

    test('cart button is visible in the header', async ({ page }) => {
        const cartBtn = page.getByRole('button', { name: /€/ }).first();
        await expect(cartBtn).toBeVisible();
    });

    test('clicking cart button opens the drawer', async ({ page }) => {
        const cartBtn = page.getByRole('button', { name: /€/ }).first();
        await cartBtn.click();

        await expect(page.getByText('Il tuo carrello è vuoto')).toBeVisible();
    });

    test('empty cart shows go-back button', async ({ page }) => {
        const cartBtn = page.getByRole('button', { name: /€/ }).first();
        await cartBtn.click();

        await expect(
            page.getByRole('button', { name: /Torna indietro/i })
        ).toBeVisible();
    });
});

test.describe('Add to cart flow', () => {
    test('adding a product shows a success toast', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator(PRODUCT_CARD).first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        await page.waitForLoadState('networkidle');

        const addBtn = page.getByRole('button', {
            name: /Aggiungi al carrello/i,
        });
        await expect(addBtn).toBeEnabled();
        await addBtn.click();

        await expect(
            page.getByText(/aggiunto al carrello/i)
        ).toBeVisible({ timeout: 5000 });
    });

    test('cart button shows updated item count after adding', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        // Record initial count (text on cart button contains the count)
        const cartBtn = page.getByRole('button', { name: /€/ }).first();
        const before = await cartBtn.textContent();

        const firstCard = page.locator(PRODUCT_CARD).first();
        await firstCard.click();
        await page.waitForLoadState('networkidle');

        const addBtn = page.getByRole('button', { name: /Aggiungi al carrello/i });
        if (await addBtn.isEnabled()) {
            await addBtn.click();
            await page.getByText(/aggiunto al carrello/i).waitFor({ timeout: 5000 });

            // Go back to menu, cart button text should have changed
            await page.goto('/it/menu');
            await page.waitForLoadState('networkidle');
            const after = await page.getByRole('button', { name: /€/ }).first().textContent();
            expect(after).not.toBe(before);
        }
    });

    test('cart drawer lists the added product', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator(PRODUCT_CARD).first();
        const productName = await firstCard.locator('h3').textContent();
        await firstCard.click();
        await page.waitForLoadState('networkidle');

        const addBtn = page.getByRole('button', { name: /Aggiungi al carrello/i });
        if (await addBtn.isEnabled()) {
            await addBtn.click();
            await page.getByText(/aggiunto al carrello/i).waitFor({ timeout: 5000 });

            await page.goto('/it/menu');
            await page.waitForLoadState('networkidle');
            await page.getByRole('button', { name: /€/ }).first().click();

            if (productName) {
                // Scope to the sheet panel (data-state="open") to avoid hidden nav matches
                const sheet = page.locator('[data-state="open"]');
                await expect(sheet.getByText(productName, { exact: false }).first()).toBeVisible({ timeout: 3000 });
            }
        }
    });
});
