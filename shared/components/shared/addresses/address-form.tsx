'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { AddressFormValues, makeAddressFormSchema } from '@/shared/constants';
import { FormInput } from '../form';
import { Button } from '../../ui';
import { Checkbox } from '../../ui/checkbox';
import { useDictionary } from '../i18n/dictionary-provider';

interface Props {
    defaultValues?: Partial<AddressFormValues>;
    onSubmit: (values: AddressFormValues) => Promise<void> | void;
    onCancel: () => void;
    submitting?: boolean;
    /**
     * When editing the address that is already the default, the checkbox is
     * checked and locked — there must always be a default once one exists.
     */
    lockDefault?: boolean;
}

/**
 * Structured delivery-address form (via / civico / città / CAP) shared by the
 * add and edit flows. The four parts are composed into a single line on save
 * (see `formatAddress`).
 */
export const AddressForm: React.FC<Props> = ({
    defaultValues,
    onSubmit,
    onCancel,
    submitting,
    lockDefault,
}) => {
    const dict = useDictionary();
    const schema = React.useMemo(
        () => makeAddressFormSchema(dict.addressValidation),
        [dict]
    );

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            street: '',
            houseNumber: '',
            city: '',
            postalCode: '',
            isDefault: false,
            ...defaultValues,
        },
    });

    return (
        <FormProvider {...form}>
            <form
                className='flex w-full flex-col gap-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormInput
                    name='street'
                    label={dict.addresses.street}
                    required
                />

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormInput
                        name='houseNumber'
                        label={dict.addresses.houseNumber}
                        required
                    />
                    <FormInput
                        name='postalCode'
                        label={dict.addresses.postalCode}
                        inputMode='numeric'
                        required
                    />
                </div>

                <FormInput name='city' label={dict.addresses.city} required />

                <Controller
                    control={form.control}
                    name='isDefault'
                    render={({ field }) => (
                        <label className='mt-1 flex cursor-pointer items-center gap-2 text-sm font-medium'>
                            <Checkbox
                                checked={lockDefault || !!field.value}
                                disabled={lockDefault}
                                onCheckedChange={checked =>
                                    field.onChange(checked === true)
                                }
                            />
                            {dict.addresses.setAsDefault}
                        </label>
                    )}
                />

                <div className='mt-2 flex gap-2'>
                    <Button
                        type='submit'
                        disabled={submitting}
                        className='flex-1 text-base'
                    >
                        {dict.addresses.save}
                    </Button>
                    <Button
                        type='button'
                        variant='outline'
                        disabled={submitting}
                        onClick={onCancel}
                        className='flex-1 text-base'
                    >
                        {dict.addresses.cancel}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
