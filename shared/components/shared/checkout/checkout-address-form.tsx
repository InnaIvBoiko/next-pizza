'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput, FormTextarea } from '../form';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title='3. Delivery Address' className={className}>
            <div className='flex flex-col gap-5'>
                <FormInput
                    name='address'
                    className='text-base'
                    placeholder='Street, number, city, postal code'
                />

                <FormTextarea
                    name='comment'
                    className='text-base'
                    placeholder='Comment on the order'
                    rows={5}
                />
            </div>
        </WhiteBlock>
    );
};
