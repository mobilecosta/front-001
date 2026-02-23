/**
 * DTOs para Transações
 */

export interface CreateTransacaoDto {
  descricao: string;
  tipo: 'receita' | 'despesa' | 'transferencia';
  valor: number;
  conta_id: string;
  categoria_id?: string;
  data_transacao: string; // ISO date
  data_vencimento?: string; // ISO date
  pago?: boolean;
  observacoes?: string;
}

export interface UpdateTransacaoDto {
  descricao?: string;
  tipo?: 'receita' | 'despesa' | 'transferencia';
  valor?: number;
  conta_id?: string;
  categoria_id?: string;
  data_transacao?: string;
  data_vencimento?: string;
  pago?: boolean;
  data_pagamento?: string;
  observacoes?: string;
}

export interface TransacaoResponseDto {
  id: string;
  descricao: string;
  tipo: string;
  valor: number;
  conta_id: string;
  categoria_id?: string;
  data_transacao: string;
  data_vencimento?: string;
  pago: boolean;
  data_pagamento?: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface TransacaoFilterDto {
  conta_id?: string;
  categoria_id?: string;
  tipo?: 'receita' | 'despesa' | 'transferencia';
  data_inicio?: string;
  data_fim?: string;
  pago?: boolean;
}
