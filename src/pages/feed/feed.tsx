import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  connectOrdersFeed,
  disconnectOrdersFeed,
} from '../../features/ordersFeed/ordersFeedSlice';
import { getStatusColumns } from '../../utils/orders';
import { OrderFeed } from './order-feed';

import type { RootState, AppDispatch } from '../../store';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const ordersFeed = useSelector((state: RootState) => state.ordersFeed);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    dispatch(connectOrdersFeed());
    return (): void => {
      dispatch(disconnectOrdersFeed());
    };
  }, [dispatch]);

  const doneNumbers = ordersFeed.orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const inProgressNumbers = ordersFeed.orders
    .filter((order) => order.status !== 'done')
    .map((order) => order.number);

  const doneColumns = getStatusColumns(doneNumbers);
  const workColumns = getStatusColumns(inProgressNumbers);

  return (
    <main className={styles.page}>
      <h1 className={`text text_type_main-large ${styles.title}`}>Лента заказов</h1>
      <div className={styles.content}>
        <section className={styles.left}>
          <OrderFeed orders={ordersFeed.orders} ingredients={ingredients} />
        </section>

        <aside className={styles.right}>
          <div className={styles.status_section}>
            <div className={styles.status_group}>
              <div className={styles.status_header}>Готово:</div>
              <div className={styles.status_columns}>
                {doneColumns.map((numbers, index) => (
                  <div key={index} className={styles.status_column}>
                    {numbers.map((number) => (
                      <span
                        key={number}
                        className={`text text_type_digits-default ${styles.status_number}`}
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.status_group}>
              <div className={styles.status_header}>В работе:</div>
              <div className={styles.status_columns}>
                {workColumns.map((numbers, index) => (
                  <div key={index} className={styles.status_column}>
                    {numbers.map((number) => (
                      <span
                        key={number}
                        className={`text text_type_digits-default ${styles.status_number_secondary}`}
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`${styles.summary_card}`}>
            <p className="text text_type_main-default text_color_inactive">
              Выполнено за все время:
            </p>
            <span className={`text text_type_digits-large ${styles.summary_value}`}>
              {ordersFeed.total}
            </span>
          </div>
          <div className={styles.summary_card}>
            <p className="text text_type_main-default text_color_inactive">
              Выполнено за сегодня:
            </p>
            <span className={`text text_type_digits-large ${styles.summary_value}`}>
              {ordersFeed.totalToday}
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
};
