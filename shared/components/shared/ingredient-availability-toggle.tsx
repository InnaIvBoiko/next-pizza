'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { setIngredientAvailability } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    ingredientId: number;
    available: boolean;
}

/** Toggle an ingredient in/out of stock (staff). Refreshes on change. */
export const IngredientAvailabilityToggle: React.FC<Props> = ({
    ingredientId,
    available,
}) => {
    const dict = useDictionary();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const onToggle = async () => {
        try {
            setLoading(true);
            await setIngredientAvailability(ingredientId, !available);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[IngredientAvailabilityToggle] failed');
            toast.error(dict.inventory.updateError);
            setLoading(false);
        }
    };

    return (
        <button
            type='button'
            onClick={onToggle}
            disabled={loading}
            className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors disabled:opacity-50',
                available
                    ? 'bg-success/15 text-success'
                    : 'bg-destructive/10 text-destructive'
            )}
        >
            {available ? dict.inventory.available : dict.inventory.unavailable}
        </button>
    );
};
