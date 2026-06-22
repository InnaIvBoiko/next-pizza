import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        exclude: ['node_modules/**', '.next/**', 'e2e/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            // Only measure coverage for testable client-side code
            include: [
                'shared/lib/**/*.ts',
                'shared/hooks/**/*.ts',
                'shared/store/**/*.ts',
                'shared/services/**/*.ts',
                'shared/constants/**/*.ts',
            ],
            exclude: [
                '**/__tests__/**',
                '**/index.ts',
                // Server-only files that can't run in jsdom
                'shared/lib/logger.server.ts',
                'shared/lib/send-email.ts',
                'shared/lib/create-payment.ts',
                'shared/lib/stripe.ts',
                'shared/lib/find-or-create-cart.ts',
                'shared/lib/update-cart-total-amount.ts',
                'shared/lib/get-user-session.ts',
                'shared/lib/get-admin-session.ts',
                'shared/lib/get-staff-session.ts',
                'shared/constants/auth-options.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        },
    },
});
