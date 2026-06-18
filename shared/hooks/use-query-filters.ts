import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filters } from './use-filters';

export const useQueryFilters = (filters: Filters) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Read the latest sort selection inside the effect without making
    // searchParams a dependency — it changes on every navigation (including
    // the sort updates written by SortPopup), which would re-fire this effect.
    // Synced in its own effect so we never touch the ref during render.
    const searchParamsRef = React.useRef(searchParams);
    React.useEffect(() => {
        searchParamsRef.current = searchParams;
    });
    const isMounted = React.useRef(false);

    React.useEffect(() => {
        // Skip the first run: the page already loaded with the URL that seeded
        // these filters, so re-writing it would be a wasted server round-trip.
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const params = new URLSearchParams();

        const setList = (key: string, values: Set<string>) => {
            if (values.size > 0) params.set(key, Array.from(values).join(','));
        };

        // e.g. ?ingredients=2,8,6&sizes=30,40&pizzaTypes=1&priceFrom=10&priceTo=30
        setList('ingredients', filters.selectedIngredients);
        setList('sizes', filters.sizes);
        setList('pizzaTypes', filters.pizzaTypes);

        if (filters.prices.priceFrom) {
            params.set('priceFrom', String(filters.prices.priceFrom));
        }
        if (filters.prices.priceTo) {
            params.set('priceTo', String(filters.prices.priceTo));
        }

        // Carry over the sort selection, which SortPopup writes to the same
        // URL independently, so toggling a filter doesn't reset it.
        const sort = searchParamsRef.current.get('sort');
        if (sort) params.set('sort', sort);

        const query = params.toString();

        // replace (not push) so toggling a filter doesn't pollute history;
        // scroll:false keeps the user's place in the menu.
        router.replace(query ? `?${query}` : '?', { scroll: false });
        // `router` is intentionally omitted from the deps: its identity can
        // change after a navigation, which would re-run this effect and call
        // `router.replace` again — an infinite "Maximum update depth" loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filters.selectedIngredients,
        filters.sizes,
        filters.pizzaTypes,
        filters.prices,
    ]);
};
