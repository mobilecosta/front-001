/**
 * DTOs para Categorias
 */

export interface CreateCategoriaDto {
  nome: string;
  tipo: 'receita' | 'despesa';
  cor?: string;
  icone?: string;
}

export interface UpdateCategoriaDto {
  nome?: string;
  tipo?: 'receita' | 'despesa';
  cor?: string;
  icone?: string;
  ativo?: boolean;
}

export interface CategoriaResponseDto {
  id: string;
  nome: string;
  tipo: string;
  cor?: string;
  icone?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
