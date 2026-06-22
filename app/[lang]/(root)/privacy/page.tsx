import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { isLocale } from '@/shared/constants/i18n';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/shared/container';
import { localizeHref } from '@/shared/lib/i18n/localize-href';

export const metadata: Metadata = { title: 'Next Pizza | Privacy Policy' };

const contentIt = {
    sections: [
        {
            heading: 'Titolare del trattamento',
            body: 'Next Pizza S.r.l. (di seguito "Titolare"). Per esercitare i tuoi diritti o per qualsiasi domanda scrivici a: privacy@nextpizza.it',
        },
        {
            heading: 'Dati raccolti',
            body: 'Raccogliamo: nome, cognome, indirizzo e-mail, numero di telefono, indirizzo di consegna e cronologia degli ordini. I dati vengono forniti direttamente dall\'utente al momento della registrazione, dell\'autenticazione tramite Google o durante il processo di acquisto.',
        },
        {
            heading: 'Finalità del trattamento',
            body: 'I dati sono trattati per: (a) eseguire e gestire gli ordini; (b) inviare conferme d\'ordine e comunicazioni relative alla consegna; (c) autenticazione e sicurezza dell\'account; (d) adempiere agli obblighi di legge (fiscali e contabili).',
        },
        {
            heading: 'Responsabili del trattamento (Data Processors)',
            body: 'Per erogare il servizio ci avvaliamo di terze parti: Google LLC (autenticazione OAuth), Stripe Inc. (elaborazione pagamenti), Resend Inc. (invio e-mail transazionali) e Neon Inc. (database cloud). Ciascun fornitore agisce come responsabile del trattamento ai sensi dell\'art. 28 GDPR e garantisce un livello di protezione adeguato.',
        },
        {
            heading: 'Conservazione dei dati',
            body: 'I dati personali sono conservati per la durata del rapporto contrattuale e per i successivi 10 anni, come richiesto dalla normativa fiscale italiana. I dati dell\'account possono essere cancellati in qualsiasi momento tramite la funzione "Elimina account" nel profilo utente.',
        },
        {
            heading: 'Diritti dell\'interessato',
            body: 'Hai il diritto di: accedere ai tuoi dati (art. 15 GDPR), rettificarli (art. 16), cancellarli (art. 17), limitarne il trattamento (art. 18), riceverli in formato portabile (art. 20) e opporti al trattamento (art. 21). Puoi esercitare questi diritti scrivendo a privacy@nextpizza.it. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
        },
    ],
    cookieHeading: 'Cookie Policy',
    cookieSections: [
        {
            heading: 'Cookie tecnici necessari',
            body: 'Utilizziamo esclusivamente cookie tecnici necessari al funzionamento del sito: cookie di sessione (NextAuth) per mantenere l\'autenticazione, e un token di sessione per identificare il carrello. Questi cookie non richiedono il consenso dell\'utente poiché strettamente necessari all\'erogazione del servizio.',
        },
        {
            heading: 'Cookie di terze parti',
            body: 'Quando l\'utente sceglie di autenticarsi con Google, Google può impostare i propri cookie sul dominio google.com per gestire il processo OAuth. Next Pizza non ha controllo su questi cookie. Per maggiori informazioni consulta la privacy policy di Google (policies.google.com).',
        },
        {
            heading: 'Assenza di cookie di profilazione',
            body: 'Non utilizziamo Google Analytics, Facebook Pixel o qualsiasi altro strumento di tracciamento comportamentale. Non provendiamo dati a terzi per scopi pubblicitari.',
        },
    ],
    lastUpdated: 'Ultimo aggiornamento: giugno 2025',
};

const contentEn = {
    sections: [
        {
            heading: 'Data Controller',
            body: 'Next Pizza S.r.l. (hereinafter "Controller"). To exercise your rights or for any inquiry, contact us at: privacy@nextpizza.it',
        },
        {
            heading: 'Data Collected',
            body: 'We collect: first name, last name, email address, phone number, delivery address and order history. Data is provided directly by the user at registration, during Google authentication, or during the checkout process.',
        },
        {
            heading: 'Purposes of Processing',
            body: 'Data is processed to: (a) fulfil and manage orders; (b) send order confirmations and delivery notifications; (c) authentication and account security; (d) comply with legal obligations (tax and accounting).',
        },
        {
            heading: 'Data Processors',
            body: 'We use the following sub-processors: Google LLC (OAuth authentication), Stripe Inc. (payment processing), Resend Inc. (transactional email), and Neon Inc. (cloud database). Each provider acts as a data processor under GDPR art. 28 and ensures an adequate level of protection.',
        },
        {
            heading: 'Data Retention',
            body: 'Personal data is retained for the duration of the contractual relationship and for the following 10 years as required by Italian tax law. Account data can be deleted at any time via the "Delete account" feature in your profile.',
        },
        {
            heading: 'Your Rights',
            body: 'You have the right to: access your data (art. 15 GDPR), rectify it (art. 16), erase it (art. 17), restrict processing (art. 18), receive it in portable format (art. 20) and object to processing (art. 21). You can exercise these rights by writing to privacy@nextpizza.it. You also have the right to lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).',
        },
    ],
    cookieHeading: 'Cookie Policy',
    cookieSections: [
        {
            heading: 'Technically Necessary Cookies',
            body: 'We use only technically necessary cookies: session cookies (NextAuth) to maintain authentication, and a session token to identify the cart. These cookies do not require user consent as they are strictly necessary to provide the service.',
        },
        {
            heading: 'Third-party Cookies',
            body: 'When a user chooses to sign in with Google, Google may set its own cookies on the google.com domain to manage the OAuth flow. Next Pizza has no control over these cookies. For more information, see Google\'s privacy policy (policies.google.com).',
        },
        {
            heading: 'No Profiling Cookies',
            body: 'We do not use Google Analytics, Facebook Pixel or any other behavioural tracking tool. We do not sell data to third parties for advertising purposes.',
        },
    ],
    lastUpdated: 'Last updated: June 2025',
};

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();

    const dict = await getDictionary(lang);
    const content = lang === 'it' ? contentIt : contentEn;

    return (
        <Container className='my-12 max-w-3xl'>
            <Link
                href={localizeHref(lang, '/')}
                className='mb-8 inline-block text-sm text-muted-foreground hover:text-foreground'
            >
                ← {dict.privacy.backHome}
            </Link>

            <h1 className='mb-2 text-3xl font-extrabold'>{dict.privacy.title}</h1>
            <p className='mb-10 text-sm text-muted-foreground'>{content.lastUpdated}</p>

            <div className='space-y-8'>
                {content.sections.map((s) => (
                    <section key={s.heading}>
                        <h2 className='mb-2 text-lg font-semibold'>{s.heading}</h2>
                        <p className='text-sm leading-relaxed text-muted-foreground'>{s.body}</p>
                    </section>
                ))}
            </div>

            <h2 className='mb-6 mt-14 text-2xl font-bold'>{content.cookieHeading}</h2>

            <div className='space-y-8'>
                {content.cookieSections.map((s) => (
                    <section key={s.heading}>
                        <h2 className='mb-2 text-lg font-semibold'>{s.heading}</h2>
                        <p className='text-sm leading-relaxed text-muted-foreground'>{s.body}</p>
                    </section>
                ))}
            </div>
        </Container>
    );
}
