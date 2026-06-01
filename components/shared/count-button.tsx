import React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    value?: number;
    size?: 'sm' | 'lg';
    className?: string;
}

export const CountButton: React.FC<Props> = ({
    className,
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
                variant='outline'
                className={cn(
                    'hover:bg-primary p-0 hover:text-white',
                    size === 'sm'
                        ? 'h-7.5 w-7.5 rounded-sm'
                        : 'h-9.5unded-se-md w-9.5'
                )}
            >
                <Minus className={size === 'sm' ? 'h-4' : 'h-5'} />
            </Button>
            <b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value}</b>
            <Button
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
