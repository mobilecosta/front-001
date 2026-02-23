/**
 * Utilitários para Resposta Padrão PO UI
 */

import type {
  PaginatedResponse,
  ApiResponse,
  ApiErrorResponse,
} from '../types/po-ui.types';

/**
 * Cria resposta paginada padrão
 */
export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  totalRecords: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    items,
    page,
    pageSize,
    totalRecords,
    totalPages,
  };
}

/**
 * Cria resposta de sucesso padrão
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Cria resposta de erro padrão
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calcula offset para paginação
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Valida parâmetros de paginação
 */
export function validatePaginationParams(
  page?: number,
  pageSize?: number
): { page: number; pageSize: number } {
  const validPage = Math.max(1, page || 1);
  const validPageSize = Math.min(Math.max(1, pageSize || 10), 100); // Min 1, Max 100

  return {
    page: validPage,
    pageSize: validPageSize,
  };
}
