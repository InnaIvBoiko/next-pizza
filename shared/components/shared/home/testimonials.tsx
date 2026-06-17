import React from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';
import type { Dictionary } from '@/shared/lib/i18n/types';
import { format } from '@/shared/lib/i18n/format';

interface Props {
    dict: Dictionary['home']['testimonials'];
}

export const Testimonials: React.FC<Props> = ({ dict }) => {
    const reviews = [
        {
            name: dict.review1Name,
            avatar: '/images/avatar-1.png',
            text: dict.review1Text,
        },
        {
            name: dict.review2Name,
            avatar: '/images/avatar-2.png',
            text: dict.review2Text,
        },
        {
            name: dict.review3Name,
            avatar: '/images/avatar-3.png',
            text: dict.review3Text,
        },
    ];

    return (
        <section className='py-16 sm:py-24'>
            <Container className='px-4'>
                <div className='mx-auto max-w-2xl text-center'>
                    <span className='text-sm font-semibold tracking-wide text-primary uppercase'>
                        {dict.label}
                    </span>
                    <h2 className='mt-3 text-3xl font-extrabold text-balance sm:text-4xl'>
                        {dict.title}
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
                                    alt={format(dict.photoAlt, { name })}
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
