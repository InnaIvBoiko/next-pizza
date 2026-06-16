import React from 'react';
import { ChefHat, MapPin, ShoppingBag, Truck } from 'lucide-react';
import { Container } from '@/shared/components/shared/container';

const steps = [
    {
        icon: ShoppingBag,
        title: 'Scegli',
        text: 'Componi la tua pizza dal menu e aggiungi al carrello.',
    },
    {
        icon: ChefHat,
        title: 'Prepariamo',
        text: 'I nostri pizzaioli infornano il tuo ordine al momento.',
    },
    {
        icon: Truck,
        title: 'Consegniamo',
        text: 'Ricevi la pizza calda a casa in circa 30 minuti.',
    },
];

export const HowItWorks: React.FC = () => {
    return (
        <section
            id='come-funziona'
            className='glow-warm scroll-mt-24 py-16 sm:py-24'
        >
            <Container className='px-4'>
                <div className='mx-auto max-w-2xl text-center'>
                    <span className='text-sm font-semibold tracking-wide text-primary uppercase'>
                        Come funziona
                    </span>
                    <h2 className='mt-3 text-3xl font-extrabold text-balance sm:text-4xl'>
                        Dalla scelta alla consegna in 3 passi
                    </h2>
                </div>

                <ol className='mt-12 grid gap-6 sm:grid-cols-3'>
                    {steps.map(({ icon: Icon, title, text }, i) => (
                        <li
                            key={title}
                            className='glass relative rounded-3xl p-6 text-center sm:text-left'
                        >
                            <span className='absolute top-6 right-6 text-5xl font-extrabold text-primary/15'>
                                {i + 1}
                            </span>
                            <div className='inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <Icon className='size-6' />
                            </div>
                            <h3 className='mt-4 text-lg font-bold'>{title}</h3>
                            <p className='mt-2 text-sm text-muted-foreground'>
                                {text}
                            </p>
                        </li>
                    ))}
                </ol>

                {/* Delivery info */}
                <div className='glass mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl p-6 text-center sm:flex-row sm:text-left'>
                    <div className='flex items-center gap-3'>
                        <MapPin className='size-6 shrink-0 text-primary' />
                        <p className='text-sm text-muted-foreground sm:text-base'>
                            Consegniamo in tutta la città · Lun–Dom 11:00–23:00
                        </p>
                    </div>
                    <p className='text-sm font-semibold text-success'>
                        Consegna gratuita sopra i 25€
                    </p>
                </div>
            </Container>
        </section>
    );
};
