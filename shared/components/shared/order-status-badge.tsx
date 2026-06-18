import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { OrderStatus } from '@/generated/prisma/client';

// Theme-token colors so it reads in light and dark.
const statusStyles: Record<OrderStatus, string> = {
    PENDING: 'bg-muted text-muted-foreground',
    SUCCEEDED: 'bg-primary/10 text-primary',
    PREPARING: 'bg-primary/10 text-primary',
    READY: 'bg-success/15 text-success',
    OUT_FOR_DELIVERY: 'bg-success/15 text-success',
    DELIVERED: 'bg-success text-success-foreground',
    CANCELLED: 'bg-destructive/10 text-destructive',
};

interface Props {
    status: OrderStatus;
    label: string;
    className?: string;
}

export const OrderStatusBadge: React.FC<Props> = ({
    status,
    label,
    className,
}) => (
    <span
        className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
            statusStyles[status],
            className
        )}
    >
        <span className='size-1.5 rounded-full bg-current' />
        {label}
    </span>
);
