# Testing — Next Pizza (English)

### Overview

The project uses two distinct test layers:

| Layer | Tool | Commands |
|---|---|---|
| Unit + Integration | Vitest + React Testing Library | `npm test` / `npm run test:watch` |
| End-to-End (E2E) | Playwright | `npm run test:e2e` / `npm run test:e2e:ui` |

**Total: ~225 tests** — 147 unit/integration, 38 public E2E, ~12 authenticated E2E, ~5 visual regression.

---

## Layer 1 — Unit and Integration (Vitest)

### Setup

```bash
npm install -D vitest @vitejs/plugin-react-swc @testing-library/react @testing-library/user-event jsdom
```

`vitest.config.ts` uses `@vitejs/plugin-react-swc` instead of `@vitejs/plugin-react` to avoid the peer dependency conflict between `@babel/core` versions introduced by `shadcn`.

### Test structure

Tests live in `__tests__/` folders next to the code they test:

```
shared/
├── lib/
│   ├── __tests__/               ← pure functions
│   └── i18n/__tests__/          ← i18n helpers
├── constants/__tests__/         ← constants + Zod schemas
├── store/__tests__/             ← Zustand stores
├── hooks/__tests__/             ← custom hooks
└── services/__tests__/          ← service layer (axios)
```

### What is tested

| Category | Files | Tests | Technique |
|---|---|---|---|
| **Pure functions** | `calc-total-pizza-price`, `calc-cart-item-total-price`, `is-product-available`, `format-price`, `get-cart-details`, `get-available-pizza-sizes`, `order-items`, `order-status`, `pizza-labels`, `get-cart-item-details`, `get-pizza-details`, `utils` | 50 | No mocks |
| **i18n** | `format`, `localize-href`, `localize-name`, `localize-description` | 23 | No mocks |
| **Constants + Zod** | `checkout`, `i18n`, `sort`, `checkout-form-schema`, `address-form-schema` | 31 | Minimal dict mock |
| **Zustand stores** | `cart` store, `category` store | 9 | `vi.hoisted()` + deferred promise |
| **Custom hooks** | `use-cart`, `use-filters`, `use-pizza-options`, `use-ingredients`, `use-query-filters` | 22 | `renderHook`, mock `next/navigation` |
| **Service layer** | `cart` service (axios) | 4 | Mock `axiosInstance` |

### Key patterns

**`vi.hoisted()`** — required when mock variables are used inside a `vi.mock` factory, which is hoisted to the top of the file:

```ts
const { mockGetCart } = vi.hoisted(() => ({ mockGetCart: vi.fn() }));
vi.mock('@/shared/services/api-client', () => ({
    Api: { cart: { getCart: mockGetCart } },
}));
```

**Deferred promise for optimistic updates** — to observe intermediate state before the API responds:

```ts
let resolve: (v: CartDTO) => void;
mockRemoveCartItem.mockReturnValue(new Promise(r => { resolve = r; }));
act(() => { result.current.removeCartItem(10); });
expect(result.current.items[0].disabled).toBe(true); // optimistic state
await act(async () => { resolve(emptyCart); });
```

**`DictionaryProvider` as wrapper** — to test hooks that call `useDictionary()`:

```tsx
const wrapper = ({ children }) => (
    <DictionaryProvider dict={mockDict} lang="it">{children}</DictionaryProvider>
);
const { result } = renderHook(() => usePizzaOptions(items), { wrapper });
```

### Code Coverage

```bash
npm run test:coverage
```

The HTML report is generated at `coverage/index.html`. Current coverage is **~91%** of statements across included files.

The config excludes server-only files (Prisma, Stripe, email) that would fail in the `jsdom` environment:

```ts
coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    include: ['shared/lib/**/*.ts', 'shared/hooks/**/*.ts', 'shared/store/**/*.ts', ...],
    exclude: ['shared/lib/logger.server.ts', 'shared/lib/send-email.ts', ...],
}
```

---

## Layer 2 — End-to-End (Playwright)

### Setup

```bash
npm install -D @playwright/test
npx playwright install chromium --with-deps
```

### Configuration

`playwright.config.ts` uses `webServer` with `reuseExistingServer: true`: in development it reuses the running `npm run dev` server; in CI it starts a fresh one.

Tests run on **Chromium desktop** and **Pixel 5** (mobile, Chromium). The `iPhone 13` profile requires WebKit; using Pixel 5 stays on the already-installed Chromium.

### E2E test files

| File | Flows tested | Tests |
|---|---|---|
| `e2e/home.spec.ts` | Page load, hero, nav, sections | 6 |
| `e2e/menu.spec.ts` | Products, categories, mobile filters | 7 |
| `e2e/product.spec.ts` | Card click → modal, pizza form (sizes/types) | 4 |
| `e2e/cart.spec.ts` | Drawer, add product, item count, cart list | 6 |
| `e2e/i18n.spec.ts` | Locale redirect, IT↔EN switch, product URLs | 6 |
| `e2e/auth.spec.ts` | Login modal, form fields, protected routes | 7 |
| `e2e/checkout.spec.ts` | Unauthenticated redirect, form validation, success page | 3 |
| `e2e/authenticated.spec.ts` | Profile, addresses, pre-filled checkout (authenticated) | ~12 |
| `e2e/authenticated.spec.ts` | Profile, addresses, pre-filled checkout + visual regression for auth pages | ~13 |
| `e2e/visual.spec.ts` | Screenshot regression: home, menu, product detail (public pages) | 3 |

### `data-testid` selectors

Key components have stable `data-testid` attributes to prevent selectors from breaking on CSS refactoring:

```ts
// Header cart button
page.getByTestId('cart-button')

// Product card in menu
page.locator('[data-testid="product-card"]').first()

// Cart item in the drawer
page.getByTestId('cart-item').first()

// Quantity buttons
page.getByTestId('count-minus')
page.getByTestId('count-plus')
```

### Radix UI selectors

```ts
// Language select — not a native <select>, needs trigger click + option click
await page.getByRole('combobox', { name: /italiano/i }).click();
await page.getByRole('option', { name: /english/i }).click();
```

### Authenticated user fixture

The global setup (`e2e/global-setup.ts`) saves the user session once before all tests:

```bash
TEST_USER_EMAIL=user@test.com TEST_USER_PASSWORD=secret npx playwright test
```

Authenticated tests use Playwright's native `test.use({ storageState })` — no separate fixture file needed. The storageState is applied conditionally at the top of `authenticated.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join(__dirname, 'fixtures', 'user-session.json');

test.describe('authenticated', () => {
    // Applied only when the file exists (created by globalSetup)
    if (fs.existsSync(SESSION_FILE)) {
        test.use({ storageState: SESSION_FILE });
    }

    test.beforeEach(async ({}, testInfo) => {
        if (!fs.existsSync(SESSION_FILE)) {
            testInfo.skip(true, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD');
        }
    });

    test('user profile', async ({ page }) => {
        await page.goto('/it/profile');
        await expect(page.getByText('Il mio profilo')).toBeVisible();
    });
});
```

If `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` are not set, authenticated tests are **skipped** automatically (they don't fail).

The file `e2e/fixtures/user-session.json` is in `.gitignore` — it is never committed.

### Desktop-only tests (skipped on mobile)

Some tests cover desktop header elements that are hidden on mobile inside the burger menu. These tests skip automatically when the viewport is < 640px:

| Test | Skip reason |
|---|---|
| Auth modal (all 5) | "Accedi" button has `hidden sm:block` on mobile |
| Nav link to menu | Navigation links are inside the burger menu on mobile |
| Language switcher | Language select is inside the burger menu on mobile |

```ts
test('sign in button is visible', async ({ page }, testInfo) => {
    const vp = page.viewportSize();
    if (vp && vp.width < 640) {
        testInfo.skip(true, 'Desktop only — button is in burger menu on mobile');
        return;
    }
    // ...
});
```

### Visual Regression

```bash
# First run: create baseline screenshots
npm run test:e2e:update-snapshots

# Subsequent runs: compare against baseline
npm run test:e2e
```

Screenshots are saved in `e2e/visual.spec.ts-snapshots/`. Pages with PII (email, name) are blurred with `filter: blur()` before the screenshot is taken.

Tolerance threshold is **2% pixel difference** (`maxDiffPixelRatio: 0.02`).

---

## CI/CD — GitHub Actions

`.github/workflows/ci.yml` runs two jobs in sequence:

```
unit (vitest) → e2e (playwright)
```

- **unit**: `npm ci` → `test:coverage` → upload `coverage/` artifact
- **e2e** (depends on `unit`): `npm ci` → `playwright install chromium` → `npm run build` → `test:e2e` → upload `playwright-report/` on failure

Sensitive environment variables (database, NextAuth, Stripe, Google OAuth) are mapped from GitHub Secrets.

---

## What is NOT tested (and why)

| Area | Reason | Recommended next step |
|---|---|---|
| API routes (`app/api/`) | Require Prisma + real DB | Integration tests with an isolated test DB |
| Server actions (`app/actions.ts`) | Prisma + cookies + Stripe | Playwright authenticated E2E (already in `authenticated.spec.ts`) |
| `auth-options.ts` | NextAuth + Prisma tightly coupled | Mock NextAuth in unit tests |
| `create-payment.ts` | Requires Stripe SDK | Test with Stripe test-mode keys |
| Admin dashboard | Requires ADMIN role | Playwright with admin user fixture (same pattern as `global-setup.ts`) |
