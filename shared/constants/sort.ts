// Locale-independent sort option keys, shared between the SortPopup (client)
// and the menu page (server) so both agree on what's valid. Display labels
// live in the dictionaries under `sort.options`.

export const sortOptions = ['popular', 'priceAsc', 'priceDesc', 'newest'] as const;

export type SortOption = (typeof sortOptions)[number];

// `popular` is the natural menu order, so it stays out of the URL.
export const defaultSort: SortOption = 'popular';

// Coerce an untrusted URL value to a known option, falling back to the default.
export const parseSort = (value?: string | null): SortOption =>
    sortOptions.includes(value as SortOption)
        ? (value as SortOption)
        : defaultSort;
