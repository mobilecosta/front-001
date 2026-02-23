import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

export const dashboardRouter = router({
  // Obter dados do dashboard
  get: protectedProcedure
    .input(
      z.object({
        data_inicio: z.string().datetime().optional(),
        data_fim: z.string().datetime().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implementar queries no Supabase para:
      // 1. Calcular saldo total de todas as contas
      // 2. Calcular receitas do período
      // 3. Calcular despesas do período
      // 4. Contar transações em aberto
      // 5. Gráfico de receitas por mês
      // 6. Gráfico de despesas por mês
      // 7. Últimas transações

      // Mock data para teste
      return {
        tenant: {
          id: ctx.user.id,
          nome: "Meu Negócio",
        },
        indicadores: {
          saldoTotal: 15000,
          receitasTotal: 25000,
          despesasTotal: 10000,
          transacoesAberto: 5,
        },
        graficoReceitas: [
          { mes: "Jan", valor: 5000 },
          { mes: "Fev", valor: 6000 },
          { mes: "Mar", valor: 7000 },
          { mes: "Abr", valor: 7000 },
        ],
        graficoDespesas: [
          { mes: "Jan", valor: 2000 },
          { mes: "Fev", valor: 2500 },
          { mes: "Mar", valor: 3000 },
          { mes: "Abr", valor: 2500 },
        ],
        ultimasTransacoes: [
          {
            id: "1",
            descricao: "Salário",
            valor: 5000,
            tipo: "receita",
            data: new Date().toISOString(),
          },
          {
            id: "2",
            descricao: "Aluguel",
            valor: 1500,
            tipo: "despesa",
            data: new Date().toISOString(),
          },
        ],
      };
    }),
});
