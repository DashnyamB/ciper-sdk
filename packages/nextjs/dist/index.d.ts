import { NextCiperClient } from './client';
export { CiperProvider, type CiperProviderProps, useCiper, useAuth, } from './provider';
export declare function createClient(authServiceUrl: string, apiKey: string): NextCiperClient;
