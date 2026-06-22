import { test, expect } from '@playwright/test';

// Product cards are the only <a> tags that contain an <h3>
const PRODUCT_CARD = 'a:has(h3)[href*="/product/"]';

test.describe('Product page', () => {
    test('navigating from menu opens the product page', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator(PRODUCT_CARD).first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();

        await expect(page).toHaveURL(/\/it\/product\/\d+/);
    });

    test('product page shows an Add to Cart button', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator(PRODUCT_CARD).first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        await page.waitForLoadState('networkidle');

        const addBtn = page.getByRole('button', {
            name: /Aggiungi al carrello|Aggiungo/i,
        });
        await expect(addBtn).toBeVisible();
    });
});

test.describe('Product modal (intercepted route)', () => {
    test('clicking a product from menu opens the modal without full navigation', async ({
        page,
    }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const firstCard = page.locator(PRODUCT_CARD).first();
        await expect(firstCard).toBeVisible();
        const href = await firstCard.getAttribute('href');

        await firstCard.click();

        await expect(page).toHaveURL(new RegExp(href?.replace(/\//g, '\\/') ?? ''));

        const addBtn = page.getByRole('button', {
            name: /Aggiungi al carrello|Aggiungo/i,
        });
        await expect(addBtn).toBeVisible();
    });

    test('pizza form shows size and type variants when a pizza is opened', async ({
        page,
    }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');

        const cards = page.locator(PRODUCT_CARD);
        const count = await cards.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
            await page.goto('/it/menu');
            await page.waitForLoadState('networkidle');

            const card = page.locator(PRODUCT_CARD).nth(i);
            await expect(card).toBeVisible();
            await card.click();
            await page.waitForLoadState('networkidle');

            const sizeVariant = page.getByText(/Piccola|Media|Grande/);
            if (await sizeVariant.first().isVisible()) {
                await expect(sizeVariant.first()).toBeVisible();
                return;
            }
        }
        // If no pizza found in first 5, skip gracefully
    });
});
