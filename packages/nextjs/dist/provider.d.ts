import { type ReactNode } from 'react';
import { NextCiperClient } from './client';
import type { CurrentUser, SignUpParams, SignInParams } from './base';
export interface CiperProviderProps {
    children: ReactNode;
}
export declare function CiperProvider({ children }: CiperProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useCiper(): NextCiperClient;
export declare function useAuth(): {
    user: CurrentUser | null;
    loading: boolean;
    signUp: (params: SignUpParams) => Promise<import("./base").AuthResponse>;
    signIn: (params: SignInParams) => Promise<import("./base").AuthResponse>;
    logOut: () => Promise<void>;
    isAuthenticated: boolean;
};
