import {
    AboutUs,
    Hero,
    HowItWorks,
    SiteFooter,
    Testimonials,
} from '@/shared/components/shared/home';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../dictionaries';

export default async function Home({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <>
            <Hero dict={dict.home.hero} lang={lang as Locale} />
            <AboutUs dict={dict.home.about} />
            <HowItWorks dict={dict.home.howItWorks} />
            <Testimonials dict={dict.home.testimonials} />
            <SiteFooter dict={dict.home.footer} lang={lang as Locale} />
        </>
    );
}
