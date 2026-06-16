import React from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';

const reviews = [
    {
        name: 'Giulia R.',
        avatar: '/images/avatar-1.png',
        text: 'La margherita più buona della città. Impasto leggero e consegna sempre puntuale.',
    },
    {
        name: 'Marco T.',
        avatar: '/images/avatar-2.png',
        text: 'Ordino ogni venerdì. Arriva calda, fragrante e il sito è velocissimo.',
    },
    {
        name: 'Sara B.',
        avatar: '/images/avatar-3.png',
        text: 'Ingredienti di qualità che si sentono. Per me la migliore pizza a domicilio.',
    },
];

export const Testimonials: React.FC = () => {
    return (
        <section className='py-16 sm:py-24'>
            <Container className='px-4'>
                <div className='mx-auto max-w-2xl text-center'>
                    <span className='text-sm font-semibold tracking-wide text-primary uppercase'>
                        Testimonianze
                    </span>
                    <h2 className='mt-3 text-3xl font-extrabold text-balance sm:text-4xl'>
                        Cosa dicono i nostri clienti
                    </h2>
                </div>

                <div className='mt-12 grid gap-6 md:grid-cols-3'>
                    {reviews.map(({ name, avatar, text }) => (
                        <figure
                            key={name}
                            className='glass flex flex-col rounded-3xl p-6'
                        >
                            <Quote className='size-8 text-primary/30' />
                            <blockquote className='mt-4 flex-1 text-balance text-muted-foreground'>
                                “{text}”
                            </blockquote>

                            <figcaption className='mt-6 flex items-center gap-3'>
                                <Image
                                    src={avatar}
                                    alt={`Foto di ${name}`}
                                    width={44}
                                    height={44}
                                    className='size-11 rounded-full object-cover'
                                />
                                <div>
                                    <div className='font-semibold'>{name}</div>
                                    <div className='flex'>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className='size-3.5 fill-primary text-primary'
                                            />
                                        ))}
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Container>
        </section>
    );
};
