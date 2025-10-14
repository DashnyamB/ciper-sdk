import { useCiperClient } from './useCiperClient';

export const useAuth = () => {
  const { client, currentUser, setCurrentUser } = useCiperClient();

  const login = async (email: string, password: string) => {
    const user = await client.signIn({ email, password });
    setCurrentUser(user);
  };

  const logout = async () => {
    await client.logout({ token: '' });
    setCurrentUser(null);
  };

  return { login, logout, currentUser };
};
