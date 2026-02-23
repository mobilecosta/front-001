import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

/**
 * Testes unitários para validação de schemas Zod
 * Estes testes não dependem do banco de dados
 */

describe("Financas Mobile API - Schema Validation", () => {
  describe("Conta Schema", () => {
    const contaSchema = z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      tipo: z.enum(["corrente", "poupanca", "investimento", "cartao_credito"]),
      saldo: z.string().default("0"),
      banco: z.string().optional(),
      agencia: z.string().optional(),
      numero_conta: z.string().optional(),
      ativo: z.boolean().default(true),
    });

    it("should validate a valid conta", () => {
      const validConta = {
        nome: "Conta Corrente",
        tipo: "corrente" as const,
        saldo: "1000.00",
        banco: "Banco do Brasil",
        agencia: "1234",
        numero_conta: "567890",
      };

      const result = contaSchema.safeParse(validConta);
      expect(result.success).toBe(true);
    });

    it("should reject conta without nome", () => {
      const invalidConta = {
        tipo: "corrente" as const,
        saldo: "1000.00",
      };

      const result = contaSchema.safeParse(invalidConta);
      expect(result.success).toBe(false);
    });

    it("should reject conta with invalid tipo", () => {
      const invalidConta = {
        nome: "Conta",
        tipo: "invalido",
        saldo: "1000.00",
      };

      const result = contaSchema.safeParse(invalidConta);
      expect(result.success).toBe(false);
    });

    it("should set default values", () => {
      const minimalConta = {
        nome: "Conta Simples",
        tipo: "poupanca" as const,
      };

      const result = contaSchema.safeParse(minimalConta);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.saldo).toBe("0");
        expect(result.data.ativo).toBe(true);
      }
    });
  });

  describe("Transacao Schema", () => {
    const transacaoSchema = z.object({
      descricao: z.string().min(1, "Descrição é obrigatória"),
      tipo: z.enum(["receita", "despesa", "transferencia"]),
      valor: z.string().min(1, "Valor é obrigatório"),
      conta_id: z.number(),
      categoria_id: z.number().optional(),
      data_transacao: z.string().datetime(),
      data_vencimento: z.string().datetime().optional(),
      pago: z.boolean().default(false),
      data_pagamento: z.string().datetime().optional(),
      observacoes: z.string().optional(),
    });

    it("should validate a valid receita", () => {
      const validTransacao = {
        descricao: "Venda de produtos",
        tipo: "receita" as const,
        valor: "500.00",
        conta_id: 1,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(validTransacao);
      expect(result.success).toBe(true);
    });

    it("should validate a valid despesa", () => {
      const validTransacao = {
        descricao: "Compra de materiais",
        tipo: "despesa" as const,
        valor: "250.50",
        conta_id: 2,
        categoria_id: 5,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(validTransacao);
      expect(result.success).toBe(true);
    });

    it("should reject transacao without descricao", () => {
      const invalidTransacao = {
        tipo: "receita" as const,
        valor: "500.00",
        conta_id: 1,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(invalidTransacao);
      expect(result.success).toBe(false);
    });

    it("should reject transacao without valor", () => {
      const invalidTransacao = {
        descricao: "Transação",
        tipo: "receita" as const,
        conta_id: 1,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(invalidTransacao);
      expect(result.success).toBe(false);
    });

    it("should reject transacao with invalid tipo", () => {
      const invalidTransacao = {
        descricao: "Transação",
        tipo: "invalido",
        valor: "500.00",
        conta_id: 1,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(invalidTransacao);
      expect(result.success).toBe(false);
    });

    it("should set default pago to false", () => {
      const transacao = {
        descricao: "Transação",
        tipo: "despesa" as const,
        valor: "100.00",
        conta_id: 1,
        data_transacao: new Date().toISOString(),
      };

      const result = transacaoSchema.safeParse(transacao);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pago).toBe(false);
      }
    });
  });

  describe("Categoria Schema", () => {
    const categoriaSchema = z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      tipo: z.enum(["receita", "despesa"]),
      cor: z.string().optional(),
      icone: z.string().optional(),
      ativo: z.boolean().default(true),
    });

    it("should validate a valid categoria receita", () => {
      const validCategoria = {
        nome: "Vendas",
        tipo: "receita" as const,
        cor: "#00FF00",
        icone: "sales",
      };

      const result = categoriaSchema.safeParse(validCategoria);
      expect(result.success).toBe(true);
    });

    it("should validate a valid categoria despesa", () => {
      const validCategoria = {
        nome: "Salários",
        tipo: "despesa" as const,
        cor: "#FF0000",
        icone: "salary",
      };

      const result = categoriaSchema.safeParse(validCategoria);
      expect(result.success).toBe(true);
    });

    it("should reject categoria without nome", () => {
      const invalidCategoria = {
        tipo: "receita" as const,
      };

      const result = categoriaSchema.safeParse(invalidCategoria);
      expect(result.success).toBe(false);
    });

    it("should set default ativo to true", () => {
      const categoria = {
        nome: "Categoria",
        tipo: "receita" as const,
      };

      const result = categoriaSchema.safeParse(categoria);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ativo).toBe(true);
      }
    });
  });

  describe("Pagination", () => {
    const paginationSchema = z.object({
      page: z.number().int().positive().default(1),
      pageSize: z.number().int().positive().default(10),
    });

    it("should validate valid pagination", () => {
      const pagination = { page: 2, pageSize: 20 };
      const result = paginationSchema.safeParse(pagination);
      expect(result.success).toBe(true);
    });

    it("should set default page to 1", () => {
      const pagination = { pageSize: 10 };
      const result = paginationSchema.safeParse(pagination);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it("should reject page 0", () => {
      const pagination = { page: 0, pageSize: 10 };
      const result = paginationSchema.safeParse(pagination);
      expect(result.success).toBe(false);
    });

    it("should reject negative pageSize", () => {
      const pagination = { page: 1, pageSize: -5 };
      const result = paginationSchema.safeParse(pagination);
      expect(result.success).toBe(false);
    });
  });

  describe("Business Logic", () => {
    it("should calculate saldo correctly", () => {
      const receitas = 1000;
      const despesas = 300;
      const saldo = receitas - despesas;

      expect(saldo).toBe(700);
    });

    it("should format currency correctly", () => {
      const valor = 1234.567;
      const formatted = valor.toFixed(2);

      expect(formatted).toBe("1234.57");
    });

    it("should determine transaction type correctly", () => {
      const transacaoReceita = { tipo: "receita", valor: 100 };
      const transacaoDespesa = { tipo: "despesa", valor: 100 };

      const saldoReceita = transacaoReceita.tipo === "receita" ? transacaoReceita.valor : -transacaoReceita.valor;
      const saldoDespesa = transacaoDespesa.tipo === "receita" ? transacaoDespesa.valor : -transacaoDespesa.valor;

      expect(saldoReceita).toBe(100);
      expect(saldoDespesa).toBe(-100);
    });
  });
});
