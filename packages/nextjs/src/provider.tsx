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
} from './base';

interface CiperContextValue {
  client: NextCiperClient;
}

const CiperContext = createContext<CiperContextValue | undefined>(undefined);

export interface CiperProviderProps {
  children: ReactNode;
}

export function CiperProvider({ children }: CiperProviderProps) {
  if (
    !process.env.NEXT_PUBLIC_CIPHER_AUTH_URL ||
    !process.env.NEXT_PUBLIC_CIPHER_API_KEY
  ) {
    throw new Error(
      'NEXT_PUBLIC_CIPHER_AUTH_URL and NEXT_PUBLIC_CIPHER_API_KEY must be set in your environment variables',
    );
  }

  const client = new NextCiperClient(
    process.env.NEXT_PUBLIC_CIPHER_AUTH_URL,
    process.env.NEXT_PUBLIC_CIPHER_API_KEY,
  );
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
