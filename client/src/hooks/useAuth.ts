/**
 * Hook de Autenticação
 * Gerencia estado de autenticação e tokens JWT
 */

import { useState, useEffect, useCallback } from 'react';
import type { User, AuthResponse } from '../types/po-ui.types';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sessão ao carregar
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });

      if (!response.ok) {
        throw new Error('Falha ao fazer login');
      }

      const data: AuthResponse = await response.json();

      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(
    async (nome: string, email: string, password: string, tenantNome: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            email,
            senha: password,
            tenantNome,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao registrar');
        }

        const data: AuthResponse = await response.json();

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setUser(data.user);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao registrar';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  // Obter token
  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  // Verificar se está autenticado
  const isAuthenticated = !!user && !!localStorage.getItem(TOKEN_KEY);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getToken,
  };
};

export default useAuth;
