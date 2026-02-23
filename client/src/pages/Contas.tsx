/**
 * Página de Contas
 * CRUD de contas bancárias
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import DynamicForm from '../components/DynamicForm';
import type { Conta, PaginatedResponse } from '../types/po-ui.types';

export const Contas: React.FC = () => {
  const { get, post, put, delete: deleteApi } = useApi();
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Carregar contas
  const loadContas = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await get<PaginatedResponse<Conta>>(
        `/api/contas?page=${pageNum}&pageSize=10`
      );
      setContas(data.items);
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar contas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContas();
  }, []);

  // Abrir diálogo para nova conta
  const handleNewConta = () => {
    setSelectedConta(null);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar conta
  const handleEditConta = (conta: Conta) => {
    setSelectedConta(conta);
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedConta(null);
  };

  // Salvar conta
  const handleSaveConta = async (data: Record<string, any>) => {
    try {
      if (selectedConta) {
        await put(`/api/contas/${selectedConta.id}`, data);
      } else {
        await post('/api/contas', data);
      }
      handleCloseDialog();
      loadContas(page);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar conta';
      setError(message);
    }
  };

  // Deletar conta
  const handleDeleteConta = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta conta?')) {
      try {
        await deleteApi(`/api/contas/${id}`);
        loadContas(page);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao deletar conta';
        setError(message);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading && contas.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Contas</Typography>
        <Button variant="contained" onClick={handleNewConta}>
          Nova Conta
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Banco</TableCell>
              <TableCell align="right">Saldo</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contas.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell>{conta.nome}</TableCell>
                <TableCell>{conta.tipo}</TableCell>
                <TableCell>{conta.banco || '-'}</TableCell>
                <TableCell align="right">{formatCurrency(conta.saldo)}</TableCell>
                <TableCell align="center">
                  <Button size="small" onClick={() => handleEditConta(conta)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteConta(conta.id)}>
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Formulário */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedConta ? 'Editar Conta' : 'Nova Conta'}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleSaveConta({})}
              sx={{ mr: 1 }}
            >
              Salvar
            </Button>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Contas;
