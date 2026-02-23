/**
 * Hook para Chamadas à API
 * Gerencia requisições com autenticação JWT
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const { getToken } = useAuth();

  const request = useCallback(
    async <T,>(url: string, options: ApiOptions = {}): Promise<T> => {
      const token = getToken();
      const method = options.method || 'GET';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config: RequestInit = {
        method,
        headers,
      };

      if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      return response.json();
    },
    [getToken]
  );

  // GET
  const get = useCallback(
    async <T,>(url: string): Promise<T> => {
      return request<T>(url, { method: 'GET' });
    },
    [request]
  );

  // POST
  const post = useCallback(
    async <T,>(url: string, body: any): Promise<T> => {
      return request<T>(url, { method: 'POST', body });
    },
    [request]
  );

  // PUT
  const put = useCallback(
    async <T,>(url: string, body: any): Promise<T> => {
      return request<T>(url, { method: 'PUT', body });
    },
    [request]
  );

  // DELETE
  const delete_ = useCallback(
    async <T,>(url: string): Promise<T> => {
      return request<T>(url, { method: 'DELETE' });
    },
    [request]
  );

  // PATCH
  const patch = useCallback(
    async <T,>(url: string, body: any): Promise<T> => {
      return request<T>(url, { method: 'PATCH', body });
    },
    [request]
  );

  return {
    request,
    get,
    post,
    put,
    delete: delete_,
    patch,
  };
};

export default useApi;
