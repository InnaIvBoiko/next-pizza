'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export type Variant = {
    name: string;
    value: string;
    disabled?: boolean;
};

interface Props {
    items: readonly Variant[];
    onClick?: (value: Variant['value']) => void;
    value?: Variant['value'];
    className?: string;
}

export const GroupVariants: React.FC<Props> = ({
    items,
    onClick,
    className,
    value,
}) => {
    return (
        <div
            className={cn(
                className,
                'flex justify-between rounded-3xl bg-muted p-1 select-none'
            )}
        >
            {items.map(item => (
                <button
                    key={item.name}
                    onClick={() => onClick?.(item.value)}
                    className={cn(
                        'flex h-7.5 flex-1 cursor-pointer items-center justify-center rounded-3xl px-5 text-sm transition-all duration-400',
                        {
                            'bg-card shadow': item.value === value,
                            'pointer-events-none text-muted-foreground opacity-50':
                                item.disabled,
                        }
                    )}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};
