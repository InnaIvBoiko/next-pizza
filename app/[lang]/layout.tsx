import { notFound } from 'next/navigation';
import { DictionaryProvider } from '@/shared/components/shared/i18n/dictionary-provider';
import { HtmlLang } from '@/shared/components/shared/i18n/html-lang';
import { CookieBanner } from '@/shared/components/shared/cookie-banner';
import { locales, isLocale } from '@/shared/constants/i18n';
import { getDictionary } from './dictionaries';

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

// Locale layout: nested under the root layout. It only resolves the dictionary
// for the active locale and exposes it via context — <html>/<body> and the
// global Providers live in the root layout so they survive locale switches.
export default async function LangLayout({
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
        <DictionaryProvider dict={dict} lang={lang}>
            <HtmlLang lang={lang} />
            {children}
            <CookieBanner />
        </DictionaryProvider>
    );
}
