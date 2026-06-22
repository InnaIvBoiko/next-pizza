'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { MapPin } from 'lucide-react';

import type { Address } from '@/generated/prisma/client';
import { getMyAddresses } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { cn } from '@/shared/lib/utils';
import { useDictionary } from '../i18n/dictionary-provider';

/**
 * At checkout, lets a signed-in user pick one of their saved addresses to fill
 * the `address` field instead of retyping it. The default address is selected
 * automatically when the field is still empty. Renders nothing for guests or
 * when there are no saved addresses.
 */
export const CheckoutAddressBook: React.FC = () => {
    const dict = useDictionary();
    const { data: session } = useSession();
    const { setValue, watch } = useFormContext();

    const [addresses, setAddresses] = React.useState<Address[]>([]);
    const current = watch('address');

    React.useEffect(() => {
        if (!session?.user) return;

        let cancelled = false;
        getMyAddresses()
            .then(list => {
                if (cancelled) return;
                setAddresses(list);

                // Prefill with the default address only when the user hasn't
                // typed anything yet, so we never clobber manual input.
                const def = list.find(a => a.isDefault);
                if (def && !current) {
                    setValue('address', def.formatted, {
                        shouldValidate: true,
                    });
                }
            })
            .catch(err => {
                logger.error({ err }, '[CheckoutAddressBook] Load failed');
            });

        return () => {
            cancelled = true;
        };
        // Run once when the session becomes available.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.email]);

    if (addresses.length === 0) return null;

    const selected = (formatted: string) =>
        setValue('address', formatted, { shouldValidate: true });

    return (
        <div className='mb-5'>
            <p className='mb-2 font-medium'>{dict.addresses.useSaved}</p>
            <div className='flex flex-col gap-2'>
                {addresses.map(address => {
                    const active = current === address.formatted;
                    return (
                        <button
                            key={address.id}
                            type='button'
                            onClick={() => selected(address.formatted)}
                            className={cn(
                                'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                                active
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-input hover:bg-secondary'
                            )}
                        >
                            <MapPin className='h-4 w-4 shrink-0' />
                            <span className='wrap-break-word'>
                                {address.formatted}
                            </span>
                            {address.isDefault && (
                                <span className='bg-primary/10 text-primary ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold'>
                                    {dict.addresses.default}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
