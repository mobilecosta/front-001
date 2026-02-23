/**
 * Página de Contas
 * CRUD de contas bancárias
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contas</h1>
        <Button onClick={handleNewConta}>Nova Conta</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas</CardTitle>
        </CardHeader>
        <CardContent>
          {contas.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma conta registrada</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Nome</th>
                    <th className="text-left py-2 px-2">Tipo</th>
                    <th className="text-left py-2 px-2">Banco</th>
                    <th className="text-right py-2 px-2">Saldo</th>
                    <th className="text-center py-2 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((conta) => (
                    <tr key={conta.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">{conta.nome}</td>
                      <td className="py-2 px-2">
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {conta.tipo}
                        </span>
                      </td>
                      <td className="py-2 px-2">{conta.banco || '-'}</td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {formatCurrency(conta.saldo)}
                      </td>
                      <td className="text-center py-2 px-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditConta(conta)}
                          className="mr-2"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteConta(conta.id)}
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Formulário */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedConta ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
            <DialogDescription>
              {selectedConta ? 'Atualize os dados da conta' : 'Preencha os dados para criar uma nova conta'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* Aqui iria o DynamicForm com metadata */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSaveConta({})}
                className="w-full"
              >
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contas;
