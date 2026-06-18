import Image from 'next/image';

import { prisma } from '@/prisma/prisma-client';
import { getStaffSession } from '@/shared/lib/get-staff-session';
import { Container } from '@/shared/components/shared/container';
import { IngredientAvailabilityToggle } from '@/shared/components/shared/ingredient-availability-toggle';
import { ShoppingList } from '@/shared/components/shared/shopping-list';
import { localizeName } from '@/shared/lib/i18n/localize-name';
import { cn } from '@/shared/lib/utils';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../../../dictionaries';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function InventoryPage({ params }: Props) {
    await getStaffSession();

    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    const [ingredients, shoppingItems] = await Promise.all([
        prisma.ingredient.findMany({ orderBy: { name: 'asc' } }),
        prisma.shoppingItem.findMany({ orderBy: { createdAt: 'asc' } }),
    ]);

    return (
        <Container className='px-4'>
            <h1 className='text-3xl font-extrabold'>{dict.inventory.title}</h1>

            <div className='mt-6 grid gap-8 lg:grid-cols-2'>
                {/* Ingredients availability */}
                <section>
                    <h2 className='mb-3 font-bold'>
                        {dict.inventory.ingredients}
                    </h2>
                    <ul className='space-y-2'>
                        {ingredients.map(ingredient => (
                            <li
                                key={ingredient.id}
                                className='glass flex items-center justify-between gap-3 rounded-2xl p-3'
                            >
                                <div className='flex min-w-0 items-center gap-3'>
                                    <div className='relative size-9 shrink-0'>
                                        <Image
                                            src={ingredient.imageUrl}
                                            alt=''
                                            fill
                                            sizes='36px'
                                            className='object-contain'
                                        />
                                    </div>
                                    <span
                                        className={cn(
                                            'truncate font-medium',
                                            !ingredient.available &&
                                                'text-muted-foreground line-through'
                                        )}
                                    >
                                        {localizeName(ingredient, lang as Locale)}
                                    </span>
                                </div>
                                <IngredientAvailabilityToggle
                                    ingredientId={ingredient.id}
                                    available={ingredient.available}
                                />
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Shopping list */}
                <section>
                    <h2 className='mb-3 font-bold'>
                        {dict.inventory.shoppingList}
                    </h2>
                    <ShoppingList
                        items={shoppingItems.map(item => ({
                            id: item.id,
                            label: item.label,
                            ingredientId: item.ingredientId,
                        }))}
                    />
                </section>
            </div>
        </Container>
    );
}
