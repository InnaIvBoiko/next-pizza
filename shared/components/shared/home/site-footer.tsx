import React from 'react';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, Pizza } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';

export const SiteFooter: React.FC = () => {
    return (
        <footer className='mt-8 border-t border-border'>
            <Container className='px-4 py-12'>
                <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <Link
                            href='/'
                            className='flex items-center gap-2 font-extrabold'
                        >
                            <Pizza className='size-6 text-primary' />
                            Next Pizza
                        </Link>
                        <p className='mt-3 text-sm text-muted-foreground'>
                            La vera pizza napoletana, consegnata calda a casa
                            tua.
                        </p>
                    </div>

                    <nav className='text-sm'>
                        <h3 className='font-semibold'>Menu</h3>
                        <ul className='mt-3 space-y-2 text-muted-foreground'>
                            <li>
                                <Link
                                    href='/menu'
                                    className='transition-colors hover:text-foreground'
                                >
                                    Tutte le pizze
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='#come-funziona'
                                    className='transition-colors hover:text-foreground'
                                >
                                    Come funziona
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='#chi-siamo'
                                    className='transition-colors hover:text-foreground'
                                >
                                    Chi siamo
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='text-sm'>
                        <h3 className='font-semibold'>Contatti</h3>
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
                        <h3 className='font-semibold'>Orari</h3>
                        <ul className='mt-3 space-y-2 text-muted-foreground'>
                            <li className='flex items-center gap-2'>
                                <Clock className='size-4 text-primary' />{' '}
                                Lun–Dom
                            </li>
                            <li>11:00 – 23:00</li>
                        </ul>
                    </div>
                </div>

                <div className='mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground'>
                    © {new Date().getFullYear()} Next Pizza. Tutti i diritti
                    riservati.
                </div>
            </Container>
        </footer>
    );
};
