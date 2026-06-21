import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

import { registerUser } from '../../features/auth/authSlice';

import type { RootState, AppDispatch } from '../../store';
import type React from 'react';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector((state: RootState) => state.auth.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setName(event.target.value);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setPassword(event.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      if (from) {
        void navigate(from, { replace: true });
      }
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className="text text_type_main-large mb-6">Регистрация</h1>
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={handleNameChange}
          />
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
            suffix={
              <button
                type="button"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                className={styles.toggleEye}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.58 10.58a3 3 0 0 0 4.24 4.24"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      stroke="#fff"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.2" />
                  </svg>
                )}
              </button>
            }
          />
          <Button type="submit">Зарегистрироваться</Button>
        </form>
        {authError && <p className={styles.error}>{authError}</p>}
        <p className={styles.hint}>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </p>
      </section>
    </main>
  );
};
