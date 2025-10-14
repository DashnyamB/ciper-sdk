import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from 'react';
import { CiperClient, CiperUser } from '@ciper-auth/core';

interface CiperContextValue {
  client: CiperClient;
  currentUser: CiperUser | null;
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

  const handleSetCiperUser = (user: CiperUser | null) => {
    setCurrentUser(user);
  };

  return (
    <CiperContext.Provider
      value={{ client, currentUser, setCurrentUser: handleSetCiperUser }}
    >
      {children}
    </CiperContext.Provider>
  );
};
