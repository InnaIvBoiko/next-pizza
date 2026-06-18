import { Ingredient, Product, ProductItem } from '@/generated/prisma/client';

export type ProductWithRelations = Product & {
    items: ProductItem[];
    ingredients: Ingredient[]; // included (base price)
    extraIngredients: Ingredient[]; // paid add-ons
};
