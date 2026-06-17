import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Star } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';
import { Button } from '@/shared/components/ui';
import type { Dictionary } from '@/shared/lib/i18n/types';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    dict: Dictionary['home']['hero'];
    lang: Locale;
}

export const Hero: React.FC<Props> = ({ dict, lang }) => {
    return (
        <section className='relative overflow-hidden'>
            <div className='glow-warm pointer-events-none absolute inset-0 -z-10' />

            <Container className='px-4 pt-14 pb-10 sm:pt-20 md:pt-28 lg:pb-20'>
                <div className='grid items-center gap-10 lg:grid-cols-2'>
                    {/* Copy */}
                    <div className='text-center lg:text-left'>
                        <span className='glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium'>
                            <Leaf className='text-success size-4' />
                            {dict.badge}
                        </span>

                        <h1 className='mt-6 text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl md:text-6xl'>
                            {dict.title}
                        </h1>

                        <p className='text-muted-foreground mx-auto mt-5 max-w-xl text-base text-balance sm:text-lg lg:mx-0'>
                            {dict.description}
                        </p>

                        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start'>
                            <Button
                                asChild
                                size='lg'
                                className='w-full rounded-full px-8 sm:w-auto'
                            >
                                <Link href={localizeHref(lang, '/menu')}>
                                    {dict.orderNow}
                                    <ArrowRight className='ml-2 size-5' />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size='lg'
                                variant='outline'
                                className='w-full rounded-full px-8 sm:w-auto'
                            >
                                <Link href='#come-funziona'>
                                    {dict.howItWorks}
                                </Link>
                            </Button>
                        </div>

                        {/* Trust row */}
                        <div className='text-muted-foreground mt-8 flex items-center justify-center gap-2 text-sm lg:justify-start'>
                            <span className='flex'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className='fill-primary text-primary size-4'
                                    />
                                ))}
                            </span>
                            <span>
                                <strong className='text-foreground'>
                                    {dict.rating}
                                </strong>{' '}
                                · {dict.trust}
                            </span>
                        </div>
                    </div>

                    {/* Image */}
                    <div className='relative order-first lg:order-0'>
                        <div className='glass relative aspect-4/3 w-full overflow-hidden rounded-[2rem]'>
                            <Image
                                src='/images/hero-pizza.png'
                                alt={dict.imageAlt}
                                fill
                                priority
                                sizes='(max-width: 1024px) 100vw, 50vw'
                                className='object-cover'
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
