'use client';

import type { TokenPair } from '@cipher-auth/server/src/types';

const TOKEN_KEY = 'cipher_auth_tokens';
const EXPIRY_KEY = 'cipher_auth_expiry';

interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare global {
  interface Window {
    localStorage: WebStorage;
  }
}

declare const window: Window | undefined;

function getLocalStorage(): WebStorage | null {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

export class TokenStorage {
  static getTokens(): TokenPair | null {
    const storage = getLocalStorage();
    if (!storage) return null;

    const stored = storage.getItem(TOKEN_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static setTokens(tokens: TokenPair, expiresIn: number): void {
    const storage = getLocalStorage();
    if (!storage) return;
    storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    storage.setItem(EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
  }

  static clearTokens(): void {
    const storage = getLocalStorage();
    if (!storage) return;
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(EXPIRY_KEY);
  }

  static getExpiryTime(): number | null {
    const storage = getLocalStorage();
    if (!storage) return null;
    const expiry = storage.getItem(EXPIRY_KEY);
    return expiry ? Number(expiry) : null;
  }

  static shouldRefresh(): boolean {
    const expiryTime = this.getExpiryTime();
    if (!expiryTime) return false;

    const timeUntilExpiry = expiryTime - Date.now();
    return timeUntilExpiry < 60000; // Less than 1 minute until expiry
  }
}
