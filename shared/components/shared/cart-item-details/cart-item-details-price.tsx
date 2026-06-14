import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';

interface Props {
    value: number;
    className?: string;
}

export const CartItemDetailsPrice: React.FC<Props> = ({ value, className }) => {
    return (
        <h2 className={cn('font-bold', className)}>{formatPrice(value)}</h2>
    );
};
