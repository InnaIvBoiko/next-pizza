'use client';

import React from 'react';
import { useSet } from 'react-use';
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
    description?: string | null;
    /** Included ingredients (in the base price, pre-selected, removable for free). */
    ingredients: Ingredient[];
    /** Paid add-ons offered for this product. */
    extraIngredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    /** False when an included ingredient is out of stock — can't be ordered. */
    available?: boolean;
    onSubmit: (
        itemId: number,
        ingredients: number[],
        removedIngredients: number[]
    ) => void;
    className?: string;
}

/**
 * Form for choosing pizza options: size/dough, the included ingredients (which
 * can be removed for free) and the paid extras.
 */
export const ChoosePizzaForm: React.FC<Props> = ({
    name,
    description,
    items,
    imageUrl,
    ingredients,
    extraIngredients,
    loading,
    available = true,
    onSubmit,
    className,
}) => {
    const dict = useDictionary();
    const locale = useLocale();
    const { size, type, availableSizes, currentItemId, setSize, setType } =
        usePizzaOptions(items);

    // Included ingredients the user removed (free) and extras they added (paid).
    const [removedIncluded, { toggle: toggleIncluded }] = useSet(
        new Set<number>()
    );
    const [selectedExtras, { toggle: toggleExtra }] = useSet(new Set<number>());

    // Price = base (size/dough) + selected extras; the included don't affect it.
    const { totalPrice, textDetaills } = getPizzaDetails(
        type,
        size,
        items,
        extraIngredients,
        selectedExtras,
        dict
    );

    const handleClickAdd = () => {
        if (currentItemId) {
            onSubmit(
                currentItemId,
                Array.from(selectedExtras),
                Array.from(removedIncluded)
            );
        }
    };

    return (
        <div className={cn(className, 'flex flex-1 flex-col lg:flex-row')}>
            <PizzaImage imageUrl={imageUrl} size={size} />

            <div className='w-full bg-card p-5 sm:p-7 lg:w-122.5'>
                <Title text={name} size='md' className='mb-1 font-extrabold' />

                <p className='text-muted-foreground'>{textDetaills}</p>

                {description && (
                    <p className='mt-2 text-sm text-muted-foreground'>
                        {description}
                    </p>
                )}

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

                <div className='scrollbar mt-5 h-64 space-y-5 overflow-auto rounded-md bg-muted p-4 sm:p-5 lg:h-105'>
                    {ingredients.length > 0 && (
                        <div>
                            <p className='mb-2 text-sm font-bold'>
                                {dict.product.includedTitle}
                            </p>
                            <div className='grid grid-cols-3 gap-3'>
                                {ingredients.map(ingredient => (
                                    <IngredientItem
                                        key={ingredient.id}
                                        name={localizeName(ingredient, locale)}
                                        price={ingredient.price}
                                        imageUrl={ingredient.imageUrl}
                                        priceLabel={dict.product.included}
                                        active={
                                            !removedIncluded.has(ingredient.id)
                                        }
                                        onClick={() =>
                                            toggleIncluded(ingredient.id)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {extraIngredients.length > 0 && (
                        <div>
                            <p className='mb-2 text-sm font-bold'>
                                {dict.product.extraTitle}
                            </p>
                            <div className='grid grid-cols-3 gap-3'>
                                {extraIngredients.map(ingredient => (
                                    <IngredientItem
                                        key={ingredient.id}
                                        name={localizeName(ingredient, locale)}
                                        price={ingredient.price}
                                        imageUrl={ingredient.imageUrl}
                                        active={selectedExtras.has(ingredient.id)}
                                        onClick={() =>
                                            toggleExtra(ingredient.id)
                                        }
                                        disabled={!ingredient.available}
                                        unavailableLabel={
                                            dict.inventory.unavailable
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleClickAdd}
                    className='mt-10 h-13.75 w-full rounded-[18px] px-10 text-base'
                    disabled={loading || !available}
                >
                    {!available
                        ? dict.product.unavailable
                        : loading
                          ? dict.product.adding
                          : format(dict.product.addToCart, {
                                price: formatPrice(totalPrice),
                            })}
                </Button>
            </div>
        </div>
    );
};
