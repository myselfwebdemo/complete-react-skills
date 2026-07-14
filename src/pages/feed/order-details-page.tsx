import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  calculateOrderCost,
  getOrderIngredientsWithCount,
  getStatusTitle,
  type TWSOrder,
} from '../../utils/orders';

import type { RootState } from '../../store';
import type React from 'react';

import styles from './order-details-page.module.css';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

export const OrderDetailsPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const feedOrders = useSelector((state: RootState) => state.ordersFeed.orders);
  const profileOrders = useSelector((state: RootState) => state.profileOrders.orders);

  const allOrders: TWSOrder[] = [...feedOrders, ...profileOrders];
  const order = id
    ? allOrders.find((item) => item._id === id || String(item.number) === id)
    : undefined;

  const orderIngredients = order
    ? getOrderIngredientsWithCount(order, ingredients)
    : null;
  const total = order ? calculateOrderCost(order, ingredients) : null;

  if (!order || !orderIngredients || total === null) {
    return (
      <div className={styles.empty}>
        <p className="text text_type_main-default">Заказ не найден</p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <span
        className={`text text_type_digits-default text_color_inactive ${styles.order_number}`}
      >
        #{order.number}
      </span>
      <h1 className="text text_type_main-large mb-6">
        {order.name ?? `Заказ №${order.number}`}
      </h1>
      <p className={`text text_type_main-default ${styles.status}`}>
        {getStatusTitle(order.status)}
      </p>
      <div className={styles.details_card}>
        <h2 className="text text_type_main-medium mb-4">Состав:</h2>
        <ul className={styles.ingredients_list}>
          {orderIngredients.map((ingredient) => (
            <li key={ingredient._id} className={styles.ingredient_row}>
              <span className={styles.ingredient_name}>{ingredient.name}</span>
              <span className={styles.ingredient_count}>
                {ingredient.count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <span className={`text text_type_main-default text_color_inactive`}>
            {formatDate(order.createdAt)}
          </span>
          <div className={styles.total_price}>
            <span className="text text_type_digits-default">{total}</span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </section>
  );
};
