'use client';

import { Title } from './title';
import { Input, RangeSlider } from '../ui';
// import { FilterCheckbox } from './filter-checkbox';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilters, useIngredients, useQueryFilters } from '@/shared/hooks';
import {
    useDictionary,
    useLocale,
} from '@/shared/components/shared/i18n/dictionary-provider';
import { localizeName } from '@/shared/lib/i18n/localize-name';

export interface FiltersProps {
    className?: string;
}

const MIN_PRICE = 0;
const MAX_PRICE = 50;

// Hide the native number-input spinner arrows
const noSpinner =
    '[appearance:textfield] [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:m-0';

export const Filters = ({ className }: FiltersProps) => {
    const dict = useDictionary();
    const locale = useLocale();
    const { ingredients, loading } = useIngredients();
    const filters = useFilters();
    const {
        selectedIngredients,
        setSelectedIngredients,
        sizes,
        setSizes,
        pizzaTypes,
        setPizzaTypes,
        prices,
        setPrices,
    } = filters;

    // Mirror the whole selection into the URL (ingredients, sizes,
    // pizzaTypes, priceFrom, priceTo).
    useQueryFilters(filters);

    const items = ingredients.map(ingredient => ({
        text: localizeName(ingredient, locale),
        value: String(ingredient.id),
    }));

    const updatePrices = (values: number[]) => {
        setPrices('priceFrom', values[0]);
        setPrices('priceTo', values[1]);
    };

    return (
        <div className={className}>
            <Title
                text={dict.filters.title}
                size='sm'
                className='mb-5 font-bold'
            />

            {/* <div className='mb-5 flex flex-col gap-4'>
                <FilterCheckbox text='Can be collected' value='1' />
                <FilterCheckbox text='New products' value='2' />
            </div> */}

            <CheckboxFiltersGroup
                title={dict.filters.doughType}
                name='pizzaTypes'
                className='mb-5'
                items={[
                    { text: dict.filters.doughThin, value: '1' },
                    { text: dict.filters.doughTraditional, value: '2' },
                ]}
                selected={pizzaTypes}
                onClickCheckbox={setPizzaTypes}
            />

            <CheckboxFiltersGroup
                title={dict.filters.sizes}
                name='sizes'
                className='mb-5'
                items={[
                    { text: dict.filters.size20, value: '20' },
                    { text: dict.filters.size30, value: '30' },
                    { text: dict.filters.size40, value: '40' },
                ]}
                selected={sizes}
                onClickCheckbox={setSizes}
            />

            <div className='mt-5 border-y border-y-border py-6 pb-7'>
                <p className='mb-3 font-bold'>{dict.filters.priceRange}</p>
                <div className='mb-5 flex gap-3'>
                    <Input
                        type='number'
                        placeholder='0'
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={String(prices.priceFrom ?? MIN_PRICE)}
                        className={noSpinner}
                        onChange={e =>
                            setPrices('priceFrom', Number(e.target.value))
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
                            setPrices('priceTo', Number(e.target.value))
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
                title={dict.filters.ingredients}
                name='ingredients'
                className='mt-5'
                limit={6}
                defaultItems={items.slice(0, 6)}
                items={items}
                loading={loading}
                selected={selectedIngredients}
                onClickCheckbox={setSelectedIngredients}
            />
        </div>
    );
};
