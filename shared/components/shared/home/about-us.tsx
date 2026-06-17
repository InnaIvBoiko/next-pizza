import React from 'react';
import Image from 'next/image';
import { ChefHat, Flame, Leaf } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';
import type { Dictionary } from '@/shared/lib/i18n/types';

interface Props {
    dict: Dictionary['home']['about'];
}

export const AboutUs: React.FC<Props> = ({ dict }) => {
    const points = [
        {
            icon: Flame,
            title: dict.point1Title,
            text: dict.point1Text,
        },
        {
            icon: Leaf,
            title: dict.point2Title,
            text: dict.point2Text,
        },
        {
            icon: ChefHat,
            title: dict.point3Title,
            text: dict.point3Text,
        },
    ];

    return (
        <section id='chi-siamo' className='scroll-mt-24 py-16 sm:py-24'>
            <Container className='px-4'>
                <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
                    {/* Image */}
                    <div className='glass relative aspect-4/3 w-full overflow-hidden rounded-[2rem]'>
                        <Image
                            src='/images/about-forno.png'
                            alt={dict.imageAlt}
                            fill
                            sizes='(max-width: 1024px) 100vw, 50vw'
                            className='object-cover'
                        />
                    </div>

                    {/* Copy */}
                    <div>
                        <span className='text-primary text-sm font-semibold tracking-wide uppercase'>
                            {dict.label}
                        </span>
                        <h2 className='mt-3 text-3xl font-extrabold text-balance sm:text-4xl'>
                            {dict.title}
                        </h2>
                        <p className='text-muted-foreground mt-4 text-base text-balance sm:text-lg'>
                            {dict.description}
                        </p>

                        <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                            {points.map(({ icon: Icon, title, text }) => (
                                <div
                                    key={title}
                                    className='glass rounded-2xl p-4'
                                >
                                    <Icon className='text-primary size-6' />
                                    <h3 className='mt-3 font-semibold'>
                                        {title}
                                    </h3>
                                    <p className='text-muted-foreground mt-1 text-sm'>
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
