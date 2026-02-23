import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as transacoesDb from "../db/transacoes.db";

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
      if (!ctx.user) throw new Error("Unauthorized");
      
      const tenantId = 1; // Placeholder
      
      // Obter saldo total
      const saldoData = await transacoesDb.obterSaldoTotalPorTenant(tenantId);
      
      // Obter últimas transações
      const ultimasTransacoes = await transacoesDb.listarTransacoes(
        tenantId,
        {
          data_inicio: input.data_inicio ? new Date(input.data_inicio) : undefined,
          data_fim: input.data_fim ? new Date(input.data_fim) : undefined,
        },
        1,
        5
      );

      // Obter transações em aberto
      const transacoesAberto = await transacoesDb.listarTransacoes(
        tenantId,
        {
          pago: false,
        },
        1,
        1000
      );

      // Calcular gráficos por mês
      const graficoReceitas = [];
      const graficoDespesas = [];
      
      for (let i = 0; i < 6; i++) {
        const data = new Date();
        data.setMonth(data.getMonth() - i);
        const mesInicio = new Date(data.getFullYear(), data.getMonth(), 1);
        const mesFim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
        
        const receitas = await transacoesDb.listarTransacoes(
          tenantId,
          {
            tipo: "receita",
            data_inicio: mesInicio,
            data_fim: mesFim,
          },
          1,
          1000
        );

        const despesas = await transacoesDb.listarTransacoes(
          tenantId,
          {
            tipo: "despesa",
            data_inicio: mesInicio,
            data_fim: mesFim,
          },
          1,
          1000
        );

        const totalReceitas = receitas.items.reduce((acc, t) => {
          const valor = typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor;
          return acc + (valor || 0);
        }, 0);
        
        const totalDespesas = despesas.items.reduce((acc, t) => {
          const valor = typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor;
          return acc + (valor || 0);
        }, 0);

        const mesNome = mesInicio.toLocaleString("pt-BR", { month: "short" });
        graficoReceitas.unshift({ mes: mesNome, valor: totalReceitas });
        graficoDespesas.unshift({ mes: mesNome, valor: totalDespesas });
      }

      return {
        tenant: {
          id: tenantId,
          nome: "Meu Negócio",
        },
        indicadores: {
          saldoTotal: saldoData.saldo,
          receitasTotal: saldoData.receitas,
          despesasTotal: saldoData.despesas,
          transacoesAberto: transacoesAberto.totalRecords,
        },
        graficoReceitas,
        graficoDespesas,
        ultimasTransacoes: ultimasTransacoes.items.map((t) => ({
          id: t.id,
          descricao: t.descricao,
          valor: typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor,
          tipo: t.tipo,
          data: t.data_transacao,
        })),
      };
    }),
});
