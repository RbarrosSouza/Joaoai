import type { SupabaseClient } from '@supabase/supabase-js';
import { Transaction, TransactionType } from '../types';

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
    competence_date: t.date, // Defaulting competence to date
    type: t.type,
    status: t.isPending ? 'PENDING' : 'PAID',
    category_id: t.categoryId || null,
    account_id: t.accountId || null,
    credit_card_id: t.cardId || null,
    frequency: t.frequency,
    installment_id: t.installmentId || null,
    installments: t.installments || null,
    updated_at: new Date().toISOString()
  }));

  const { error } = await params.supabase.from('transactions').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
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
