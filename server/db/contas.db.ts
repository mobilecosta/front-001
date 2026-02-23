import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { contas, type Conta } from "../../drizzle/schema";
import type { InsertConta } from "../../drizzle/schema";

export async function listarContas(
  tenantId: number,
  page: number = 1,
  pageSize: number = 10
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const offset = (page - 1) * pageSize;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(contas)
      .where(eq(contas.tenant_id, tenantId))
      .orderBy(desc(contas.criado_em))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(contas)
      .where(eq(contas.tenant_id, tenantId)),
  ]);

  const count = countResult[0]?.count || 0;

  return {
    items: items as Conta[],
    totalRecords: count,
    totalPages: Math.ceil(count / pageSize),
  };
}

export async function obterContaById(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(contas)
    .where(and(eq(contas.id, id), eq(contas.tenant_id, tenantId)));

  return result[0] as Conta | undefined;
}

export async function criarConta(tenantId: number, data: Omit<InsertConta, 'tenant_id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(contas)
    .values({
      ...data,
      tenant_id: tenantId,
    } as any)
    .returning();

  return result[0] as Conta;
}

export async function atualizarConta(
  id: number,
  tenantId: number,
  data: Partial<Omit<InsertConta, 'tenant_id'>>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(contas)
    .set(data as any)
    .where(and(eq(contas.id, id), eq(contas.tenant_id, tenantId)))
    .returning();

  return result[0] as Conta | undefined;
}

export async function deletarConta(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(contas)
    .where(and(eq(contas.id, id), eq(contas.tenant_id, tenantId)));

  return true;
}

export async function atualizarSaldoConta(
  id: number,
  tenantId: number,
  novoSaldo: string | number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const saldoStr = typeof novoSaldo === 'string' ? novoSaldo : novoSaldo.toString();

  const result = await db
    .update(contas)
    .set({ saldo: saldoStr })
    .where(and(eq(contas.id, id), eq(contas.tenant_id, tenantId)))
    .returning();

  return result[0] as Conta | undefined;
}
