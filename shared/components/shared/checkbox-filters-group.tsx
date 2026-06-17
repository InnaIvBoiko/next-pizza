'use client';

import React from 'react';
import { FilterCheckbox } from './';
import { FilterCheckboxProps } from './filter-checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui';
import { useDictionary } from '@/shared/components/shared/i18n/dictionary-provider';

type Item = FilterCheckboxProps;

interface Props {
    title: string;
    items: Item[];
    defaultItems?: Item[];
    limit?: number;
    loading?: boolean;
    searchInputPlaceholder?: string;
    onClickCheckbox?: (id: string) => void;
    defaultValue?: string[];
    selected?: Set<string>;
    className?: string;
    name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
    title,
    items,
    defaultItems,
    limit = 5,
    searchInputPlaceholder,
    className,
    loading,
    onClickCheckbox,
    selected,
    name,
}) => {
    const dict = useDictionary();
    const placeholder = searchInputPlaceholder ?? dict.filters.searchPlaceholder;
    const [showAll, setShowAll] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    if (loading) {
        return (
            <div className={className}>
                <p className='mb-3 font-bold'>{title}</p>

                {...Array(limit)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton
                            key={index}
                            className='mb-4 h-6 rounded-[8px]'
                        />
                    ))}

                <Skeleton className='mb-4 h-6 w-28 rounded-[8px]' />
            </div>
        );
    }

    const list = showAll
        ? items.filter(item =>
              item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())
          )
        : (defaultItems || items).slice(0, limit);

    return (
        <div className={className}>
            <p className='mb-3 font-bold'>{title}</p>

            {showAll && (
                <div className='mb-5'>
                    <Input
                        onChange={onChangeSearchInput}
                        placeholder={placeholder}
                        className='border-none bg-muted'
                    />
                </div>
            )}

            <div className='scrollbar flex max-h-96 flex-col gap-4 overflow-auto pr-2'>
                {list.map((item, index) => (
                    <FilterCheckbox
                        key={index}
                        text={item.text}
                        value={item.value}
                        endAdornment={item.endAdornment}
                        checked={selected?.has(item.value)}
                        onCheckedChange={() => onClickCheckbox?.(item.value)}
                        name={name}
                    />
                ))}
            </div>

            {items.length > limit && (
                <div
                    className={
                        showAll ? 'mt-4 border-t border-t-border' : ''
                    }
                >
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className='text-primary mt-3'
                    >
                        {showAll ? dict.filters.hide : dict.filters.showAll}
                    </button>
                </div>
            )}
        </div>
    );
};
