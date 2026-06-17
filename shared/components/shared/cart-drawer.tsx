'use client';

import React from 'react';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight, PackageOpen } from 'lucide-react';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails, formatPrice } from '@/shared/lib';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { useCart } from '@/shared/hooks';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { totalAmount, updateItemQuantity, items, removeCartItem } =
        useCart();
    const [redirecting, setRedirecting] = React.useState(false);

    const onClickCountButton = (
        id: number,
        quantity: number,
        type: 'plus' | 'minus'
    ) => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent className='flex flex-col justify-between bg-background px-6 pb-0'>
                <SheetDescription className='sr-only'>
                    Gli articoli selezionati e il totale dell&apos;ordine
                </SheetDescription>

                <div
                    className={cn(
                        'flex h-full flex-col',
                        !totalAmount && 'justify-center'
                    )}
                >
                    {totalAmount > 0 ? (
                        <SheetHeader>
                            <SheetTitle>
                                Nel carrello{' '}
                                <span className='font-bold'>
                                    {items.length} articoli
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                    ) : (
                        <SheetTitle className='sr-only'>Carrello</SheetTitle>
                    )}

                    {!totalAmount && (
                        <div className='mx-auto flex w-72 flex-col items-center justify-center'>
                            <PackageOpen
                                className='text-muted-foreground'
                                size={120}
                                strokeWidth={1}
                            />
                            <Title
                                size='sm'
                                text='Il tuo carrello è vuoto'
                                className='my-2 text-center font-bold'
                            />
                            <p className='mb-5 text-center text-muted-foreground'>
                                Aggiungi qualcosa al carrello
                            </p>

                            <SheetClose asChild>
                                <Button
                                    className='h-12 w-56 text-base'
                                    size='lg'
                                >
                                    <ArrowLeft className='mr-2 w-5' />
                                    Torna indietro
                                </Button>
                            </SheetClose>
                        </div>
                    )}

                    {totalAmount > 0 && (
                        <>
                            <div className='-mx-6 mt-5 flex-1 overflow-auto'>
                                {items.map(item => (
                                    <div key={item.id} className='mb-2'>
                                        <CartDrawerItem
                                            id={item.id}
                                            imageUrl={item.imageUrl}
                                            details={getCartItemDetails(
                                                item.ingredients,
                                                item.pizzaType as PizzaType,
                                                item.pizzaSize as PizzaSize
                                            )}
                                            disabled={item.disabled}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            onClickCountButton={type =>
                                                onClickCountButton(
                                                    item.id,
                                                    item.quantity,
                                                    type
                                                )
                                            }
                                            onClickRemove={() =>
                                                removeCartItem(item.id)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <SheetFooter className='-mx-6 bg-card p-8'>
                                <div className='w-full'>
                                    <div className='mb-4 flex'>
                                        <span className='flex flex-1 text-lg text-muted-foreground'>
                                            Totale
                                            <div className='relative -top-1 mx-2 flex-1 border-b border-dashed border-b-border' />
                                        </span>

                                        <span className='text-lg font-bold'>
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>

                                    <Link href='/checkout'>
                                        <Button
                                            onClick={() => setRedirecting(true)}
                                            disabled={redirecting}
                                            aria-busy={redirecting}
                                            type='submit'
                                            className='h-12 w-full text-base'
                                        >
                                            {redirecting
                                                ? 'Caricamento...'
                                                : 'Vai al pagamento'}
                                            <ArrowRight className='ml-2 w-5' />
                                        </Button>
                                    </Link>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
