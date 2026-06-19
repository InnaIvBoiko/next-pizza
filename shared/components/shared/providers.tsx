'use client';

import React from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>{children}</SessionProvider>
            <Toaster position='top-center' />
            {/* Global navigation feedback: a prominent top bar + corner spinner
                on every route change / router.push (links, filters, etc.). */}
            <NextTopLoader
                color='var(--primary)'
                height={4}
                showSpinner
                shadow='0 0 10px var(--primary), 0 0 5px var(--primary)'
                zIndex={9999}
            />
        </ThemeProvider>
    );
};
