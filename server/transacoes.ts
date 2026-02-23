import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

// Schemas de validação
const transacaoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.enum(["receita", "despesa", "transferencia"]),
  valor: z.number().positive("Valor deve ser positivo"),
  conta_id: z.string(),
  categoria_id: z.string().optional(),
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
        conta_id: z.string().optional(),
        categoria_id: z.string().optional(),
        tipo: z.enum(["receita", "despesa", "transferencia"]).optional(),
        data_inicio: z.string().datetime().optional(),
        data_fim: z.string().datetime().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implementar query com filtros no Supabase
      // const query = supabase
      //   .from("transacoes")
      //   .select("*", { count: "exact" })
      //   .eq("tenant_id", ctx.user.tenantId);

      // Mock data para teste
      const mockTransacoes = [
        {
          id: "1",
          descricao: "Salário",
          tipo: "receita" as const,
          valor: 5000,
          conta_id: "1",
          categoria_id: "1",
          data_transacao: new Date().toISOString(),
          pago: true,
          data_pagamento: new Date().toISOString(),
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
      ];

      return {
        items: mockTransacoes,
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: 1,
        totalPages: 1,
      };
    }),

  // Obter transação por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: Implementar query no Supabase
      return null;
    }),

  // Criar nova transação
  create: protectedProcedure
    .input(transacaoSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar insert no Supabase
      // TODO: Atualizar saldo da conta
      return {
        id: "new-id",
        ...input,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Atualizar transação
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: transacaoUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar update no Supabase
      // TODO: Recalcular saldo da conta se valor mudou
      return {
        id: input.id,
        ...input.data,
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Deletar transação
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar delete no Supabase
      // TODO: Reverter saldo da conta
      return { success: true };
    }),

  // Marcar como paga
  marcarComoPaga: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data_pagamento: z.string().datetime(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar update no Supabase
      return { success: true };
    }),
});
