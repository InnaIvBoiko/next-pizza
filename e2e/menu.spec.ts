import { test, expect } from '@playwright/test';

// Product cards are the only <a> tags that contain an <h3> (product name)
const PRODUCT_CARD = 'a:has(h3)[href*="/product/"]';

test.describe('Menu page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
    });

    test('shows page title', async ({ page }) => {
        await expect(page.getByText('Il nostro menu')).toBeVisible();
    });

    test('renders at least one product card', async ({ page }) => {
        const cards = page.locator(PRODUCT_CARD);
        await expect(cards.first()).toBeVisible();
        expect(await cards.count()).toBeGreaterThan(0);
    });

    test('product cards show a price', async ({ page }) => {
        // ProductCard renders "da €X,XX"
        const firstCard = page.locator(PRODUCT_CARD).first();
        await expect(firstCard.getByText(/€/)).toBeVisible();
    });

    test('category tabs are rendered in the TopBar', async ({ page }) => {
        // Categories renders <a href="#CategoryName"> inside a rounded-full bg-muted pill
        const categoryPill = page.locator('[class*="bg-muted"][class*="rounded-full"]').first();
        const tabs = categoryPill.locator('a[href^="#"]');
        await expect(tabs.first()).toBeVisible();
        expect(await tabs.count()).toBeGreaterThan(0);
    });

    test('clicking a category tab updates the hash', async ({ page }) => {
        const categoryPill = page.locator('[class*="bg-muted"][class*="rounded-full"]').first();
        const firstTab = categoryPill.locator('a[href^="#"]').first();
        const href = await firstTab.getAttribute('href');
        await firstTab.click();
        await expect(page).toHaveURL(new RegExp(href?.replace('#', '#') ?? ''));
    });
});

test.describe('Menu page — mobile filters drawer', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('filter drawer button is visible on mobile', async ({ page }) => {
        await page.goto('/it/menu');
        await page.waitForLoadState('networkidle');
        // FiltersDrawer renders a trigger button on mobile
        const filterBtn = page.getByRole('button', { name: /filtri|filter/i });
        await expect(filterBtn.first()).toBeVisible();
    });
});
