'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { PizzaSize, PizzaType, pizzaTypes } from '@/shared/constants/pizza';
import { IngredientItem } from './ingredient-item';
import { cn } from '@/shared/lib/utils';
import { getPizzaDetails, formatPrice } from '@/shared/lib';
import { usePizzaOptions } from '@/shared/hooks';

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
        selectedIngredients
    );

    const handleClickAdd = () => {
        if (currentItemId) {
            onSubmit(currentItemId, Array.from(selectedIngredients));
        }
    };

    return (
        <div className={cn(className, 'flex flex-1')}>
            <PizzaImage imageUrl={imageUrl} size={size} />

            <div className='w-122.5 bg-[#f7f6f5] p-7'>
                <Title text={name} size='md' className='mb-1 font-extrabold' />

                <p className='text-gray-400'>{textDetaills}</p>

                <div className='mt-5 flex flex-col gap-4'>
                    <GroupVariants
                        items={availableSizes}
                        value={String(size)}
                        onClick={value => setSize(Number(value) as PizzaSize)}
                    />

                    <GroupVariants
                        items={pizzaTypes}
                        value={String(type)}
                        onClick={value => setType(Number(value) as PizzaType)}
                    />
                </div>

                <div className='scrollbar mt-5 h-105 overflow-auto rounded-md bg-gray-50 p-5'>
                    <div className='grid grid-cols-3 gap-3'>
                        {ingredients.map(ingredient => (
                            <IngredientItem
                                key={ingredient.id}
                                name={ingredient.name}
                                price={ingredient.price}
                                imageUrl={ingredient.imageUrl}
                                onClick={() => addIngredient(ingredient.id)}
                                active={selectedIngredients.has(ingredient.id)}
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
                        ? 'Adding...'
                        : `Add to cart by price ${formatPrice(totalPrice)}`}
                </Button>
            </div>
        </div>
    );
};
