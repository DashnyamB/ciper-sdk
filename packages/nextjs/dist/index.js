import { NextCiperClient } from './client';
export { CiperProvider, useCiper, useAuth, } from './provider';
let globalClient;
export function createClient(authServiceUrl, apiKey) {
    if (!globalClient) {
        globalClient = new NextCiperClient(authServiceUrl, apiKey);
    }
    return globalClient;
}
