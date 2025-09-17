import type {
  CurrentUser,
  RequestContext,
  SignUpParams,
  SignInParams,
  SignUpResult,
  SignInResult,
  TokenPair,
} from './types';

export * from './types';

export class CiperClient {
  constructor(
    protected authServiceUrl: string,
    protected apiKey: string,
  ) {}

  protected getAuthToken(ctx: RequestContext): string | null {
    const authHeader = ctx.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    if (ctx.cookies?.['auth-token']) {
      return ctx.cookies['auth-token'];
    }

    return null;
  }

  async currentUser(ctx: RequestContext): Promise<CurrentUser | null> {
    const token = this.getAuthToken(ctx);
    if (!token) {
      return null;
    }

    const response = await fetch(`${this.authServiceUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const result = await response.json();
    return result as CurrentUser;
  }

  async signUp(params: SignUpParams): Promise<SignUpResult> {
    const response = await fetch(`${this.authServiceUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }

    const result = await response.json();
    return result as SignUpResult;
  }

  async signIn(params: SignInParams): Promise<SignInResult> {
    const response = await fetch(`${this.authServiceUrl}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to sign in: ${response.statusText}`);
    }

    const result = await response.json();
    return result as SignInResult;
  }

  async renewTokens(refreshToken: string): Promise<TokenPair> {
    const response = await fetch(`${this.authServiceUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to renew tokens: ${response.statusText}`);
    }

    const result = await response.json();
    return result as TokenPair;
  }

  async logOut(ctx: RequestContext): Promise<void> {
    const token = this.getAuthToken(ctx);
    if (!token) return;

    const response = await fetch(`${this.authServiceUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok && response.status !== 401) {
      throw new Error(`Failed to log out: ${response.statusText}`);
    }
  }
}

// module.exports = { CiperClient };
