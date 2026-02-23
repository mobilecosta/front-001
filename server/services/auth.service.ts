/**
 * Serviço de Autenticação
 */

import { SignJWT } from 'jose';
import type { AuthResponse, JwtPayload } from '../types/po-ui.types';
import type { LoginDto, RegisterDto } from '../dtos/auth.dto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
);

export class AuthService {
  /**
   * Gera token JWT
   */
  async generateToken(
    userId: string,
    tenantId: string,
    email: string,
    role: string,
    expiresIn: number = 3600 // 1 hora
  ): Promise<string> {
    const token = await new SignJWT({
      sub: userId,
      tenantId,
      email,
      role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * Gera refresh token (válido por 30 dias)
   */
  async generateRefreshToken(
    userId: string,
    tenantId: string
  ): Promise<string> {
    const token = await new SignJWT({
      sub: userId,
      tenantId,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + 30 * 24 * 3600)
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * Cria resposta de autenticação
   */
  async createAuthResponse(
    userId: string,
    tenantId: string,
    email: string,
    nome: string,
    role: string
  ): Promise<AuthResponse> {
    const accessToken = await this.generateToken(
      userId,
      tenantId,
      email,
      role,
      3600 // 1 hora
    );

    const refreshToken = await this.generateRefreshToken(userId, tenantId);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        nome,
        tenantId,
        role,
      },
    };
  }

  /**
   * Valida senha (placeholder - implementar com bcrypt em produção)
   */
  async validatePassword(password: string, hash: string): Promise<boolean> {
    // TODO: Implementar com bcrypt
    // const isValid = await bcrypt.compare(password, hash);
    // return isValid;
    return password === hash; // Temporário
  }

  /**
   * Hash de senha (placeholder - implementar com bcrypt em produção)
   */
  async hashPassword(password: string): Promise<string> {
    // TODO: Implementar com bcrypt
    // const hash = await bcrypt.hash(password, 10);
    // return hash;
    return password; // Temporário
  }
}

export const authService = new AuthService();
