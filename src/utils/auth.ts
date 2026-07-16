import { API_BASE_URL } from '@utils/constants';

import checkResponse from './check-response';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getRawAccessToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return token.replace(/^Bearer\s+/i, '');
}

export async function refreshTokenRequest(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Отсутствует refresh token');
  }

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  const data = await checkResponse<{
    success: boolean;
    accessToken: string;
    refreshToken: string;
  }>(response);
  if (!data.success) {
    throw new Error('Не удалось обновить токен');
  }

  setTokens(data.accessToken, data.refreshToken);
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function fetchWithRefresh(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  const headers = new Headers(init.headers ?? {});
  if (accessToken) {
    headers.set('authorization', accessToken);
  }

  const response = await fetch(input, { ...init, headers });
  if (response.ok) {
    return response;
  }

  if (response.status === 401) {
    try {
      await refreshTokenRequest();
    } catch (err) {
      clearTokens();
      throw err;
    }

    const newAccessToken = getAccessToken();
    const retryHeaders = new Headers(init.headers ?? {});
    if (newAccessToken) {
      retryHeaders.set('authorization', newAccessToken);
    }
    const retryResponse = await fetch(input, { ...init, headers: retryHeaders });
    if (!retryResponse.ok) {
      clearTokens();
      throw new Error(
        `Ошибка запроса: ${retryResponse.status} ${retryResponse.statusText}`
      );
    }
    return retryResponse;
  }

  throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
}
