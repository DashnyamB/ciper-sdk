import { useContext } from 'react';
import { CiperContext } from '../providers/CiperProvider';

export const useCiperClient = () => {
  const context = useContext(CiperContext);
  if (!context) {
    throw new Error('useCiperClient must be used within a CiperProvider');
  }
  return {
    client: context.client,
    currentUser: context.currentUser,
    setCurrentUser: context.setCurrentUser,
  };
};
