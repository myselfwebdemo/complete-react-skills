import type React from 'react';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => (
  <main className={styles.page}>
    <section className={styles.card}>
      <h1 className="text text_type_main-large mb-6">Лента заказов</h1>
      <p className={styles.text}>Страница находится в разработке.</p>
    </section>
  </main>
);
