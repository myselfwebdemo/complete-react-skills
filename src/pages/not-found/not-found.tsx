import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => (
  <main className={styles.page}>
    <section className={styles.card}>
      <h1 className="text text_type_main-large mb-6">404</h1>
      <p className={styles.text}>Страница не найдена.</p>
      <Link to="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </section>
  </main>
);
