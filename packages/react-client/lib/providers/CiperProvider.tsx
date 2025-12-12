import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';
import { CiperClient, CiperUser } from '@ciper-auth/core';

interface CiperContextValue {
  client: CiperClient;
  currentUser: CiperUser | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: CiperUser | null) => void;
}

export const CiperContext = createContext<CiperContextValue | undefined>(
  undefined,
);

export const CiperProvider: FunctionComponent = ({
  children,
}: PropsWithChildren) => {
  const client = new CiperClient(
    process.env.CIPER_AUTH_PUBLIC_KEY || '',
    process.env.CIPER_AUTH_URL || '',
  );

  const [currentUser, setCurrentUser] = useState<CiperUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('ciper_refresh_token');

    if (!refreshToken) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      return;
    }

    const response = await client.refreshToken({ token: refreshToken });

    if (response && response.accessToken) {
      localStorage.setItem('ciper_access_token', response.accessToken);
    }
  }, []);

  const scheduleRefreshToken = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const refreshTime = 13 * 60 * 1000; // 13 minutes in milliseconds

    refreshTimeoutRef.current = setTimeout(() => {
      console.log('Auto-refreshing token...');
      refreshAccessToken().then(() => {
        scheduleRefreshToken();
      });
    }, refreshTime);
  }, []);

  const handleSetCiperUser = useCallback((user: CiperUser | null) => {
    setCurrentUser(user);
  }, []);

  return (
    <CiperContext.Provider
      value={{
        client,
        currentUser,
        setCurrentUser: handleSetCiperUser,
        isAuthenticated,
      }}
    >
      {children}
    </CiperContext.Provider>
  );
};
