/**
 * DTOs para Autenticação
 */

export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  senha: string;
  tenantNome: string;
  tenantCnpj?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  senhaAtual: string;
  novaSenha: string;
  confirmaSenha: string;
}
