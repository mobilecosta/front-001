/**
 * Página de Dashboard
 * Exibe indicadores, gráficos e resumo financeiro
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '../hooks/useApi';
import type { DashboardResponse } from '../types/po-ui.types';

export const Dashboard: React.FC = () => {
  const { get } = useApi();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    fim: new Date().toISOString().split('T')[0],
  });

  // Carregar dados do dashboard
  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await get<DashboardResponse>('/api/dashboard');
      setDashboard(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dashboard';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
        <Button onClick={loadDashboard}>Tentar Novamente</Button>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="text-center py-8">Nenhum dado disponível</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard - {dashboard.tenant.nome}</h1>

        {/* Filtro de período */}
        <div className="flex gap-2 mb-4">
          <Input
            type="date"
            value={dateRange.inicio}
            onChange={(e: any) => setDateRange({ ...dateRange, inicio: e.target.value })}
            className="w-32"
          />
          <Input
            type="date"
            value={dateRange.fim}
            onChange={(e: any) => setDateRange({ ...dateRange, fim: e.target.value })}
            className="w-32"
          />
          <Button onClick={loadDashboard}>Filtrar</Button>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboard.indicadores.saldoTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(dashboard.indicadores.receitasTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(dashboard.indicadores.despesasTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboard.indicadores.transacoesAberto}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.ultimasTransacoes.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma transação registrada</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Descrição</th>
                    <th className="text-right py-2 px-2">Valor</th>
                    <th className="text-center py-2 px-2">Tipo</th>
                    <th className="text-center py-2 px-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.ultimasTransacoes.map((transacao) => (
                    <tr key={transacao.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">{transacao.descricao}</td>
                      <td
                        className={`text-right py-2 px-2 font-semibold ${
                          transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                      </td>
                      <td className="text-center py-2 px-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            transacao.tipo === 'receita'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transacao.tipo}
                        </span>
                      </td>
                      <td className="text-center py-2 px-2">
                        {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
