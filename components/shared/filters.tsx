'use client';

import React from 'react';
import { Title } from './title';
import { Input, RangeSlider } from '../ui';
import { FilterCheckbox } from './filter-checkbox';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
// import { useQueryFilters, useIngredients, useFilters } from '@/hooks';

export interface FiltersProps {
    className?: string;
}

interface PriceProps {
    priceFrom?: number;
    priceTo?: number;
}

const MIN_PRICE = 0;
const MAX_PRICE = 50;

// Hide the native number-input spinner arrows
const noSpinner =
    '[appearance:textfield] [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:m-0';

const items = [
    { value: '1', text: 'Tomato' },
    { value: '2', text: 'Cheese' },
    { value: '3', text: 'Pepperoni' },
    { value: '4', text: 'Mushrooms' },
    { value: '5', text: 'Onions' },
    { value: '6', text: 'Olives' },
    { value: '7', text: 'Basil' },
    { value: '8', text: 'Spinach' },
    { value: '9', text: 'Garlic' },
    { value: '10', text: 'Pineapple' },
];

export const Filters = ({ className }: FiltersProps) => {
    const [prices, setPrices] = React.useState<PriceProps>({});

    const updatePrice = (name: keyof PriceProps, value: number) => {
        setPrices({ ...prices, [name]: value });
    };

    const updatePrices = (values: number[]) => {
        setPrices({ priceFrom: values[0], priceTo: values[1] });
    };

    return (
        <div className={className}>
            <Title text='Filtration' size='sm' className='mb-5 font-bold' />

            <div className='mb-5 flex flex-col gap-4'>
                <FilterCheckbox text='Can be collected' value='1' />
                <FilterCheckbox text='New products' value='2' />
            </div>

            <CheckboxFiltersGroup
                title='Pizza Types'
                name='pizzaTypes'
                className='mb-5'
                items={[
                    { text: 'Thin', value: '1' },
                    { text: 'Traditional', value: '2' },
                ]}
            />

            <CheckboxFiltersGroup
                title='Sizes'
                name='sizes'
                className='mb-5'
                items={[
                    { text: '20 cm', value: '20' },
                    { text: '30 cm', value: '30' },
                    { text: '40 cm', value: '40' },
                ]}
            />

            <div className='mt-5 border-y border-y-neutral-100 py-6 pb-7'>
                <p className='mb-3 font-bold'>Price from and to:</p>
                <div className='mb-5 flex gap-3'>
                    <Input
                        type='number'
                        placeholder='0'
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={String(prices.priceFrom ?? MIN_PRICE)}
                        className={noSpinner}
                        onChange={e =>
                            updatePrice('priceFrom', Number(e.target.value))
                        }
                    />
                    <Input
                        type='number'
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        placeholder='50'
                        value={String(prices.priceTo ?? MAX_PRICE)}
                        className={noSpinner}
                        onChange={e =>
                            updatePrice('priceTo', Number(e.target.value))
                        }
                    />
                </div>
                <RangeSlider
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={0.5}
                    value={[
                        prices.priceFrom ?? MIN_PRICE,
                        prices.priceTo ?? MAX_PRICE,
                    ]}
                    onValueChange={updatePrices}
                />
            </div>

            <CheckboxFiltersGroup
                title='Ingredients'
                name='ingredients'
                className='mt-5'
                limit={6}
                defaultItems={items.slice(0, 6)}
                items={items}
                loading={false}
            />
        </div>
    );
};
