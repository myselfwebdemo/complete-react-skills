import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';

import { calculateOrderCost, getOrderIngredientPreview } from '../../utils/orders';

import type { TWSOrder } from '../../utils/orders';
import type { TIngredient } from '../../utils/types';
import type React from 'react';

import styles from './order-feed.module.css';

type TOrderFeedProps = {
  orders: TWSOrder[];
  ingredients: TIngredient[];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getDate() - date.getDate();
  if (diff === 0)
    return (
      'Сегодня, ' +
      date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    );
  if (diff === 1)
    return (
      'Вчера, ' +
      date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    );
  return (
    date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) +
    ', ' +
    date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  );
};

export const OrderFeed = ({
  orders,
  ingredients,
}: TOrderFeedProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenOrder = (order: TWSOrder): void => {
    void navigate(`/feed/${order._id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className={styles.orders_list}>
      {orders.map((order) => {
        const previewIngredients =
          getOrderIngredientPreview(order, ingredients, 5) ?? [];
        const total = calculateOrderCost(order, ingredients);

        return (
          <button
            key={order._id}
            type="button"
            className={styles.order_card}
            onClick={(): void => handleOpenOrder(order)}
          >
            <div className={styles.order_header}>
              <span className="text text_type_digits-default text_color_inactive">
                #{order.number}
              </span>
              <span className="text text_type_main-default text_color_inactive">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <h2 className="text text_type_main-medium mb-2">
              {order.name ?? `Заказ №${order.number}`}
            </h2>
            <div className={styles.order_footer}>
              <div className={styles.ingredients_preview}>
                {previewIngredients.map((ingredient) => (
                  <div key={ingredient._id} className={styles.ingredient_circle}>
                    <img src={ingredient.image_mobile} alt={ingredient.name} />
                  </div>
                ))}
              </div>
              <div className={styles.price_wrap}>
                <span className="text text_type_digits-default">{total ?? '-'}</span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
