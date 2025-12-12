import { CiperUser } from '@ciper-auth/core';
import { useCiperClient } from './useCiperClient';
import { useCallback } from 'react';

interface AuthHook {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  currentUser: CiperUser | null;
}

export const useAuth = (): AuthHook => {
  const { client, currentUser, setCurrentUser } = useCiperClient();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await client.signIn({ email, password });
      localStorage.setItem('ciper_access_token', res.accessToken);
      localStorage.setItem('ciper_refresh_token', res.refreshToken);
      setCurrentUser(res.user);
    },
    [client, setCurrentUser],
  );

  const logout = useCallback(async () => {
    const accessToken = localStorage.getItem('ciper_access_token') || '';
    await client.logout({ token: accessToken });
    localStorage.removeItem('ciper_access_token');
    localStorage.removeItem('ciper_refresh_token');
    setCurrentUser(null);
  }, [client, setCurrentUser]);

  const signUp = useCallback(
    async (email: string, password: string) => {
      const res = await client.signUp({ email, password });
      localStorage.setItem('ciper_access_token', res.accessToken);
      localStorage.setItem('ciper_refresh_token', res.refreshToken);
      setCurrentUser(res.user);
    },
    [client, setCurrentUser],
  );

  return { login, logout, currentUser, signUp };
};
