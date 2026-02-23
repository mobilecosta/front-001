/**
 * Página de Dashboard
 * Exibe indicadores, gráficos e resumo financeiro
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
} from '@mui/material';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={loadDashboard} sx={{ mt: 2 }}>
          Tentar Novamente
        </Button>
      </Container>
    );
  }

  if (!dashboard) {
    return <Typography>Nenhum dado disponível</Typography>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Dashboard - {dashboard.tenant.nome}
        </Typography>

        {/* Filtro de período */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            type="date"
            label="Data Início"
            value={dateRange.inicio}
            onChange={(e: any) => setDateRange({ ...dateRange, inicio: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            type="date"
            label="Data Fim"
            value={dateRange.fim}
            onChange={(e: any) => setDateRange({ ...dateRange, fim: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button variant="contained" onClick={loadDashboard}>
            Filtrar
          </Button>
        </Box>
      </Box>

      {/* Indicadores Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Saldo Total
              </Typography>
              <Typography variant="h5" sx={{ color: '#4CAF50' }}>
                {formatCurrency(dashboard.indicadores.saldoTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Receitas
              </Typography>
              <Typography variant="h5" sx={{ color: '#2196F3' }}>
                {formatCurrency(dashboard.indicadores.receitasTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Despesas
              </Typography>
              <Typography variant="h5" sx={{ color: '#F44336' }}>
                {formatCurrency(dashboard.indicadores.despesasTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Em Aberto
              </Typography>
              <Typography variant="h5" sx={{ color: '#FF9800' }}>
                {dashboard.indicadores.transacoesAberto}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Últimas Transações */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Últimas Transações
          </Typography>

          {dashboard.ultimasTransacoes.length === 0 ? (
            <Typography color="textSecondary">Nenhuma transação registrada</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Descrição</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Valor</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Tipo</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.ultimasTransacoes.map((transacao) => (
                    <tr key={transacao.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{transacao.descricao}</td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '8px',
                          color: transacao.tipo === 'receita' ? '#4CAF50' : '#F44336',
                        }}
                      >
                        {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor:
                              transacao.tipo === 'receita' ? '#E8F5E9' : '#FFEBEE',
                            color: transacao.tipo === 'receita' ? '#4CAF50' : '#F44336',
                            fontSize: '12px',
                          }}
                        >
                          {transacao.tipo}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px' }}>
                        {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
