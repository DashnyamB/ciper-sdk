'use client';

import { headers, cookies } from 'next/headers';
import { CiperClient } from './base';
import type {
  CurrentUser,
  SignUpParams,
  SignInParams,
  SignUpResult,
  SignInResult,
  TokenResponse,
} from './base';
import { TokenStorage } from './token-storage';

export class NextCiperClient extends CiperClient {
  override async currentUser(): Promise<CurrentUser | null> {
    const headersList = headers();
    const cookiesList = cookies();

    return super.currentUser({
      headers: {
        authorization: headersList.get('authorization') || '',
      },
      cookies: Object.fromEntries(
        cookiesList.getAll().map((cookie) => [cookie.name, cookie.value]),
      ),
    });
  }

  override async signUp(params: SignUpParams): Promise<SignUpResult> {
    const result = await super.signUp(params);
    return result;
  }

  override async signIn(params: SignInParams): Promise<SignInResult> {
    const result = await super.signIn(params);
    if ('accessToken' in result && 'refreshToken' in result) {
      TokenStorage.setTokens(
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        3600,
      ); // Assuming 1-hour expiry
    }
    return result;
  }

  protected get apiBaseUrl(): string {
    return this.authServiceUrl || 'http://localhost:3000';
  }

  async refreshTokens(): Promise<void> {
    const tokens = TokenStorage.getTokens();
    if (!tokens) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result = (await response.json()) as TokenResponse;
      TokenStorage.setTokens(
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        result.expiresIn || 3600, // Use actual expiry time or fallback to 1 hour
      );
    } catch (error: unknown) {
      console.error('Token refresh failed:', error);
      TokenStorage.clearTokens();
    }
  }

  async maybeRefreshTokens(): Promise<void> {
    if (TokenStorage.shouldRefresh()) {
      await this.refreshTokens();
    }
  }

  override async logOut(): Promise<void> {
    const headersList = headers();
    const cookiesList = cookies();

    await super.logOut({
      headers: {
        authorization: headersList.get('authorization') || '',
      },
      cookies: Object.fromEntries(
        cookiesList.getAll().map((cookie) => [cookie.name, cookie.value]),
      ),
    });
    TokenStorage.clearTokens();
  }
}
