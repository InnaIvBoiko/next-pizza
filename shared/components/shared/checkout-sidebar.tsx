import React from 'react';
import { WhiteBlock } from './white-block';
import { CheckoutItemDetails } from './checkout-item-details';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import { format } from '@/shared/lib/i18n/format';
import { DELIVERY_PRICE, VAT } from '@/shared/constants';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    totalAmount: number;
    loading?: boolean;
    className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
    totalAmount,
    loading,
    className,
}) => {
    const dict = useDictionary();
    const totalPrice = totalAmount + DELIVERY_PRICE;
    // VAT extracted (scorporata) from the VAT-inclusive total, shown for info only.
    const vatPrice = (totalPrice * VAT) / (100 + VAT);

    return (
        <WhiteBlock className={cn('sticky top-4 p-6', className)}>
            <div className='flex flex-col gap-1'>
                <span className='text-xl'>{dict.checkout.total}</span>
                {loading ? (
                    <Skeleton className='h-11 w-48' />
                ) : (
                    <span className='h-11 text-[34px] font-extrabold'>
                        {formatPrice(totalPrice)}
                    </span>
                )}
            </div>

            <CheckoutItemDetails
                title={
                    <div className='flex items-center'>
                        <Package size={18} className='mr-2 text-muted-foreground' />
                        {dict.checkout.productsTotal}
                    </div>
                }
                value={
                    loading ? (
                        <Skeleton className='h-6 w-16 rounded-[6px]' />
                    ) : (
                        formatPrice(totalAmount)
                    )
                }
            />
            <CheckoutItemDetails
                title={
                    <div className='flex items-center'>
                        <Truck size={18} className='mr-2 text-muted-foreground' />
                        {dict.checkout.delivery}
                    </div>
                }
                value={
                    loading ? (
                        <Skeleton className='h-6 w-16 rounded-[6px]' />
                    ) : (
                        formatPrice(DELIVERY_PRICE)
                    )
                }
            />
            <CheckoutItemDetails
                title={
                    <div className='flex items-center'>
                        <Percent size={18} className='mr-2 text-muted-foreground' />
                        {format(dict.checkout.vat, { vat: VAT })}
                    </div>
                }
                value={
                    loading ? (
                        <Skeleton className='h-6 w-16 rounded-[6px]' />
                    ) : (
                        formatPrice(vatPrice)
                    )
                }
            />

            <Button
                disabled={loading}
                type='submit'
                className='mt-6 h-14 w-full rounded-2xl text-base font-bold'
            >
                {dict.checkout.submit}
                <ArrowRight className='ml-2 w-5' />
            </Button>
        </WhiteBlock>
    );
};
