import { NextCiperClient } from './client';
export {
  CiperProvider,
  type CiperProviderProps,
  useCiper,
  useAuth,
} from './provider';

let globalClient: NextCiperClient | undefined;

export function createClient(
  authServiceUrl: string,
  apiKey: string,
): NextCiperClient {
  if (!globalClient) {
    globalClient = new NextCiperClient(authServiceUrl, apiKey);
  }
  
  return globalClient;
}
