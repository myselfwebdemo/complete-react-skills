import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { resetPassword } from '../../features/auth/authSlice';

import type React from 'react';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authError = useAppSelector((state) => state.auth.error);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const allowed = localStorage.getItem('passwordResetRequested') === 'true';
    if (!allowed) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setPassword(e.target.value);
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setCode(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(resetPassword({ password, token: code }));
    if (resetPassword.fulfilled.match(result)) {
      localStorage.removeItem('passwordResetRequested');
      void navigate('/login');
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className="text text_type_main-large mb-6">Сброс пароля</h1>
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <PasswordInput
            placeholder="Введите новый пароль"
            value={password}
            onChange={handlePasswordChange}
          />
          <Input
            placeholder="Введите код из письма"
            value={code}
            onChange={handleCodeChange}
          />
          <Button htmlType="submit">Сохранить</Button>
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
