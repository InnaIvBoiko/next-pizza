import { chromium, type FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Paths where session cookies are persisted between test runs
export const USER_SESSION_PATH = path.join(__dirname, 'fixtures', 'user-session.json');

/**
 * Global setup runs once before all tests.
 * It logs in as a regular test user and saves the browser storage state
 * so authenticated tests can skip the login flow entirely.
 *
 * Required env vars:
 *   TEST_USER_EMAIL    — email of an existing user in the DB
 *   TEST_USER_PASSWORD — their password
 *
 * If the vars are not set, setup is skipped (unauthenticated tests still run).
 */
export default async function globalSetup(_config: FullConfig) {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
        console.log(
            '[global-setup] TEST_USER_EMAIL / TEST_USER_PASSWORD not set — skipping auth fixture setup.'
        );
        return;
    }

    // Ensure fixtures directory exists
    fs.mkdirSync(path.dirname(USER_SESSION_PATH), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/it/menu');
    await page.waitForLoadState('networkidle');

    // Open auth modal
    await page.getByRole('button', { name: /Accedi/i }).first().click();

    // Fill credentials
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: /^Accedi$/i }).click();

    // Wait for the modal to close (login success)
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10_000 });

    // Persist storage state (cookies + localStorage)
    await page.context().storageState({ path: USER_SESSION_PATH });

    console.log('[global-setup] User session saved to', USER_SESSION_PATH);
    await browser.close();
}
