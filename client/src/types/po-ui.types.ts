/**
 * Tipos para o Frontend
 * Espelhando os tipos do backend
 */

export interface FormFieldMetadata {
  nome: string;
  tipo: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'color' | 'email' | 'password';
  label: string;
  placeholder?: string;
  obrigatorio: boolean;
  visivel: boolean;
  ordem: number;
  validacao?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  opcoes?: Array<{ label: string; valor: string }>;
}

export interface FormMetadata {
  id: string;
  nome: string;
  descricao: string;
  entidade: string;
  campos: FormFieldMetadata[];
  validacoes?: Record<string, any>;
  ativo: boolean;
}

export interface MenuMetadata {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  rota: string;
  ordem: number;
  ativo: boolean;
  permissoes: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface Conta {
  id: string;
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'cartao_credito';
  saldo: number;
  banco?: string;
  agencia?: string;
  numero_conta?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  cor?: string;
  icone?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  tipo: 'receita' | 'despesa' | 'transferencia';
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

export interface Tenant {
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

export interface User {
  id: string;
  email: string;
  nome: string;
  tenantId: string;
  role: 'admin' | 'usuario' | 'visualizador';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface DashboardResponse {
  tenant: {
    id: string;
    nome: string;
  };
  indicadores: {
    saldoTotal: number;
    receitasTotal: number;
    despesasTotal: number;
    transacoesAberto: number;
  };
  graficoReceitas: Array<{
    mes: string;
    valor: number;
  }>;
  graficoDespesas: Array<{
    mes: string;
    valor: number;
  }>;
  ultimasTransacoes: Array<{
    id: string;
    descricao: string;
    valor: number;
    tipo: string;
    data: string;
  }>;
}
