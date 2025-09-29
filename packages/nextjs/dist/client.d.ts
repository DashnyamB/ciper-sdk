import { CiperClient } from './base';
import type { CurrentUser, SignUpParams, SignInParams, SignUpResult, SignInResult } from './base';
export declare class NextCiperClient extends CiperClient {
    currentUser(): Promise<CurrentUser | null>;
    signUp(params: SignUpParams): Promise<SignUpResult>;
    signIn(params: SignInParams): Promise<SignInResult>;
    protected get apiBaseUrl(): string;
    refreshTokens(): Promise<void>;
    maybeRefreshTokens(): Promise<void>;
    logOut(): Promise<void>;
}
