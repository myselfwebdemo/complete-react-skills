import { describe, expect, it } from 'vitest';

import reducer, {
  clearAuthError,
  initializeAuth,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  updateUser,
} from './authSlice';

describe('authSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('clears the auth error', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecking: false,
        error: 'Ошибка',
      },
      clearAuthError()
    );

    expect(state.error).toBeNull();
  });

  it('sets loading flag for register request', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecking: false,
        error: null,
      },
      registerUser.pending('request-id', {
        email: 'test@example.com',
        password: '123',
        name: 'Test',
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('authenticates user after successful registration', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        isChecking: false,
        error: null,
      },
      registerUser.fulfilled({ email: 'test@example.com', name: 'Test' }, 'request-id', {
        email: 'test@example.com',
        password: '123',
        name: 'Test',
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
  });

  it('stores auth error after failed login', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        isChecking: false,
        error: null,
      },
      {
        type: loginUser.rejected.type,
        payload: 'Ошибка авторизации',
        error: { message: 'Ошибка авторизации' },
        meta: {
          requestId: 'request-id',
          arg: { email: 'test@example.com', password: '123' },
          aborted: false,
        },
      }
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка авторизации');
  });

  it('clears auth data after logout', () => {
    const state = reducer(
      {
        user: { email: 'test@example.com', name: 'Test' },
        isAuthenticated: true,
        isLoading: false,
        isChecking: false,
        error: null,
      },
      logoutUser.fulfilled(undefined, 'request-id')
    );

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('checks auth state on initialization', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecking: true,
        error: null,
      },
      initializeAuth.fulfilled({ email: 'test@example.com', name: 'Test' }, 'request-id')
    );

    expect(state.isChecking).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
  });

  it('updates the user profile', () => {
    const state = reducer(
      {
        user: { email: 'old@example.com', name: 'Old' },
        isAuthenticated: true,
        isLoading: false,
        isChecking: false,
        error: null,
      },
      updateUser.fulfilled({ email: 'new@example.com', name: 'New' }, 'request-id', {
        name: 'New',
        email: 'new@example.com',
        password: '123',
      })
    );

    expect(state.user).toEqual({ email: 'new@example.com', name: 'New' });
  });

  it('handles password reset request outcomes', () => {
    const pendingState = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isChecking: false,
        error: null,
      },
      requestPasswordReset.pending('request-id', { email: 'test@example.com' })
    );
    const fulfilledState = reducer(
      pendingState,
      requestPasswordReset.fulfilled('Сообщение', 'request-id', {
        email: 'test@example.com',
      })
    );

    expect(fulfilledState.isLoading).toBe(false);
  });

  it('handles password reset completion', () => {
    const state = reducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        isChecking: false,
        error: null,
      },
      resetPassword.fulfilled('Пароль обновлён', 'request-id', {
        password: '123',
        token: 'token',
      })
    );

    expect(state.isLoading).toBe(false);
  });
});
