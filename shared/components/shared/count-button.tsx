import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface Props {
    value?: number;
    size?: 'sm' | 'lg';
    onClick?: (type: 'plus' | 'minus') => void;
    className?: string;
}

export const CountButton: React.FC<Props> = ({
    className,
    onClick,
    value = 1,
    size = 'sm',
}) => {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-between gap-3',
                className
            )}
        >
            <Button
                data-testid='count-minus'
                onClick={() => onClick?.('minus')}
                disabled={value === 1}
                variant='outline'
                className={cn(
                    'hover:bg-primary p-0 hover:text-white',
                    size === 'sm'
                        ? 'h-7.5 w-7.5 rounded-sm'
                        : 'h-9.5 w-9.5 rounded-md'
                )}
            >
                <Minus className={size === 'sm' ? 'h-4' : 'h-5'} />
            </Button>
            <b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value}</b>
            <Button
                data-testid='count-plus'
                onClick={() => onClick?.('plus')}
                variant='outline'
                className={cn(
                    'hover:bg-primary p-0 hover:text-white',
                    size === 'sm'
                        ? 'h-7.5 w-7.5 rounded-sm'
                        : 'h-9.5 w-9.5 rounded-md'
                )}
            >
                <Plus className={size === 'sm' ? 'h-4' : 'h-5'} />
            </Button>
        </div>
    );
};
