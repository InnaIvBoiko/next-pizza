import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
    testDir: './e2e',
    globalSetup: path.resolve('./e2e/global-setup.ts'),
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        // Default locale is Italian
        locale: 'it-IT',
        // Visual regression — pixel tolerance
        screenshot: 'only-on-failure',
    },
    expect: {
        // Allow up to 2% pixel difference before failing a screenshot assertion
        toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile',
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: {
        // In CI (after `npm run build`) use the production server.
        // Locally reuse the already-running dev server.
        command: process.env.CI ? 'npm start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
