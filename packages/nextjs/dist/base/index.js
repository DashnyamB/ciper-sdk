var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export * from './types';
export class CiperClient {
    constructor(authServiceUrl, apiKey) {
        this.authServiceUrl = authServiceUrl;
        this.apiKey = apiKey;
    }
    getAuthToken(ctx) {
        var _a;
        const authHeader = ctx.headers['authorization'];
        if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }
        if ((_a = ctx.cookies) === null || _a === void 0 ? void 0 : _a['auth-token']) {
            return ctx.cookies['auth-token'];
        }
        return null;
    }
    currentUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getAuthToken(ctx);
            if (!token) {
                return null;
            }
            const response = yield fetch(`${this.authServiceUrl}/users/me`, {
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
            const result = yield response.json();
            return result;
        });
    }
    signUp(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.authServiceUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.CIPER_PRIVATE_API_KEY || '',
                },
                body: JSON.stringify(params),
            });
            if (!response.ok) {
                throw new Error(`Failed to sign up: ${response.statusText}`);
            }
            const result = yield response.json();
            return result;
        });
    }
    signIn(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.authServiceUrl}/auth/signin`, {
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
            const result = yield response.json();
            return result;
        });
    }
    renewTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.authServiceUrl}/auth/refresh`, {
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
            const result = yield response.json();
            return result;
        });
    }
    logOut(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getAuthToken(ctx);
            if (!token)
                return;
            const response = yield fetch(`${this.authServiceUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-API-Key': this.apiKey,
                },
            });
            if (!response.ok && response.status !== 401) {
                throw new Error(`Failed to log out: ${response.statusText}`);
            }
        });
    }
}
// module.exports = { CiperClient };
