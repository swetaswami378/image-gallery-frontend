import { useContext } from 'react';
import { AuthContext } from './authProvider';

export function useAuth() {
  return useContext(AuthContext);
}

// Also keep the default export for backward compatibility
export default useAuth;
