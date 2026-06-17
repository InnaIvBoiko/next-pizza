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
