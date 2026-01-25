import type { SupabaseClient } from '@supabase/supabase-js';
import type { Transaction } from '../types';

type AppTransactionRow = {
  id: string;
  org_id: string;
  user_id: string;
  payload: unknown;
  created_at: string;
  updated_at: string;
};

export async function fetchActiveOrgId(params: { supabase: SupabaseClient; userId: string }): Promise<string | null> {
  const { data, error } = await params.supabase
    .from('profiles')
    .select('active_org_id')
    .eq('id', params.userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.active_org_id as string | null) ?? null;
}

export async function fetchTransactions(params: {
  supabase: SupabaseClient;
  orgId: string;
}): Promise<Transaction[]> {
  const { data, error } = await params.supabase
    .from('app_transactions')
    .select('id, payload, created_at, updated_at')
    .eq('org_id', params.orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as Array<Pick<AppTransactionRow, 'id' | 'payload'>>;

  return rows
    .map((r) => r.payload as Transaction)
    .filter((t) => Boolean(t && typeof t === 'object' && typeof (t as any).id === 'string'));
}

export async function upsertTransactions(params: {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  transactions: Transaction[];
}): Promise<void> {
  if (params.transactions.length === 0) return;

  const now = new Date().toISOString();
  const payload = params.transactions.map((t) => ({
    id: t.id,
    org_id: params.orgId,
    user_id: params.userId,
    payload: t,
    updated_at: now,
  }));

  const { error } = await params.supabase.from('app_transactions').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteTransaction(params: {
  supabase: SupabaseClient;
  orgId: string;
  id: string;
}): Promise<void> {
  const { error } = await params.supabase
    .from('app_transactions')
    .delete()
    .eq('org_id', params.orgId)
    .eq('id', params.id);
  if (error) throw error;
}


