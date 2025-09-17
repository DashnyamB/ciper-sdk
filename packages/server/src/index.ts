import type { CurrentUser } from "./types";

export class CiperClient {
  private authServiceUrl: string;
  private apiKey: string;

  constructor(authServiceUrl: string, apiKey: string) {
    this.authServiceUrl = authServiceUrl;
    this.apiKey = apiKey;
  }

  async currentUser(accessToken: string): Promise<CurrentUser> {
    const user = await fetch(`${this.authServiceUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return (await user.json()) as CurrentUser;
  }
}
