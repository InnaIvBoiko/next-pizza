import { test, expect } from '@playwright/test';

const PRODUCT_CARD = '[data-testid="product-card"]';

test.describe('Cart drawer', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('domcontentloaded');
        await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });
    });

    test('cart button is visible in the header', async ({ page }) => {
        const cartBtn = page.getByTestId('cart-button');
        await expect(cartBtn).toBeVisible();
    });

    test('clicking cart button opens the drawer', async ({ page }) => {
        const cartBtn = page.getByTestId('cart-button');
        await cartBtn.click();

        await expect(page.getByText('Il tuo carrello è vuoto')).toBeVisible();
    });

    test('empty cart shows go-back button', async ({ page }) => {
        const cartBtn = page.getByTestId('cart-button');
        await cartBtn.click();

        await expect(
            page.getByRole('button', { name: /Torna indietro/i })
        ).toBeVisible();
    });
});

test.describe('Add to cart flow', () => {
    test('adding a product shows a success toast', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('domcontentloaded');
        await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });

        const firstCard = page.locator(PRODUCT_CARD).first();
        await firstCard.click();
        await page.waitForLoadState('domcontentloaded');

        const addBtn = page.getByRole('button', {
            name: /Aggiungi al carrello/i,
        });
        await expect(addBtn).toBeEnabled({ timeout: 5000 });
        await addBtn.click();

        await expect(
            page.getByText(/aggiunto al carrello/i)
        ).toBeVisible({ timeout: 8000 });
    });

    test('cart button shows updated item count after adding', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('domcontentloaded');
        await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });

        // Record initial count (text on cart button contains the count)
        const cartBtn = page.getByTestId('cart-button');
        const before = await cartBtn.textContent();

        const firstCard = page.locator(PRODUCT_CARD).first();
        await firstCard.click();
        await page.waitForLoadState('domcontentloaded');

        const addBtn = page.getByRole('button', { name: /Aggiungi al carrello/i });
        if (await addBtn.isEnabled()) {
            await addBtn.click();
            await page.getByText(/aggiunto al carrello/i).waitFor({ timeout: 8000 });

            // Go back to menu, cart button text should have changed
            await page.goto('/it/menu');
            await page.waitForLoadState('domcontentloaded');
            await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });
            const after = await page.getByRole('button', { name: /€/ }).first().textContent();
            expect(after).not.toBe(before);
        }
    });

    test('cart drawer lists the added product', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('domcontentloaded');
        await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });

        const firstCard = page.locator(PRODUCT_CARD).first();
        const productName = await firstCard.locator('h3').textContent();
        await firstCard.click();
        await page.waitForLoadState('domcontentloaded');

        const addBtn = page.getByRole('button', { name: /Aggiungi al carrello/i });
        if (await addBtn.isEnabled()) {
            await addBtn.click();
            await page.getByText(/aggiunto al carrello/i).waitFor({ timeout: 8000 });

            await page.goto('/it/menu');
            await page.waitForLoadState('domcontentloaded');
            await page.locator(PRODUCT_CARD).first().waitFor({ state: 'visible' });
            await page.getByTestId('cart-button').click();

            if (productName) {
                // Scope to cart items to avoid hidden nav matches
                const cartItem = page.getByTestId('cart-item').first();
                await expect(cartItem).toBeVisible({ timeout: 3000 });
                await expect(cartItem.getByText(productName, { exact: false })).toBeVisible();
            }
        }
    });
});
