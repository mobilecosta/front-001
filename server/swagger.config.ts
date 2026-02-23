/**
 * Configuração Swagger/OpenAPI 3.0
 */

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Finanças Mobile API',
    description: 'API REST para sistema de controle financeiro multi-tenant',
    version: '1.0.0',
    contact: {
      name: 'Suporte',
      email: 'suporte@financas-mobile.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor local',
    },
    {
      url: 'https://api.financas-mobile.com',
      description: 'Servidor de produção',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticação',
      },
    },
    schemas: {
      PaginatedResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { type: 'object' },
          },
          page: { type: 'integer' },
          pageSize: { type: 'integer' },
          totalRecords: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [false] },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              nome: { type: 'string' },
              tenantId: { type: 'string' },
              role: { type: 'string', enum: ['admin', 'usuario', 'visualizador'] },
            },
          },
        },
      },
      Conta: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          tipo: {
            type: 'string',
            enum: ['corrente', 'poupanca', 'investimento', 'cartao_credito'],
          },
          saldo: { type: 'number', format: 'double' },
          banco: { type: 'string' },
          agencia: { type: 'string' },
          numero_conta: { type: 'string' },
          ativo: { type: 'boolean' },
          criado_em: { type: 'string', format: 'date-time' },
          atualizado_em: { type: 'string', format: 'date-time' },
        },
      },
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          tipo: { type: 'string', enum: ['receita', 'despesa'] },
          cor: { type: 'string' },
          icone: { type: 'string' },
          ativo: { type: 'boolean' },
          criado_em: { type: 'string', format: 'date-time' },
          atualizado_em: { type: 'string', format: 'date-time' },
        },
      },
      Transacao: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          descricao: { type: 'string' },
          tipo: { type: 'string', enum: ['receita', 'despesa', 'transferencia'] },
          valor: { type: 'number', format: 'double' },
          conta_id: { type: 'string', format: 'uuid' },
          categoria_id: { type: 'string', format: 'uuid' },
          data_transacao: { type: 'string', format: 'date' },
          data_vencimento: { type: 'string', format: 'date' },
          pago: { type: 'boolean' },
          data_pagamento: { type: 'string', format: 'date' },
          observacoes: { type: 'string' },
          criado_em: { type: 'string', format: 'date-time' },
          atualizado_em: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Login de usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string' },
                },
                required: ['email', 'senha'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: {
            description: 'Credenciais inválidas',
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registro de novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string' },
                  tenantNome: { type: 'string' },
                  tenantCnpj: { type: 'string' },
                },
                required: ['nome', 'email', 'senha', 'tenantNome'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário registrado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
          },
        },
      },
    },
    '/contas': {
      get: {
        tags: ['Contas'],
        summary: 'Listar contas',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Lista de contas',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/PaginatedResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Contas'],
        summary: 'Criar nova conta',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  tipo: { type: 'string', enum: ['corrente', 'poupanca', 'investimento', 'cartao_credito'] },
                  banco: { type: 'string' },
                  agencia: { type: 'string' },
                  numero_conta: { type: 'string' },
                  saldo_inicial: { type: 'number' },
                },
                required: ['nome', 'tipo', 'saldo_inicial'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Conta criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Conta' },
              },
            },
          },
        },
      },
    },
  },
};
