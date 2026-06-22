# Testing — Next Pizza (Italiano)

### Panoramica

Il progetto usa due livelli di test distinti:

| Livello | Tool | Comandi |
|---|---|---|
| Unit + Integration | Vitest + React Testing Library | `npm test` / `npm run test:watch` |
| End-to-End (E2E) | Playwright | `npm run test:e2e` / `npm run test:e2e:ui` |

**Totale: ~225 test** — 147 unit/integration, 38 E2E pubblici, ~12 E2E autenticati, ~5 visual regression.

---

## Livello 1 — Unit e Integration (Vitest)

### Installazione e configurazione

```bash
npm install -D vitest @vitejs/plugin-react-swc @testing-library/react @testing-library/user-event jsdom
```

Il file `vitest.config.ts` usa `@vitejs/plugin-react-swc` (anziché `@vitejs/plugin-react`) per evitare il conflitto di peer dependency con `@babel/core` introdotto da `shadcn`.

### Struttura dei test

I test si trovano in cartelle `__tests__/` accanto al codice che testano:

```
shared/
├── lib/
│   ├── __tests__/               ← pure functions
│   └── i18n/__tests__/          ← i18n helpers
├── constants/__tests__/         ← costanti + Zod schemas
├── store/__tests__/             ← Zustand stores
├── hooks/__tests__/             ← custom hooks
└── services/__tests__/          ← service layer (axios)
```

### Cosa è testato

| Categoria | File | Test | Tecnica |
|---|---|---|---|
| **Pure functions** | `calc-total-pizza-price`, `calc-cart-item-total-price`, `is-product-available`, `format-price`, `get-cart-details`, `get-available-pizza-sizes`, `order-items`, `order-status`, `pizza-labels`, `get-cart-item-details`, `get-pizza-details`, `utils` | 50 | Nessun mock |
| **i18n** | `format`, `localize-href`, `localize-name`, `localize-description` | 23 | Nessun mock |
| **Constants + Zod** | `checkout`, `i18n`, `sort`, `checkout-form-schema`, `address-form-schema` | 31 | Mock dizionario minimo |
| **Zustand stores** | `cart` store, `category` store | 9 | `vi.hoisted()` + promise differita |
| **Custom hooks** | `use-cart`, `use-filters`, `use-pizza-options`, `use-ingredients`, `use-query-filters` | 22 | `renderHook`, mock `next/navigation` |
| **Service layer** | `cart` service (axios) | 4 | Mock `axiosInstance` |

### Pattern e tecniche chiave

**`vi.hoisted()`** — necessario quando le variabili mock vengono usate dentro la factory di `vi.mock`, che viene sollevata in cima al file:

```ts
const { mockGetCart } = vi.hoisted(() => ({ mockGetCart: vi.fn() }));
vi.mock('@/shared/services/api-client', () => ({
    Api: { cart: { getCart: mockGetCart } },
}));
```

**Promise differita per ottimistic update** — per osservare lo stato intermedio prima che l'API risponda:

```ts
let resolve: (v: CartDTO) => void;
mockRemoveCartItem.mockReturnValue(new Promise(r => { resolve = r; }));
act(() => { result.current.removeCartItem(10); });
expect(result.current.items[0].disabled).toBe(true); // stato ottimistico
await act(async () => { resolve(emptyCart); });
```

**`DictionaryProvider` come wrapper** — per testare hook che usano `useDictionary()`:

```tsx
const wrapper = ({ children }) => (
    <DictionaryProvider dict={mockDict} lang="it">{children}</DictionaryProvider>
);
const { result } = renderHook(() => usePizzaOptions(items), { wrapper });
```

### Copertura del codice (Coverage)

```bash
npm run test:coverage
```

Il report HTML viene generato in `coverage/index.html`. La coverage attuale è **~91%** delle istruzioni sui file inclusi.

La configurazione esclude file server-only (Prisma, Stripe, email) che fallirebbero nell'ambiente `jsdom`:

```ts
coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    include: ['shared/lib/**/*.ts', 'shared/hooks/**/*.ts', 'shared/store/**/*.ts', ...],
    exclude: ['shared/lib/logger.server.ts', 'shared/lib/send-email.ts', ...],
}
```

---

## Livello 2 — End-to-End (Playwright)

### Installazione

```bash
npm install -D @playwright/test
npx playwright install chromium --with-deps
```

### Configurazione

Il file `playwright.config.ts` usa `webServer` con `reuseExistingServer: true`: in locale riutilizza il server già avviato (`npm run dev`), in CI lo avvia da zero.

I test girano su **Chromium desktop** e **Pixel 5** (mobile, Chromium). Il profilo `iPhone 13` richiede WebKit; usando Pixel 5 si rimane su Chromium già installato.

### File di test E2E

| File | Flussi testati | Test |
|---|---|---|
| `e2e/home.spec.ts` | Caricamento homepage, hero, nav, sezioni | 6 |
| `e2e/menu.spec.ts` | Prodotti, categorie, filtri mobile | 7 |
| `e2e/product.spec.ts` | Click card → modal, form pizza (taglie/tipi) | 4 |
| `e2e/cart.spec.ts` | Drawer, aggiungi prodotto, contatore, lista carrello | 6 |
| `e2e/i18n.spec.ts` | Redirect locale, cambio lingua IT↔EN, URL prodotti | 6 |
| `e2e/auth.spec.ts` | Modal login, campi form, rotte protette | 7 |
| `e2e/checkout.spec.ts` | Redirect senza auth, validazione form, pagina success | 3 |
| `e2e/authenticated.spec.ts` | Profilo, indirizzi, checkout pre-compilato (autenticato) | ~12 |
| `e2e/authenticated.spec.ts` | Profilo, indirizzi, checkout pre-compilato + visual regression auth (autenticato) | ~13 |
| `e2e/visual.spec.ts` | Screenshot regression: home, menu, prodotto (pagine pubbliche) | 3 |

### Selettori `data-testid`

I componenti chiave hanno attributi `data-testid` stabili per evitare che i selettori si rompano al refactoring CSS:

```ts
// Header cart button
page.getByTestId('cart-button')

// Product card in menu
page.locator('[data-testid="product-card"]').first()

// Cart item nel drawer
page.getByTestId('cart-item').first()

// Pulsanti quantità
page.getByTestId('count-minus')
page.getByTestId('count-plus')
```

### Selettori Radix UI

```ts
// Language select — non nativo, serve click trigger + click option
await page.getByRole('combobox', { name: /italiano/i }).click();
await page.getByRole('option', { name: /english/i }).click();
```

### Fixture utente autenticato

Il global setup (`e2e/global-setup.ts`) salva la sessione utente una volta sola prima di tutti i test:

```bash
TEST_USER_EMAIL=user@test.com TEST_USER_PASSWORD=secret npx playwright test
```

I test autenticati usano `test.use({ storageState })` — API nativa di Playwright, nessun file fixture separato necessario. `storageState` viene applicato condizionalmente all'inizio di `authenticated.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join(__dirname, 'fixtures', 'user-session.json');

test.describe('authenticated', () => {
    // Applicato solo se il file esiste (creato da globalSetup)
    if (fs.existsSync(SESSION_FILE)) {
        test.use({ storageState: SESSION_FILE });
    }

    test.beforeEach(async ({}, testInfo) => {
        if (!fs.existsSync(SESSION_FILE)) {
            testInfo.skip(true, 'Imposta TEST_USER_EMAIL e TEST_USER_PASSWORD');
        }
    });

    test('profilo utente', async ({ page }) => {
        await page.goto('/it/profile');
        await expect(page.getByText('Il mio profilo')).toBeVisible();
    });
});
```

Se `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` non sono impostati, i test autenticati vengono **saltati** automaticamente (non falliscono).

Il file `e2e/fixtures/user-session.json` è in `.gitignore` — non viene mai committato.

### Test desktop-only (skip su mobile)

Alcuni test testano elementi dell'header desktop che su mobile si trovano nel burger menu. Questi test vengono saltati automaticamente quando il viewport è < 640px:

| Test | Motivo dello skip |
|---|---|
| Auth modal (tutti) | Bottone "Accedi" nascosto su mobile (`hidden sm:block`) |
| Nav link to menu | Link di navigazione nel burger menu su mobile |
| Language switcher | Select lingua nel burger menu su mobile |

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
# Prima esecuzione: crea gli screenshot baseline
npm run test:e2e:update-snapshots

# Esecuzioni successive: confronta con il baseline
npm run test:e2e
```

Gli screenshot vengono salvati in `e2e/visual.spec.ts-snapshots/`. Le pagine con contenuto PII (email, nome) vengono oscurate con `filter: blur()` prima dello screenshot.

La soglia di tolleranza è **2% di differenza pixel** (`maxDiffPixelRatio: 0.02`).

---

## CI/CD — GitHub Actions

Il file `.github/workflows/ci.yml` esegue due job in pipeline:

```
unit (vitest) → e2e (playwright)
```

- **unit**: `npm ci` → `test:coverage` → upload artifact `coverage/`
- **e2e** (dipende da `unit`): `npm ci` → `playwright install chromium` → `npm run build` → `test:e2e` → upload `playwright-report/` in caso di fallimento

Le variabili d'ambiente sensibili (database, NextAuth, Stripe, Google OAuth) vengono mappate dai GitHub Secrets.

---

## Cosa NON è testato (e perché)

| Area | Motivo | Alternativa consigliata |
|---|---|---|
| Route API (`app/api/`) | Richiedono Prisma + DB reale | Test di integrazione con DB di test isolato |
| Server actions (`app/actions.ts`) | Prisma + cookies + Stripe | Playwright E2E autenticato (già in `authenticated.spec.ts`) |
| `auth-options.ts` | NextAuth + Prisma accoppiati | Mock NextAuth in unit test |
| `create-payment.ts` | Richiede Stripe SDK | Test con Stripe test mode |
| Dashboard admin | Richiede ruolo ADMIN | Playwright con fixture utente admin (stesso pattern di `global-setup.ts`) |
