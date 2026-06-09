import Cookies from 'js-cookie';
import { User } from '@/types';

const TOKEN_KEY = 'wasl_token';
const USER_KEY = 'wasl_user';

export const setAuth = (token: string, user: User) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'lax' });
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, sameSite: 'lax' });
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
