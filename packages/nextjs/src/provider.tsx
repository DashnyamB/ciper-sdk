'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { NextCiperClient } from './client';
import type {
  CurrentUser,
  SignUpParams,
  SignInParams,
} from '@cipher-auth/server/src/types';

interface CiperContextValue {
  client: NextCiperClient;
}

const CiperContext = createContext<CiperContextValue | undefined>(undefined);

export interface CiperProviderProps {
  client: NextCiperClient;
  children: ReactNode;
}

export function CiperProvider({ client, children }: CiperProviderProps) {
  return (
    <CiperContext.Provider value={{ client }}>{children}</CiperContext.Provider>
  );
}

export function useCiper() {
  const context = useContext(CiperContext);
  if (!context) {
    throw new Error('useCiper must be used within a CiperProvider');
  }
  return context.client;
}

export function useAuth() {
  const client = useCiper();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .currentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, [client]);

  const signUp = async (params: SignUpParams) => {
    const result = await client.signUp(params);
    setUser(result.user);
    return result;
  };

  const signIn = async (params: SignInParams) => {
    const result = await client.signIn(params);
    setUser(result.user);
    return result;
  };

  const logOut = async () => {
    await client.logOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    isAuthenticated: !!user,
  };
}
