'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { headers, cookies } from 'next/headers';
import { CiperClient } from './base';
import { TokenStorage } from './token-storage';
export class NextCiperClient extends CiperClient {
    currentUser() {
        const _super = Object.create(null, {
            currentUser: { get: () => super.currentUser }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const headersList = headers();
            const cookiesList = cookies();
            return _super.currentUser.call(this, {
                headers: {
                    authorization: headersList.get('authorization') || '',
                },
                cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
            });
        });
    }
    signUp(params) {
        const _super = Object.create(null, {
            signUp: { get: () => super.signUp }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.signUp.call(this, params);
            return result;
        });
    }
    signIn(params) {
        const _super = Object.create(null, {
            signIn: { get: () => super.signIn }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.signIn.call(this, params);
            if ('accessToken' in result && 'refreshToken' in result) {
                TokenStorage.setTokens({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                }, 3600); // Assuming 1-hour expiry
            }
            return result;
        });
    }
    get apiBaseUrl() {
        return this.authServiceUrl || 'http://localhost:3000';
    }
    refreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = TokenStorage.getTokens();
            if (!tokens)
                return;
            try {
                const response = yield fetch(`${this.apiBaseUrl}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
                });
                if (!response.ok) {
                    throw new Error('Token refresh failed');
                }
                const result = (yield response.json());
                TokenStorage.setTokens({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                }, result.expiresIn || 3600);
            }
            catch (error) {
                console.error('Token refresh failed:', error);
                TokenStorage.clearTokens();
            }
        });
    }
    maybeRefreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            if (TokenStorage.shouldRefresh()) {
                yield this.refreshTokens();
            }
        });
    }
    logOut() {
        const _super = Object.create(null, {
            logOut: { get: () => super.logOut }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const headersList = headers();
            const cookiesList = cookies();
            yield _super.logOut.call(this, {
                headers: {
                    authorization: headersList.get('authorization') || '',
                },
                cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
            });
            TokenStorage.clearTokens();
        });
    }
}
