import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
      void navigate(from || '/', { replace: true });
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className="text text_type_main-large mb-6">Регистрация</h1>
        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <Input placeholder="Имя" value={name} onChange={handleNameChange} />
          <EmailInput placeholder="E-mail" value={email} onChange={handleEmailChange} />
          <PasswordInput
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button htmlType="submit">Зарегистрироваться</Button>
        </form>
        {authError && <p className={styles.error}>{authError}</p>}
        <p className={styles.hint}>
          Уже зарегистрированы?{' '}
          <Link className={styles.link} to="/login">
            Войти
          </Link>
        </p>
      </section>
    </main>
  );
};
