import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect, useMemo, useState } from 'react';

import { Input } from '@components/ui/input';

import { updateUser } from '../../features/auth/authSlice';

import type React from 'react';

import styles from './profile.module.css';

export const ProfileInfoPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const authError = useAppSelector((state) => state.auth.error);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  }, [user]);

  const isEdited = useMemo(
    () => !!user && (name !== user.name || email !== user.email || password.length > 0),
    [name, email, password, user]
  );

  const handleCancel = (): void => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setName(event.target.value);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setPassword(event.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user) return;

    await dispatch(updateUser({ name, email, password }));
    setPassword('');
  };

  return (
    <div className={styles.card}>
      <h1 className="text text_type_main-large mb-6">Профиль</h1>
      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <Input
          className={styles.input}
          type="text"
          placeholder="Имя"
          value={name}
          onChange={handleNameChange}
          suffix={
            <span className={styles.editIcon} aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.06 6.91l3.75 3.75"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          }
        />
        <Input
          className={styles.input}
          type="text"
          placeholder="Логин"
          value={email}
          onChange={handleEmailChange}
          suffix={
            <span className={styles.editIcon} aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.06 6.91l3.75 3.75"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          }
        />
        <Input
          className={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={handlePasswordChange}
          suffix={
            <span className={styles.editIcon} aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.06 6.91l3.75 3.75"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          }
        />
        {isEdited && (
          <div className={styles.button_group}>
            <button
              type="button"
              className={styles.cancel_button}
              onClick={handleCancel}
            >
              Отмена
            </button>
            <button type="submit" className={styles.submit_button} disabled={isLoading}>
              Сохранить
            </button>
          </div>
        )}
      </form>
      {authError && <p className={styles.error}>{authError}</p>}
      <p className={styles.note}>
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </div>
  );
};
