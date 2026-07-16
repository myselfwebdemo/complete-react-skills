import { useAppDispatch } from '@/hooks';
import { NavLink, Outlet } from 'react-router-dom';

import { logoutUser } from '../../features/auth/authSlice';

import type React from 'react';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return (
    <main className={styles.page}>
      <section className={styles.wrapper}>
        <nav className={styles.menu}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            История заказов
          </NavLink>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Выход
          </button>
        </nav>
        <section className={styles.content}>
          <Outlet />
        </section>
      </section>
    </main>
  );
};
