'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@/generated/prisma/client';

import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { IngredientItem } from './ingredient-item';
import { cn } from '@/shared/lib/utils';
import { getPizzaDetails, formatPrice } from '@/shared/lib';
import { buildPizzaTypeVariants } from '@/shared/lib/pizza-labels';
import { format } from '@/shared/lib/i18n/format';
import { usePizzaOptions } from '@/shared/hooks';
import { useDictionary, useLocale } from './i18n/dictionary-provider';
import { localizeName } from '@/shared/lib/i18n/localize-name';

interface Props {
    imageUrl: string;
    name: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    onSubmit: (itemId: number, ingredients: number[]) => void;
    className?: string;
}

/**
 * Form for choosing pizza options
 */
export const ChoosePizzaForm: React.FC<Props> = ({
    name,
    items,
    imageUrl,
    ingredients,
    loading,
    onSubmit,
    className,
}) => {
    const dict = useDictionary();
    const locale = useLocale();
    const {
        size,
        type,
        selectedIngredients,
        availableSizes,
        currentItemId,
        setSize,
        setType,
        addIngredient,
    } = usePizzaOptions(items);

    const { totalPrice, textDetaills } = getPizzaDetails(
        type,
        size,
        items,
        ingredients,
        selectedIngredients,
        dict
    );

    const handleClickAdd = () => {
        if (currentItemId) {
            onSubmit(currentItemId, Array.from(selectedIngredients));
        }
    };

    return (
        <div className={cn(className, 'flex flex-1 flex-col lg:flex-row')}>
            <PizzaImage imageUrl={imageUrl} size={size} />

            <div className='w-full bg-card p-5 sm:p-7 lg:w-122.5'>
                <Title text={name} size='md' className='mb-1 font-extrabold' />

                <p className='text-muted-foreground'>{textDetaills}</p>

                <div className='mt-5 flex flex-col gap-4'>
                    <GroupVariants
                        items={availableSizes}
                        value={String(size)}
                        onClick={value => setSize(Number(value) as PizzaSize)}
                    />

                    <GroupVariants
                        items={buildPizzaTypeVariants(dict)}
                        value={String(type)}
                        onClick={value => setType(Number(value) as PizzaType)}
                    />
                </div>

                <div className='scrollbar mt-5 h-64 overflow-auto rounded-md bg-muted p-4 sm:p-5 lg:h-105'>
                    <div className='grid grid-cols-3 gap-3'>
                        {ingredients.map(ingredient => (
                            <IngredientItem
                                key={ingredient.id}
                                name={localizeName(ingredient, locale)}
                                price={ingredient.price}
                                imageUrl={ingredient.imageUrl}
                                onClick={() => addIngredient(ingredient.id)}
                                active={selectedIngredients.has(ingredient.id)}
                                disabled={!ingredient.available}
                                unavailableLabel={dict.inventory.unavailable}
                            />
                        ))}
                    </div>
                </div>

                <Button
                    onClick={handleClickAdd}
                    className='mt-10 h-13.75 w-full rounded-[18px] px-10 text-base'
                    disabled={loading}
                >
                    {loading
                        ? dict.product.adding
                        : format(dict.product.addToCart, {
                              price: formatPrice(totalPrice),
                          })}
                </Button>
            </div>
        </div>
    );
};
