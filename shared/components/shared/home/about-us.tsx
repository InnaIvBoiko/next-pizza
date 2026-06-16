import React from 'react';
import Image from 'next/image';
import { ChefHat, Flame, Leaf } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';

const points = [
    {
        icon: Flame,
        title: 'Forno a legna',
        text: 'Cotta a 450°C in 90 secondi, per un cornicione alveolato e leggero.',
    },
    {
        icon: Leaf,
        title: 'Ingredienti DOP',
        text: 'Pomodoro San Marzano, mozzarella di bufala e basilico fresco.',
    },
    {
        icon: ChefHat,
        title: 'Mani esperte',
        text: 'Pizzaioli napoletani e impasto a 48 ore di lievitazione.',
    },
];

export const AboutUs: React.FC = () => {
    return (
        <section id='chi-siamo' className='scroll-mt-24 py-16 sm:py-24'>
            <Container className='px-4'>
                <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
                    {/* Image */}
                    <div className='glass relative aspect-4/3 w-full overflow-hidden rounded-[2rem]'>
                        <Image
                            src='/images/about-forno.png'
                            alt='Pizzaiolo che inforna nel forno a legna'
                            fill
                            sizes='(max-width: 1024px) 100vw, 50vw'
                            className='object-cover'
                        />
                    </div>

                    {/* Copy */}
                    <div>
                        <span className='text-primary text-sm font-semibold tracking-wide uppercase'>
                            Chi siamo
                        </span>
                        <h2 className='mt-3 text-3xl font-extrabold text-balance sm:text-4xl'>
                            Dal 2010, la tradizione napoletana
                        </h2>
                        <p className='text-muted-foreground mt-4 text-base text-balance sm:text-lg'>
                            Siamo nati da una piccola pizzeria di quartiere con
                            un&apos;idea semplice: portare in tavola la pizza
                            come si fa a Napoli. Niente scorciatoie, solo
                            materie prime selezionate e tanta passione.
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
