import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as transacoesDb from "../db/transacoes.db";

// Schemas de validação
const transacaoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.enum(["receita", "despesa", "transferencia"]),
  valor: z.string().min(1, "Valor é obrigatório"),
  conta_id: z.number(),
  categoria_id: z.number().optional(),
  data_transacao: z.string().datetime(),
  data_vencimento: z.string().datetime().optional(),
  pago: z.boolean().default(false),
  data_pagamento: z.string().datetime().optional(),
  observacoes: z.string().optional(),
});

const transacaoUpdateSchema = transacaoSchema.partial();

export const transacoesRouter = router({
  // Listar transações com paginação e filtros
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
        conta_id: z.number().optional(),
        categoria_id: z.number().optional(),
        tipo: z.enum(["receita", "despesa", "transferencia"]).optional(),
        data_inicio: z.string().datetime().optional(),
        data_fim: z.string().datetime().optional(),
        pago: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      
      const filtros = {
        conta_id: input.conta_id,
        categoria_id: input.categoria_id,
        tipo: input.tipo,
        data_inicio: input.data_inicio ? new Date(input.data_inicio) : undefined,
        data_fim: input.data_fim ? new Date(input.data_fim) : undefined,
        pago: input.pago,
      };

      const result = await transacoesDb.listarTransacoes(
        tenantId,
        filtros,
        input.page,
        input.pageSize
      );

      return {
        items: result.items,
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      };
    }),

  // Obter transação por ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      return transacoesDb.obterTransacaoById(input.id, tenantId);
    }),

  // Criar nova transação
  create: protectedProcedure
    .input(transacaoSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      return transacoesDb.criarTransacao(tenantId, {
        ...input,
        data_transacao: new Date(input.data_transacao),
        data_vencimento: input.data_vencimento ? new Date(input.data_vencimento) : undefined,
        data_pagamento: input.data_pagamento ? new Date(input.data_pagamento) : undefined,
      } as any);
    }),

  // Atualizar transação
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: transacaoUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      const updateData = {
        ...input.data,
        data_transacao: input.data.data_transacao ? new Date(input.data.data_transacao) : undefined,
        data_vencimento: input.data.data_vencimento ? new Date(input.data.data_vencimento) : undefined,
        data_pagamento: input.data.data_pagamento ? new Date(input.data.data_pagamento) : undefined,
      };
      
      return transacoesDb.atualizarTransacao(input.id, tenantId, updateData as any);
    }),

  // Deletar transação
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      await transacoesDb.deletarTransacao(input.id, tenantId);
      return { success: true };
    }),

  // Marcar como paga
  marcarComoPaga: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data_pagamento: z.string().datetime(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      await transacoesDb.marcarComoPaga(input.id, tenantId, new Date(input.data_pagamento));
      return { success: true };
    }),

  // Obter saldo total do tenant
  obterSaldoTotal: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    
    const tenantId = 1; // Placeholder
    return transacoesDb.obterSaldoTotalPorTenant(tenantId);
  }),
});
