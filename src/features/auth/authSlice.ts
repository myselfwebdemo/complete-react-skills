import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  clearTokens,
  fetchWithRefresh,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@utils/auth';
import checkResponse from '@utils/check-response';
import { API_BASE_URL } from '@utils/constants';

import type { TUser, TAuthResponse } from '@utils/auth';

export type AuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isChecking: boolean;
  error: string | null;
};

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isChecking: true,
  error: null,
};

export const registerUser = createAsyncThunk<
  TUser,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await checkResponse<TAuthResponse>(response);
    if (!data.success) {
      return rejectWithValue('Регистрация не удалась');
    }

    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await checkResponse<TAuthResponse>(response);
    if (!data.success) {
      return rejectWithValue('Авторизация не удалась');
    }

    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Ошибка авторизации');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });

      const data = await checkResponse<{ success: boolean }>(response);
      if (!data.success) {
        return rejectWithValue('Не удалось выйти из аккаунта');
      }

      clearTokens();
    } catch (err) {
      clearTokens();
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка выхода');
    }
  }
);

export const initializeAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/initialize', async (_, { rejectWithValue }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetchWithRefresh(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await checkResponse<{ success: boolean; user: TUser }>(response);
    if (!data.success) {
      clearTokens();
      return rejectWithValue('Ошибка проверки авторизации');
    }
    return data.user;
  } catch (err) {
    clearTokens();
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка проверки авторизации'
    );
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetchWithRefresh(`${API_BASE_URL}/auth/user`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await checkResponse<{ success: boolean; user: TUser }>(response);
    if (!data.success) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
    return data.user;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка обновления профиля'
    );
  }
});

export const requestPasswordReset = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: string }
>('auth/requestPasswordReset', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await checkResponse<{ success: boolean; message: string }>(response);
    if (!data.success) {
      return rejectWithValue('Не удалось отправить письмо для восстановления');
    }
    return data.message;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка запроса восстановления пароля'
    );
  }
});

export const resetPassword = createAsyncThunk<
  string,
  { password: string; token: string },
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-reset/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await checkResponse<{ success: boolean; message: string }>(response);
    if (!data.success) {
      return rejectWithValue('Не удалось сбросить пароль');
    }
    return data.message;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Ошибка сброса пароля');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Ошибка авторизации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? action.error.message ?? 'Ошибка выхода';
      })
      .addCase(initializeAuth.pending, (state) => {
        state.isChecking = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isChecking = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isChecking = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка проверки авторизации';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Ошибка обновления';
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка восстановления пароля';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Ошибка сброса пароля';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
