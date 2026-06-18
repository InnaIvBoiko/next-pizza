import React from 'react';
import { WhiteBlock } from '../white-block';
import { CheckoutItem } from '../checkout-item';
import { getCartItemDetails } from '@/shared/lib';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { CheckoutItemSkeleton } from '../checkout-item-skeleton';
import { useDictionary } from '../i18n/dictionary-provider';

interface Props {
    items: CartStateItem[];
    onClickCountButton: (
        id: number,
        quantity: number,
        type: 'plus' | 'minus'
    ) => void;
    removeCartItem: (id: number) => void;
    loading?: boolean;
    className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
    items,
    onClickCountButton,
    removeCartItem,
    loading,
    className,
}) => {
    const dict = useDictionary();

    return (
        <WhiteBlock title={dict.checkout.cartSection} className={className}>
            <div className='flex flex-col gap-5'>
                {loading
                    ? [...Array(4)].map((_, index) => (
                          <CheckoutItemSkeleton key={index} />
                      ))
                    : items.map(item => (
                          <CheckoutItem
                              key={item.id}
                              id={item.id}
                              imageUrl={item.imageUrl}
                              details={getCartItemDetails(
                                  dict,
                                  item.ingredients,
                                  item.removedIngredients,
                                  item.pizzaType as PizzaType,
                                  item.pizzaSize as PizzaSize
                              )}
                              name={item.name}
                              price={item.price}
                              quantity={item.quantity}
                              disabled={item.disabled}
                              onClickCountButton={(type: 'plus' | 'minus') =>
                                  onClickCountButton(
                                      item.id,
                                      item.quantity,
                                      type
                                  )
                              }
                              onClickRemove={() => removeCartItem(item.id)}
                          />
                      ))}
            </div>
        </WhiteBlock>
    );
};
