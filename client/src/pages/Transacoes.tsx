import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export default function Transacoes() {
  const [page, setPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState<"receita" | "despesa" | "">("" as any);
  const [filtroPago, setFiltroPago] = useState<"todos" | "pago" | "aberto">("todos" as any);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    tipo: "despesa" as "receita" | "despesa" | "transferencia",
    valor: "",
    conta_id: "1",
    data_transacao: new Date().toISOString().split("T")[0],
  });

  // Query para listar transações
  const { data: transacoesData, isLoading, refetch } = trpc.transacoes.list.useQuery({
    page,
    pageSize: 10,
    tipo: filtroTipo ? (filtroTipo as "receita" | "despesa") : undefined,
    pago: filtroPago === "pago" ? true : filtroPago === "aberto" ? false : undefined,
  });

  // Mutation para criar transação
  const createMutation = trpc.transacoes.create.useMutation({
    onSuccess: () => {
      toast.success("Transação criada com sucesso!");
      setFormData({
        descricao: "",
        tipo: "despesa",
        valor: "",
        conta_id: "1",
        data_transacao: new Date().toISOString().split("T")[0],
      });
      setIsCreating(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Mutation para deletar transação
  const deleteMutation = trpc.transacoes.delete.useMutation({
    onSuccess: () => {
      toast.success("Transação deletada!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Mutation para marcar como paga
  const pagarMutation = trpc.transacoes.marcarComoPaga.useMutation({
    onSuccess: () => {
      toast.success("Transação marcada como paga!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      ...formData,
      valor: formData.valor,
      conta_id: parseInt(formData.conta_id),
      data_transacao: new Date(formData.data_transacao).toISOString(),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleMarcarComoPaga = (id: number) => {
    pagarMutation.mutate({
      id,
      data_pagamento: new Date().toISOString(),
    });
  };

  const getTipoBadge = (tipo: string) => {
    if (tipo === "receita") {
      return <Badge className="bg-green-100 text-green-800">Receita</Badge>;
    } else if (tipo === "despesa") {
      return <Badge className="bg-red-100 text-red-800">Despesa</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Transferência</Badge>;
  };

  const getPagoBadge = (pago: boolean) => {
    if (pago) {
      return <Badge className="bg-blue-100 text-blue-800">Pago</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-gray-600 mt-1">Gerencie suas receitas e despesas</p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </Button>
      </div>

      {/* Formulário de Criação */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Transação</CardTitle>
            <CardDescription>Adicione uma nova transação ao seu registro</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Ex: Venda de produtos"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data_transacao}
                    onChange={(e) =>
                      setFormData({ ...formData, data_transacao: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar Transação
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={filtroPago} onValueChange={(value: any) => setFiltroPago(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFiltroTipo("");
                  setFiltroPago("todos");
                  setPage(1);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transações
            {transacoesData && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({transacoesData.totalRecords} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : transacoesData?.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma transação encontrada
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoesData?.items.map((transacao: any) => (
                      <TableRow key={transacao.id}>
                        <TableCell className="font-medium">{transacao.descricao}</TableCell>
                        <TableCell>{getTipoBadge(transacao.tipo)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              transacao.tipo === "receita"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {transacao.tipo === "receita" ? "+" : "-"}
                            {typeof transacao.valor === "string"
                              ? parseFloat(transacao.valor).toFixed(2)
                              : transacao.valor.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(transacao.data_transacao).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{getPagoBadge(transacao.pago)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!transacao.pago && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarcarComoPaga(transacao.id)}
                                disabled={pagarMutation.isPending}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(transacao.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {transacoesData && transacoesData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4">
                    Página {page} de {transacoesData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === transacoesData.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
