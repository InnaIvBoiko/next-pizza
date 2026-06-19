'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { useCartStore } from '@/shared/store';
import { useShallow } from 'zustand/react/shallow';
import React from 'react';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';
import { isProductAvailable } from '@/shared/lib';
import { format } from '@/shared/lib/i18n/format';
import { localizeName } from '@/shared/lib/i18n/localize-name';
import { localizeDescription } from '@/shared/lib/i18n/localize-description';
import { ChoosePizzaForm } from './choose-pizza-form';
import { ChooseProductForm } from './choose-product-form';
import { useDictionary, useLocale } from './i18n/dictionary-provider';

interface Props {
    product: ProductWithRelations;
    onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({
    product,
    onSubmit: _onSubmit,
}) => {
    const dict = useDictionary();
    const locale = useLocale();
    const [addCartItem, loading] = useCartStore(
        useShallow(state => [state.addCartItem, state.loading] as const)
    );

    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);
    const name = localizeName(product, locale);
    const description = localizeDescription(product, locale);

    // Out of stock if marked so by staff or an included ingredient is missing.
    const available = isProductAvailable(product);

    const onSubmit = async (
        productItemId?: number,
        ingredients?: number[],
        removedIngredients?: number[]
    ) => {
        try {
            const itemId = productItemId ?? firstItem.id;

            await addCartItem({
                productItemId: itemId,
                ingredients,
                removedIngredients,
            });

            toast.success(format(dict.product.addedToCart, { name }));

            _onSubmit?.();
        } catch (err) {
            toast.error(dict.product.addError);
            logger.error({ err }, '[ProductForm] Add to cart failed');
        }
    };

    if (isPizzaForm) {
        return (
            <ChoosePizzaForm
                imageUrl={product.imageUrl}
                name={name}
                description={description}
                ingredients={product.ingredients}
                extraIngredients={product.extraIngredients}
                items={product.items}
                onSubmit={onSubmit}
                loading={loading}
                available={available}
            />
        );
    }

    return (
        <ChooseProductForm
            imageUrl={product.imageUrl}
            name={name}
            description={description}
            onSubmit={onSubmit}
            price={firstItem.price}
            loading={loading}
            available={available}
        />
    );
};
