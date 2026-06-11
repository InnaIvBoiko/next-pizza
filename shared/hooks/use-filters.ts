import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';

export interface PriceProps {
    priceFrom?: number;
    priceTo?: number;
}

export interface Filters {
    sizes: Set<string>;
    pizzaTypes: Set<string>;
    selectedIngredients: Set<string>;
    prices: PriceProps;
}

export interface ReturnProps extends Filters {
    setPrices: (name: keyof PriceProps, value?: number) => void;
    setPizzaTypes: (value: string) => void;
    setSizes: (value: string) => void;
    setSelectedIngredients: (value: string) => void;
}

// ?key=2,8,6 -> Set{'2','8','6'} (drops empty entries from a bare "?key=")
const toSet = (value: string | null) =>
    new Set<string>(value?.split(',').filter(Boolean));

export const useFilters = (): ReturnProps => {
    const searchParams = useSearchParams();

    // Seed every filter from the URL so a shared/bookmarked link, and the
    // server, restore the exact same selection.
    const [selectedIngredients, { toggle: setSelectedIngredients }] = useSet(
        toSet(searchParams.get('ingredients'))
    );
    const [sizes, { toggle: setSizes }] = useSet(
        toSet(searchParams.get('sizes'))
    );
    const [pizzaTypes, { toggle: setPizzaTypes }] = useSet(
        toSet(searchParams.get('pizzaTypes'))
    );

    const [prices, setPricesState] = React.useState<PriceProps>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined,
    });

    // Functional update so the range slider can set both bounds in a row
    // without one call clobbering the other.
    const setPrices = (name: keyof PriceProps, value?: number) => {
        setPricesState(prev => ({ ...prev, [name]: value }));
    };

    return {
        sizes,
        pizzaTypes,
        selectedIngredients,
        prices,
        setPrices,
        setPizzaTypes,
        setSizes,
        setSelectedIngredients,
    };
};
