import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

// Schemas de validação
const tenantSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  ativo: z.boolean().default(true),
});

const tenantUpdateSchema = tenantSchema.partial();

export const tenantsRouter = router({
  // Obter tenant atual
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implementar query no Supabase
    return {
      id: ctx.user.id,
      nome: "Meu Negócio",
      email: ctx.user.email,
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
  }),

  // Listar tenants (admin only)
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Verificar se é admin
      // TODO: Implementar query no Supabase

      return {
        items: [],
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: 0,
        totalPages: 0,
      };
    }),

  // Criar novo tenant
  create: protectedProcedure
    .input(tenantSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Verificar se é admin
      // TODO: Implementar insert no Supabase
      return {
        id: "new-id",
        ...input,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Atualizar tenant
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: tenantUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Verificar se é admin ou proprietário do tenant
      // TODO: Implementar update no Supabase
      return {
        id: input.id,
        ...input.data,
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Deletar tenant
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Verificar se é admin
      // TODO: Implementar delete no Supabase
      return { success: true };
    }),
});
