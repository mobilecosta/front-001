/**
 * DTOs para Tenants
 */

export interface CreateTenantDto {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface UpdateTenantDto {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
}

export interface TenantResponseDto {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface TenantUsuarioResponseDto {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
  criado_em: string;
}
