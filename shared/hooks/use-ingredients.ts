import { Api } from '@/shared/services/api-client';
import { Ingredient } from '@/generated/prisma/client';
import { logger } from '@/shared/lib/logger.client';
import React from 'react';

export const useIngredients = () => {
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true);
                const ingredients = await Api.ingredients.getAll();
                setIngredients(ingredients);
            } catch (error) {
                logger.error({ err: error }, '[useIngredients] Fetch failed');
            } finally {
                setLoading(false);
            }
        }

        fetchIngredients();
    }, []);

    return {
        ingredients,
        loading,
    };
};
