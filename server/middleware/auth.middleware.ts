/**
 * Middleware de Autenticação JWT
 */

import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { createErrorResponse } from '../utils/po-ui.response';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
);

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    tenantId: string;
    email: string;
    role: 'admin' | 'usuario' | 'visualizador';
  };
}

/**
 * Middleware para validar JWT
 */
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Token não fornecido ou formato inválido'
        )
      );
    }

    const token = authHeader.substring(7);

    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      req.user = verified.payload as any;
      next();
    } catch (error) {
      return res.status(401).json(
        createErrorResponse('INVALID_TOKEN', 'Token inválido ou expirado')
      );
    }
  } catch (error) {
    return res.status(500).json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'Erro ao validar autenticação'
      )
    );
  }
}

/**
 * Middleware para validar tenant
 */
export function validateTenantMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.tenantId) {
    return res.status(403).json(
      createErrorResponse(
        'FORBIDDEN',
        'Tenant não identificado'
      )
    );
  }

  next();
}

/**
 * Middleware para validar role de admin
 */
export function adminOnlyMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json(
      createErrorResponse(
        'FORBIDDEN',
        'Acesso restrito a administradores'
      )
    );
  }

  next();
}
