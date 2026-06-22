import { describe, it, expect } from 'vitest';
import { ACTIVE_ORDER_STATUSES, splitActiveOrder } from '../order-status';
import type { OrderStatus } from '@/generated/prisma/client';

const order = (id: number, status: OrderStatus) => ({ id, status });

describe('ACTIVE_ORDER_STATUSES', () => {
    it('includes PENDING, SUCCEEDED, PREPARING, READY, OUT_FOR_DELIVERY', () => {
        expect(ACTIVE_ORDER_STATUSES).toContain('PENDING');
        expect(ACTIVE_ORDER_STATUSES).toContain('SUCCEEDED');
        expect(ACTIVE_ORDER_STATUSES).toContain('PREPARING');
        expect(ACTIVE_ORDER_STATUSES).toContain('READY');
        expect(ACTIVE_ORDER_STATUSES).toContain('OUT_FOR_DELIVERY');
    });

    it('does not include DELIVERED or CANCELLED', () => {
        expect(ACTIVE_ORDER_STATUSES).not.toContain('DELIVERED');
        expect(ACTIVE_ORDER_STATUSES).not.toContain('CANCELLED');
    });
});

describe('splitActiveOrder', () => {
    it('extracts the first active order', () => {
        const orders = [order(1, 'DELIVERED'), order(2, 'PREPARING'), order(3, 'DELIVERED')];
        const { activeOrder, pastOrders } = splitActiveOrder(orders);

        expect(activeOrder?.id).toBe(2);
        expect(pastOrders.map(o => o.id)).toEqual([1, 3]);
    });

    it('returns undefined activeOrder when none are active', () => {
        const orders = [order(1, 'DELIVERED'), order(2, 'CANCELLED')];
        const { activeOrder, pastOrders } = splitActiveOrder(orders);

        expect(activeOrder).toBeUndefined();
        expect(pastOrders).toHaveLength(2);
    });

    it('returns empty pastOrders when only one active order exists', () => {
        const { activeOrder, pastOrders } = splitActiveOrder([order(1, 'PENDING')]);

        expect(activeOrder?.id).toBe(1);
        expect(pastOrders).toHaveLength(0);
    });

    it('handles empty array', () => {
        const { activeOrder, pastOrders } = splitActiveOrder([]);
        expect(activeOrder).toBeUndefined();
        expect(pastOrders).toHaveLength(0);
    });
});
