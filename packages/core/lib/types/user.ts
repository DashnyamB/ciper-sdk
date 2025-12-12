export interface CiperUser {
  id: string;
  email: string;
  role: string;
}

export interface CiperAuthenticateResponse {
  accessToken: string;
  refreshToken: string;
  user: CiperUser;
}

export interface CiperRefreshTokenResponse {
  accessToken: string;
}
