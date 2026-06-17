import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { Providers } from '@/shared/components/shared/providers';
import { DictionaryProvider } from '@/shared/components/shared/i18n/dictionary-provider';
import { locales, isLocale } from '@/shared/constants/i18n';
import { getDictionary } from './dictionaries';
import '../globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    icons: { icon: '/logo.svg' },
};

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const { lang } = await params;

    if (!isLocale(lang)) {
        notFound();
    }

    const dict = await getDictionary(lang);

    return (
        <html lang={lang} suppressHydrationWarning className={inter.variable}>
            <body className='font-sans antialiased'>
                <Providers>
                    <DictionaryProvider dict={dict} lang={lang}>
                        {children}
                    </DictionaryProvider>
                </Providers>
            </body>
        </html>
    );
}
