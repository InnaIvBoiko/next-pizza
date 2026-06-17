import React from 'react';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, Pizza } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';
import type { Dictionary } from '@/shared/lib/i18n/types';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import { format } from '@/shared/lib/i18n/format';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    dict: Dictionary['home']['footer'];
    lang: Locale;
}

export const SiteFooter: React.FC<Props> = ({ dict, lang }) => {
    const year = new Date().getFullYear();

    return (
        <footer className='mt-8 border-t border-border'>
            <Container className='px-4 py-12'>
                <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <Link
                            href={localizeHref(lang, '/')}
                            className='flex items-center gap-2 font-extrabold'
                        >
                            <Pizza className='size-6 text-primary' />
                            Next Pizza
                        </Link>
                        <p className='mt-3 text-sm text-muted-foreground'>
                            {dict.tagline}
                        </p>
                    </div>

                    <nav className='text-sm'>
                        <h3 className='font-semibold'>{dict.menuSection}</h3>
                        <ul className='mt-3 space-y-2 text-muted-foreground'>
                            <li>
                                <Link
                                    href={localizeHref(lang, '/menu')}
                                    className='transition-colors hover:text-foreground'
                                >
                                    {dict.allPizzas}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='#come-funziona'
                                    className='transition-colors hover:text-foreground'
                                >
                                    {dict.howItWorks}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='#chi-siamo'
                                    className='transition-colors hover:text-foreground'
                                >
                                    {dict.aboutUs}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='text-sm'>
                        <h3 className='font-semibold'>{dict.contactSection}</h3>
                        <ul className='mt-3 space-y-2 text-muted-foreground'>
                            <li className='flex items-center gap-2'>
                                <Phone className='size-4 text-primary' /> +39 02
                                1234 5678
                            </li>
                            <li className='flex items-center gap-2'>
                                <Mail className='size-4 text-primary' />{' '}
                                ciao@nextpizza.it
                            </li>
                            <li className='flex items-center gap-2'>
                                <MapPin className='size-4 text-primary' /> Via
                                Roma 1, Milano
                            </li>
                        </ul>
                    </div>

                    <div className='text-sm'>
                        <h3 className='font-semibold'>{dict.hoursSection}</h3>
                        <ul className='mt-3 space-y-2 text-muted-foreground'>
                            <li className='flex items-center gap-2'>
                                <Clock className='size-4 text-primary' />{' '}
                                {dict.days}
                            </li>
                            <li>{dict.hours}</li>
                        </ul>
                    </div>
                </div>

                <div className='mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground'>
                    {format(dict.copyright, { year })}
                </div>
            </Container>
        </footer>
    );
};
