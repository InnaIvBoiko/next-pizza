import React from 'react';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export const IngredientItem: React.FC<Props> = ({
    className,
    active,
    price,
    name,
    imageUrl,
    onClick,
}) => {
    return (
        <div
            className={cn(
                'relative flex w-32 cursor-pointer flex-col items-center rounded-md bg-card p-1 text-center shadow-md',
                { 'border-primary border': active },
                className
            )}
            onClick={onClick}
        >
            {active && (
                <CircleCheck className='text-primary absolute top-2 right-2' />
            )}
            <Image width={110} height={110} src={imageUrl} alt={name} />
            <span className='mb-1 text-xs'>{name}</span>
            <span className='font-bold'>{formatPrice(price)}</span>
        </div>
    );
};
