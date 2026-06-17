import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/shared/components/shared/providers';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    icons: { icon: '/logo.svg' },
};

// Root layout: owns <html>/<body> and the global Providers (theme, session,
// toaster, top loader). It lives ABOVE the `[lang]` segment so it is NOT
// remounted when the locale changes — keeping next-themes' pre-paint <script>
// stable and out of client re-renders. The active locale is applied to the
// <html lang> attribute by the `[lang]` layout (see HtmlLang).
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='it' suppressHydrationWarning className={inter.variable}>
            <body className='font-sans antialiased'>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
