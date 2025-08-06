import { useState, useEffect } from 'react';
import { authService, type User } from '../lib/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const token = authService.getToken();
      if (token) {
        const isValid = await authService.verifyToken();
        if (isValid) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          authService.clearAuth();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };
};