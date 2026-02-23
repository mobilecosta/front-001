/**
 * DTOs para Contas Bancárias
 */

export interface CreateContaDto {
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'cartao_credito';
  banco?: string;
  agencia?: string;
  numero_conta?: string;
  saldo_inicial: number;
}

export interface UpdateContaDto {
  nome?: string;
  tipo?: 'corrente' | 'poupanca' | 'investimento' | 'cartao_credito';
  banco?: string;
  agencia?: string;
  numero_conta?: string;
  ativo?: boolean;
}

export interface ContaResponseDto {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  banco?: string;
  agencia?: string;
  numero_conta?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
