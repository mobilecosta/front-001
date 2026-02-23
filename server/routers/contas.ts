import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as contasDb from "../db/contas.db";

// Schemas de validação
const contaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["corrente", "poupanca", "investimento", "cartao_credito"]),
  saldo: z.string().default("0"),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  numero_conta: z.string().optional(),
  ativo: z.boolean().default(true),
});

const contaUpdateSchema = contaSchema.partial();

export const contasRouter = router({
  // Listar contas com paginação
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      // TODO: Obter tenant_id do contexto do usuário
      const tenantId = 1; // Placeholder
      
      const result = await contasDb.listarContas(tenantId, input.page, input.pageSize);
      
      return {
        items: result.items,
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      };
    }),

  // Obter conta por ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      return contasDb.obterContaById(input.id, tenantId);
    }),

  // Criar nova conta
  create: protectedProcedure
    .input(contaSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      return contasDb.criarConta(tenantId, input as any);
    }),

  // Atualizar conta
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: contaUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      return contasDb.atualizarConta(input.id, tenantId, input.data as any);
    }),

  // Deletar conta
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      await contasDb.deletarConta(input.id, tenantId);
      return { success: true };
    }),
});
