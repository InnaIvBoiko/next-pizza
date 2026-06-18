import type { OrderStatus } from '@/generated/prisma/client';

// Statuses considered "in progress" (not yet completed or cancelled). Used to
// surface the current order prominently and keep it out of the past list.
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
    'PENDING',
    'SUCCEEDED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
];

/** Pull the most recent active order out of a (newest-first) order list. */
export const splitActiveOrder = <T extends { id: number; status: OrderStatus }>(
    orders: T[]
): { activeOrder: T | undefined; pastOrders: T[] } => {
    const activeOrder = orders.find(order =>
        ACTIVE_ORDER_STATUSES.includes(order.status)
    );
    const pastOrders = activeOrder
        ? orders.filter(order => order.id !== activeOrder.id)
        : orders;
    return { activeOrder, pastOrders };
};
