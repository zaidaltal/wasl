import Cookies from 'js-cookie';
import { User } from '@/types';

const TOKEN_KEY = 'wasl_token';
const USER_KEY = 'wasl_user';

// Secure on HTTPS so the token is never sent over plain HTTP; plain HTTP stays usable for local dev.
const cookieOptions = () => ({
  expires: 7,
  sameSite: 'lax' as const,
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
});

export const setAuth = (token: string, user: User) => {
  Cookies.set(TOKEN_KEY, token, cookieOptions());
  Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions());
};

export const clearAuth = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const getStoredUser = (): User | null => {
  const userStr = Cookies.get(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
