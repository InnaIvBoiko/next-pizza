// Orders store the cart snapshot as a JSON string; parse it defensively and
// build a short "name × qty · ..." summary for display.
type ParsedItem = {
    quantity: number;
    productItem?: { product?: { name?: string } };
};

const parseOrderItems = (raw: unknown): ParsedItem[] => {
    try {
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(value) ? (value as ParsedItem[]) : [];
    } catch {
        return [];
    }
};

export const orderItemsSummary = (raw: unknown): string =>
    parseOrderItems(raw)
        .filter(item => item.productItem?.product?.name)
        .map(item => `${item.productItem!.product!.name} × ${item.quantity}`)
        .join(' · ');
