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
            <Toaster richColors position='top-center' />
            <NextTopLoader color='var(--primary)' showSpinner={false} />
        </ThemeProvider>
    );
};
