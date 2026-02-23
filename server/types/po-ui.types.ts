/**
 * Tipos e Interfaces para API Padrão PO UI (Totvs)
 * Padronização de respostas, paginação e estrutura de dados
 */

/**
 * Resposta padrão de listagem com paginação
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Resposta padrão de sucesso
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

/**
 * Resposta padrão de erro
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * Contexto de requisição com tenant e usuário
 */
export interface RequestContext {
  tenantId: string;
  userId: string;
  userRole: 'admin' | 'usuario' | 'visualizador';
  userEmail: string;
}

/**
 * Payload do JWT
 */
export interface JwtPayload {
  sub: string; // userId
  tenantId: string;
  email: string;
  role: 'admin' | 'usuario' | 'visualizador';
  iat: number;
  exp: number;
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    nome: string;
    tenantId: string;
    role: string;
  };
}

/**
 * Metadados de formulário dinâmico
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

/**
 * Metadados de menu
 */
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

/**
 * Resposta de Dashboard
 */
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
