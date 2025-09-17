export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  identifier: string;
  permissions: Permission[];
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
}

export interface RequestContext {
  headers: Record<string, string>;
  cookies?: { [key: string]: string };
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: CurrentUser;
}

export interface TokenResponse extends TokenPair {
  expiresIn: number; // Access token expiration in seconds
}

export type SignUpResult = AuthResponse;
export type SignInResult = AuthResponse;

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
}
