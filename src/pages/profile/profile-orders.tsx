import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  connectProfileOrders,
  disconnectProfileOrders,
} from '../../features/profileOrders/profileOrdersSlice';
import { calculateOrderCost, getOrderIngredientPreview } from '../../utils/orders';

import type { AppDispatch, RootState } from '../../store';
import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, error } = useSelector((state: RootState) => state.profileOrders);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    dispatch(connectProfileOrders());
    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  const handleOpenOrder = (orderId: string): void => {
    void navigate(`/profile/orders/${orderId}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className="text text_type_main-large">История заказов</h1>
        <p
          className={`text text_type_main-default text_color_inactive ${styles.description}`}
        >
          В этом разделе вы можете просмотреть свою историю заказов
        </p>
      </div>
      <div className={styles.orders_list}>
        {error ? (
          <div>
            <p className="text text_type_main-default text_color_error">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div>
            <p className="text text_type_main-default">Заказов пока нет</p>
          </div>
        ) : (
          orders.map((order) => (
            <button
              key={order._id}
              type="button"
              className={styles.order_card}
              onClick={(): void => handleOpenOrder(order._id)}
            >
              <div className={styles.order_header}>
                <span className="text text_type_digits-default text_color_inactive">
                  #{order.number}
                </span>
                <span className="text text_type_main-default text_color_inactive">
                  {new Date(order.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h2 className="text text_type_main-medium mb-2">{order.name}</h2>
              <span className={`text text_type_main-default ${styles.order_status}`}>
                {order.status === 'done'
                  ? 'Выполнен'
                  : order.status === 'pending'
                    ? 'Готовится'
                    : 'Создан'}
              </span>
              <div className={styles.order_body}>
                <div className={styles.ingredients_preview}>
                  {getOrderIngredientPreview(order, ingredients, 5)?.map(
                    (ingredient) => (
                      <div key={ingredient._id} className={styles.ingredient_circle}>
                        <img src={ingredient.image_mobile} alt={ingredient.name} />
                      </div>
                    )
                  )}
                </div>
                <div className={styles.order_footer}>
                  <div className={styles.price_wrap}>
                    <span className="text text_type_digits-default">
                      {calculateOrderCost(order, ingredients) ?? '-'}
                    </span>
                    <CurrencyIcon type="primary" />
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
};
