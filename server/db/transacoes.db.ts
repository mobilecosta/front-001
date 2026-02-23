import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { getDb } from "../db";
import { transacoes, type Transacao } from "../../drizzle/schema";
import type { InsertTransacao } from "../../drizzle/schema";

export async function listarTransacoes(
  tenantId: number,
  filtros?: {
    conta_id?: number;
    categoria_id?: number;
    tipo?: "receita" | "despesa" | "transferencia";
    data_inicio?: Date;
    data_fim?: Date;
    pago?: boolean;
  },
  page: number = 1,
  pageSize: number = 10
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const offset = (page - 1) * pageSize;
  const conditions: any[] = [eq(transacoes.tenant_id, tenantId)];

  if (filtros?.conta_id) {
    conditions.push(eq(transacoes.conta_id, filtros.conta_id));
  }
  if (filtros?.categoria_id) {
    conditions.push(eq(transacoes.categoria_id, filtros.categoria_id));
  }
  if (filtros?.tipo) {
    conditions.push(eq(transacoes.tipo, filtros.tipo));
  }
  if (filtros?.pago !== undefined) {
    conditions.push(eq(transacoes.pago, filtros.pago));
  }
  if (filtros?.data_inicio) {
    conditions.push(gte(transacoes.data_transacao, filtros.data_inicio));
  }
  if (filtros?.data_fim) {
    conditions.push(lte(transacoes.data_transacao, filtros.data_fim));
  }

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(transacoes)
      .where(and(...conditions))
      .orderBy(desc(transacoes.data_transacao))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transacoes)
      .where(and(...conditions)),
  ]);

  const count = countResult[0]?.count || 0;

  return {
    items: items as Transacao[],
    totalRecords: count,
    totalPages: Math.ceil(count / pageSize),
  };
}

export async function obterTransacaoById(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(transacoes)
    .where(and(eq(transacoes.id, id), eq(transacoes.tenant_id, tenantId)))
    .limit(1);

  return result[0] as Transacao | undefined;
}

export async function criarTransacao(tenantId: number, data: Omit<InsertTransacao, 'tenant_id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(transacoes)
    .values({
      ...data,
      tenant_id: tenantId,
    } as any)
    .returning();

  return result[0] as Transacao;
}

export async function atualizarTransacao(
  id: number,
  tenantId: number,
  data: Partial<Omit<InsertTransacao, 'tenant_id'>>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(transacoes)
    .set(data as any)
    .where(and(eq(transacoes.id, id), eq(transacoes.tenant_id, tenantId)))
    .returning();

  return result[0] as Transacao | undefined;
}

export async function deletarTransacao(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(transacoes)
    .where(and(eq(transacoes.id, id), eq(transacoes.tenant_id, tenantId)));

  return true;
}

export async function marcarComoPaga(
  id: number,
  tenantId: number,
  dataPagamento: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(transacoes)
    .set({
      pago: true,
      data_pagamento: dataPagamento,
    } as any)
    .where(and(eq(transacoes.id, id), eq(transacoes.tenant_id, tenantId)))
    .returning();

  return result[0] as Transacao | undefined;
}

export async function obterSaldoTotalPorTenant(tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select({
      receitas: sql<string>`SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END)`,
      despesas: sql<string>`SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END)`,
    })
    .from(transacoes)
    .where(eq(transacoes.tenant_id, tenantId));

  const row = result[0];
  const receitas = parseFloat((row?.receitas as string) || "0");
  const despesas = parseFloat((row?.despesas as string) || "0");
  
  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
  };
}
