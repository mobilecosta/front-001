import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context com usuário autenticado
function createMockContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Financas Mobile API - Routers", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("Auth Router", () => {
    it("should return current user", async () => {
      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("should logout successfully", async () => {
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });

  describe("Contas Router", () => {
    it("should list contas with pagination", async () => {
      const result = await caller.contas.list({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it("should create a new conta", async () => {
      const result = await caller.contas.create({
        nome: "Conta Teste",
        tipo: "corrente",
        saldo: 1000,
        banco: "Banco Teste",
      });

      expect(result).toBeDefined();
      expect(result.nome).toBe("Conta Teste");
      expect(result.tipo).toBe("corrente");
    });

    it("should update a conta", async () => {
      const result = await caller.contas.update({
        id: "1",
        data: {
          nome: "Conta Atualizada",
        },
      });

      expect(result).toBeDefined();
      expect(result.nome).toBe("Conta Atualizada");
    });

    it("should delete a conta", async () => {
      const result = await caller.contas.delete({ id: "1" });
      expect(result.success).toBe(true);
    });
  });

  describe("Categorias Router", () => {
    it("should list categorias with pagination", async () => {
      const result = await caller.categorias.list({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should create a new categoria", async () => {
      const result = await caller.categorias.create({
        nome: "Categoria Teste",
        tipo: "receita",
        cor: "#FF0000",
      });

      expect(result).toBeDefined();
      expect(result.nome).toBe("Categoria Teste");
      expect(result.tipo).toBe("receita");
    });

    it("should list categorias filtered by type", async () => {
      const result = await caller.categorias.list({
        page: 1,
        pageSize: 10,
        tipo: "receita",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe("Transacoes Router", () => {
    it("should list transacoes with pagination", async () => {
      const result = await caller.transacoes.list({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should create a new transacao", async () => {
      const result = await caller.transacoes.create({
        descricao: "Transação Teste",
        tipo: "receita",
        valor: 500,
        conta_id: "1",
        data_transacao: new Date().toISOString(),
      });

      expect(result).toBeDefined();
      expect(result.descricao).toBe("Transação Teste");
      expect(result.valor).toBe(500);
    });

    it("should mark transacao as paid", async () => {
      const result = await caller.transacoes.marcarComoPaga({
        id: "1",
        data_pagamento: new Date().toISOString(),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Dashboard Router", () => {
    it("should get dashboard data", async () => {
      const result = await caller.dashboard.get({});

      expect(result).toBeDefined();
      expect(result.tenant).toBeDefined();
      expect(result.indicadores).toBeDefined();
      expect(result.indicadores.saldoTotal).toBeGreaterThanOrEqual(0);
      expect(result.indicadores.receitasTotal).toBeGreaterThanOrEqual(0);
      expect(result.indicadores.despesasTotal).toBeGreaterThanOrEqual(0);
    });

    it("should get dashboard with date range", async () => {
      const dataInicio = new Date(2026, 0, 1).toISOString();
      const dataFim = new Date(2026, 11, 31).toISOString();

      const result = await caller.dashboard.get({
        data_inicio: dataInicio,
        data_fim: dataFim,
      });

      expect(result).toBeDefined();
      expect(result.graficoReceitas).toBeDefined();
      expect(result.graficoDespesas).toBeDefined();
    });
  });

  describe("Tenants Router", () => {
    it("should get current tenant", async () => {
      const result = await caller.tenants.getCurrent();

      expect(result).toBeDefined();
      expect(result.nome).toBeDefined();
      expect(result.ativo).toBe(true);
    });

    it("should create a new tenant", async () => {
      const result = await caller.tenants.create({
        nome: "Tenant Teste",
        email: "tenant@teste.com",
      });

      expect(result).toBeDefined();
      expect(result.nome).toBe("Tenant Teste");
    });
  });
});
