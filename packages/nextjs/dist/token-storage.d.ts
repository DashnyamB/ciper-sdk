import type { TokenPair } from '@cipher-auth/server/src/types';
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
export declare class TokenStorage {
    static getTokens(): TokenPair | null;
    static setTokens(tokens: TokenPair, expiresIn: number): void;
    static clearTokens(): void;
    static getExpiryTime(): number | null;
    static shouldRefresh(): boolean;
}
export {};
