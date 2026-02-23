import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

// Schemas de validação
const categoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["receita", "despesa"]),
  cor: z.string().optional(),
  icone: z.string().optional(),
  ativo: z.boolean().default(true),
});

const categoriaUpdateSchema = categoriaSchema.partial();

export const categoriasRouter = router({
  // Listar categorias com paginação
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
        tipo: z.enum(["receita", "despesa"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implementar query no Supabase
      // const query = supabase
      //   .from("categorias")
      //   .select("*", { count: "exact" })
      //   .eq("tenant_id", ctx.user.tenantId);
      //
      // if (input.tipo) {
      //   query.eq("tipo", input.tipo);
      // }

      // Mock data para teste
      const mockCategorias = [
        {
          id: "1",
          nome: "Salário",
          tipo: "receita" as const,
          cor: "#4CAF50",
          icone: "income",
          ativo: true,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
        {
          id: "2",
          nome: "Alimentação",
          tipo: "despesa" as const,
          cor: "#FF9800",
          icone: "food",
          ativo: true,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
      ];

      return {
        items: mockCategorias,
        page: input.page,
        pageSize: input.pageSize,
        totalRecords: 2,
        totalPages: 1,
      };
    }),

  // Obter categoria por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: Implementar query no Supabase
      return null;
    }),

  // Criar nova categoria
  create: protectedProcedure
    .input(categoriaSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar insert no Supabase
      return {
        id: "new-id",
        ...input,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };
    }),

  // Atualizar categoria
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: categoriaUpdateSchema,
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

  // Deletar categoria
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar delete no Supabase
      return { success: true };
    }),
});
