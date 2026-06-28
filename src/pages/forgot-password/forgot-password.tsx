import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { requestPasswordReset } from '../../features/auth/authSlice';

import type { RootState, AppDispatch } from '../../store';
import type React from 'react';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authError = useSelector((state: RootState) => state.auth.error);
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setEmail(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(requestPasswordReset({ email }));
    if (requestPasswordReset.fulfilled.match(result)) {
      localStorage.setItem('passwordResetRequested', 'true');
      void navigate('/reset-password');
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className="text text_type_main-large mb-6">Восстановление пароля</h1>
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <EmailInput
            placeholder="Укажите e-mail"
            value={email}
            onChange={handleEmailChange}
          />
          <Button htmlType="submit">Восстановить</Button>
        </form>
        {authError && <p className={styles.error}>{authError}</p>}
        <p className={styles.hint}>
          Вспомнили пароль?{' '}
          <Link className={styles.link} to="/login">
            Войти
          </Link>
        </p>
      </section>
    </main>
  );
};
