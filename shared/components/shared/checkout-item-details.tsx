import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    title?: React.ReactNode;
    value?: React.ReactNode;
    className?: string;
}

export const CheckoutItemDetails: React.FC<Props> = ({
    title,
    value,
    className,
}) => {
    return (
        <div className={cn('my-4 flex', className)}>
            <span className='flex flex-1 text-lg text-muted-foreground'>
                {title}
                <div className='relative -top-1 mx-2 flex-1 border-b border-dashed border-b-border' />
            </span>

            <span className='text-lg font-bold'>{value}</span>
        </div>
    );
};
