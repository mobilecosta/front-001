import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

// Schemas de validação
const contaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["corrente", "poupanca", "investimento", "cartao_credito"]),
  saldo: z.number().default(0),
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
      // TODO: Implementar query no Supabase
      // const { data, count } = await supabase
      //   .from("contas")
      //   .select("*", { count: "exact" })
      //   .eq("tenant_id", ctx.user.tenantId)
      //   .range((input.page - 1) * input.pageSize, input.page * input.pageSize - 1);

      // Mock data para teste
      const mockContas = [
        {
          id: "1",
          nome: "Conta Corrente",
          tipo: "corrente" as const,
          saldo: 5000,
          banco: "Banco do Brasil",
          agencia: "1234",
          numero_conta: "56789-0",
          ativo: true,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
      ];

      return {
        items: mockContas,
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: 1,
        totalPages: 1,
      };
    }),

  // Obter conta por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: Implementar query no Supabase
      return null;
    }),

  // Criar nova conta
  create: protectedProcedure
    .input(contaSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar insert no Supabase
      // const { data, error } = await supabase
      //   .from("contas")
      //   .insert({
      //     ...input,
      //     tenant_id: ctx.user.tenantId,
      //   })
      //   .select()
      //   .single();

      return {
        id: "new-id",
        ...input,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Atualizar conta
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: contaUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar update no Supabase
      return {
        id: input.id,
        ...input.data,
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Deletar conta
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar delete no Supabase
      return { success: true };
    }),
});
