'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput, FormTextarea } from '../form';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title='3. Indirizzo di consegna' className={className}>
            <div className='flex flex-col gap-5'>
                <FormInput
                    name='address'
                    className='text-base'
                    placeholder='Via, numero, città, codice postale'
                />

                <FormTextarea
                    name='comment'
                    className='text-base'
                    placeholder='Aggiungi un commento'
                    rows={5}
                />
            </div>
        </WhiteBlock>
    );
};
