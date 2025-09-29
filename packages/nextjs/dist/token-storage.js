'use client';
const TOKEN_KEY = 'cipher_auth_tokens';
const EXPIRY_KEY = 'cipher_auth_expiry';
function getLocalStorage() {
    if (typeof window !== 'undefined') {
        return window.localStorage;
    }
    return null;
}
export class TokenStorage {
    static getTokens() {
        const storage = getLocalStorage();
        if (!storage)
            return null;
        const stored = storage.getItem(TOKEN_KEY);
        if (!stored)
            return null;
        try {
            return JSON.parse(stored);
        }
        catch (_a) {
            return null;
        }
    }
    static setTokens(tokens, expiresIn) {
        const storage = getLocalStorage();
        if (!storage)
            return;
        storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
        storage.setItem(EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
    }
    static clearTokens() {
        const storage = getLocalStorage();
        if (!storage)
            return;
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(EXPIRY_KEY);
    }
    static getExpiryTime() {
        const storage = getLocalStorage();
        if (!storage)
            return null;
        const expiry = storage.getItem(EXPIRY_KEY);
        return expiry ? Number(expiry) : null;
    }
    static shouldRefresh() {
        const expiryTime = this.getExpiryTime();
        if (!expiryTime)
            return false;
        const timeUntilExpiry = expiryTime - Date.now();
        return timeUntilExpiry < 60000; // Less than 1 minute until expiry
    }
}
