import React from 'react';

interface Props {
    orderId: number;
    totalAmount: number;
    paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({
    orderId,
    totalAmount,
    paymentUrl,
}) => (
    <div>
        <h1>Order #{orderId}</h1>

        <p>
            Please pay for your order totaling <b>€ {totalAmount}</b>. Follow{' '}
            <a href={paymentUrl}>this link</a> to complete your payment.
        </p>
    </div>
);
