import {
    AboutUs,
    Hero,
    HowItWorks,
    SiteFooter,
    Testimonials,
} from '@/shared/components/shared/home';

export default function Home() {
    return (
        <>
            <Hero />
            <AboutUs />
            <HowItWorks />
            <Testimonials />
            <SiteFooter />
        </>
    );
}
