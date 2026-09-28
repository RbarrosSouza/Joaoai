import type { SupabaseClient } from '@supabase/supabase-js';
import { Transaction, TransactionType } from '../types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const toUuidOrNull = (v: string | undefined | null): string | null =>
  v && UUID_RE.test(v) ? v : null;

export async function fetchActiveOrgId(params: { supabase: SupabaseClient; userId: string }): Promise<string | null> {
  const { data, error } = await params.supabase
    .from('profiles')
    .select('active_org_id')
    .eq('id', params.userId)
    .maybeSingle();

  if (error) throw error;
  const orgId = (data?.active_org_id as string | null) ?? null;
  if (orgId) return orgId;

  const membership = await params.supabase
    .from('organization_members')
    .select('org_id')
    .eq('user_id', params.userId)
    .maybeSingle();

  if (membership.error) throw membership.error;
  return (membership.data?.org_id as string | null) ?? null;
}

export async function fetchTransactions(params: {
  supabase: SupabaseClient;
  orgId: string;
}): Promise<Transaction[]> {
  const { data, error } = await params.supabase
    .from('transactions')
    .select('*')
    .eq('org_id', params.orgId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    displayId: row.display_id == null ? undefined : Number(row.display_id),
    updatedAt: row.updated_at || undefined,
    description: row.description,
    amount: Number(row.amount),
    type: row.type as TransactionType,
    date: row.date,
    paymentDate: row.payment_date,
    categoryId: row.category_id,
    subCategoryId: row.subcategory_id, // Note: DB might not have this column yet, keeping undefined if missing
    accountId: row.account_id,
    cardId: row.credit_card_id,
    frequency: row.frequency,
    installmentId: row.installment_id,
    installments: row.installments,
    isPending: row.status === 'PENDING'
  }));
}

export async function upsertTransactions(params: {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  transactions: Transaction[];
}): Promise<void> {
  if (params.transactions.length === 0) return;

  const payload = params.transactions.map((t) => ({
    id: t.id,
    org_id: params.orgId,
    description: t.description,
    amount: t.amount,
    date: t.date,
    payment_date: t.paymentDate || null,
    type: t.type,
    status: t.isPending ? 'PENDING' : 'PAID',
    category_id: toUuidOrNull(t.categoryId),
    subcategory_id: toUuidOrNull(t.subCategoryId),
    account_id: toUuidOrNull(t.accountId),
    credit_card_id: toUuidOrNull(t.cardId),
    frequency: t.frequency,
    installment_id: t.installmentId || null,
    installments: t.installments || null,
    updated_at: new Date().toISOString()
  }));

  const { error } = await params.supabase.from('transactions').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function changeTransactionType(params: {
  supabase: SupabaseClient;
  orgId: string;
  displayId: number;
  type: TransactionType;
  categoryId: string;
  subCategoryId?: string;
  accountId?: string;
  cardId?: string;
  expectedUpdatedAt?: string;
}): Promise<{ ok: boolean; display_id: number; before: Record<string, unknown>; after: Record<string, unknown> }> {
  const { data, error } = await params.supabase.rpc('joao_change_transaction_type', {
    p_org_id: params.orgId,
    p_display_id: params.displayId,
    p_type: params.type,
    p_category_id: params.categoryId,
    p_subcategory_id: params.subCategoryId || null,
    p_account_id: params.accountId || null,
    p_credit_card_id: params.type === TransactionType.EXPENSE ? (params.cardId || null) : null,
    p_expected_updated_at: params.expectedUpdatedAt || null,
  });
  if (error) throw error;
  if (!data?.ok) throw new Error('A alteração de tipo não foi confirmada.');
  return data;
}

type CreateTransactionsResult = {
  ok: boolean;
  inserted_count: number;
  failed_count: number;
  inserted: Array<{ item_ref: string; id: string; ok: boolean; idempotent?: boolean }>;
  failed: Array<{ item_ref: string; ok: false; error: string }>;
};

export async function createTransactions(params: {
  supabase: SupabaseClient;
  orgId: string;
  transactions: Transaction[];
  eventKey?: string;
}): Promise<CreateTransactionsResult> {
  if (params.transactions.length === 0) {
    return { ok: true, inserted_count: 0, failed_count: 0, inserted: [], failed: [] };
  }

  const items = params.transactions.map((t) => ({
    id: t.id,
    item_ref: t.id,
    description: t.description,
    amount: t.amount,
    date: t.date,
    payment_date: t.paymentDate || null,
    type: t.type,
    status: t.isPending ? 'PENDING' : 'PAID',
    category_id: toUuidOrNull(t.categoryId),
    subcategory_id: toUuidOrNull(t.subCategoryId),
    account_id: toUuidOrNull(t.accountId),
    credit_card_id: toUuidOrNull(t.cardId),
    frequency: t.frequency,
    installment_id: t.installmentId || null,
    installments: t.installments || null,
  }));

  // Derive the default from the already-created item IDs so an uncertain
  // request can be retried with the same idempotency identity.
  const eventKey = params.eventKey ?? `web:${params.transactions[0].id}`;
  const { data, error } = await params.supabase.rpc('joao_record_financial_items_v6', {
    p_org_id: params.orgId,
    p_items: items,
    p_source_channel: 'web',
    p_source_event_key: eventKey,
    p_atomic: true,
  });
  if (error) throw error;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('O banco não confirmou o salvamento dos lançamentos.');
  }

  const result = data as Partial<CreateTransactionsResult>;
  if (typeof result.ok !== 'boolean' || !Array.isArray(result.inserted) || !Array.isArray(result.failed)) {
    throw new Error('O banco retornou uma confirmação inválida para os lançamentos.');
  }
  return result as CreateTransactionsResult;
}

export async function deleteTransaction(params: {
  supabase: SupabaseClient;
  orgId: string;
  id: string;
}): Promise<void> {
  const { error } = await params.supabase
    .from('transactions')
    .delete()
    .eq('org_id', params.orgId)
    .eq('id', params.id);
  if (error) throw error;
}
