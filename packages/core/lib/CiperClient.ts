import { CiperUser } from './types';

export class CiperClient {
  private publicApiKey: string;
  private baseUrl: string;

  constructor(publicApiKey: string, baseUrl: string) {
    this.publicApiKey = publicApiKey;
    this.baseUrl = baseUrl;
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<CiperUser> {
    const response = await fetch(`${this.baseUrl}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.publicApiKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async logout({ token }: { token: string }) {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.publicApiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async refreshToken({ token }: { token: string }) {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.publicApiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }
}
