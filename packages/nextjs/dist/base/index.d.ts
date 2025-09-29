import type { CurrentUser, RequestContext, SignUpParams, SignInParams, SignUpResult, SignInResult, TokenPair } from './types';
export * from './types';
export declare class CiperClient {
    protected authServiceUrl: string;
    protected apiKey: string;
    constructor(authServiceUrl: string, apiKey: string);
    protected getAuthToken(ctx: RequestContext): string | null;
    currentUser(ctx: RequestContext): Promise<CurrentUser | null>;
    signUp(params: SignUpParams): Promise<SignUpResult>;
    signIn(params: SignInParams): Promise<SignInResult>;
    renewTokens(refreshToken: string): Promise<TokenPair>;
    logOut(ctx: RequestContext): Promise<void>;
}
