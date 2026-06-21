import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute, GuestRoute } from '@components/protected-route/protected-route';

import { initializeAuth } from '../../features/auth/authSlice';
import { FeedPage } from '../../pages/feed/feed';
import { ForgotPasswordPage } from '../../pages/forgot-password/forgot-password';
import { Home } from '../../pages/home/home';
import { IngredientPage } from '../../pages/ingredient/ingredient';
import { LoginPage } from '../../pages/login/login';
import { NotFoundPage } from '../../pages/not-found/not-found';
import { ProfilePage } from '../../pages/profile/profile';
import { ProfileInfoPage } from '../../pages/profile/profile-info';
import { ProfileOrderPage } from '../../pages/profile/profile-order';
import { RegisterPage } from '../../pages/register/register';
import { ResetPasswordPage } from '../../pages/reset-password/reset-password';

import type { AppDispatch } from '../../store';
import type React from 'react';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfoPage />} />
            <Route path="orders" element={<ProfileOrderPage />} />
          </Route>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
