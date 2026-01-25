import type { SupabaseClient } from '@supabase/supabase-js';
import type { Account, CreditCard } from '../types';

type AccountRow = {
  id: string;
  org_id: string;
  name: string;
  bank_name: string | null;
  type: string;
  balance: string | number;
  icon: string | null;
  color_from: string | null;
  color_to: string | null;
  is_active: boolean;
};

type CardRow = {
  id: string;
  org_id: string;
  name: string;
  brand: string | null;
  limit: string | number;
  closing_day: number;
  due_day: number;
  current_bill: string | number;
  color_from: string | null;
  color_to: string | null;
  is_active: boolean;
};

function toNumber(v: string | number | null | undefined): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v);
  return 0;
}

export async function fetchAccounts(params: { supabase: SupabaseClient; orgId: string }): Promise<Account[]> {
  const { data, error } = await params.supabase
    .from('accounts')
    .select('id, org_id, name, bank_name, type, balance, icon, color_from, color_to, is_active')
    .eq('org_id', params.orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as AccountRow[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    bankName: r.bank_name ?? undefined,
    type: r.type as Account['type'],
    balance: toNumber(r.balance),
    icon: r.icon ?? 'landmark',
    colorFrom: r.color_from ?? 'from-slate-500',
    colorTo: r.color_to ?? 'to-slate-700',
  }));
}

export async function upsertAccount(params: { supabase: SupabaseClient; orgId: string; account: Account }): Promise<void> {
  const payload = {
    id: params.account.id,
    org_id: params.orgId,
    name: params.account.name,
    bank_name: params.account.bankName ?? null,
    type: params.account.type,
    initial_balance: params.account.balance,
    balance: params.account.balance,
    icon: params.account.icon,
    color_from: params.account.colorFrom,
    color_to: params.account.colorTo,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await params.supabase.from('accounts').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteAccount(params: { supabase: SupabaseClient; orgId: string; id: string }): Promise<void> {
  const { error } = await params.supabase.from('accounts').delete().eq('org_id', params.orgId).eq('id', params.id);
  if (error) throw error;
}

export async function fetchCards(params: { supabase: SupabaseClient; orgId: string }): Promise<CreditCard[]> {
  const { data, error } = await params.supabase
    .from('credit_cards')
    .select('id, org_id, name, brand, limit, closing_day, due_day, current_bill, color_from, color_to, is_active')
    .eq('org_id', params.orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as CardRow[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    brand: r.brand ?? 'Card',
    limit: toNumber(r.limit),
    closingDay: r.closing_day,
    dueDay: r.due_day,
    currentBill: toNumber(r.current_bill),
    colorFrom: r.color_from ?? 'from-slate-700',
    colorTo: r.color_to ?? 'to-slate-900',
  }));
}

export async function upsertCard(params: { supabase: SupabaseClient; orgId: string; card: CreditCard }): Promise<void> {
  const payload = {
    id: params.card.id,
    org_id: params.orgId,
    name: params.card.name,
    brand: params.card.brand ?? null,
    limit: params.card.limit,
    closing_day: params.card.closingDay,
    due_day: params.card.dueDay,
    current_bill: params.card.currentBill,
    color_from: params.card.colorFrom,
    color_to: params.card.colorTo,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await params.supabase.from('credit_cards').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteCard(params: { supabase: SupabaseClient; orgId: string; id: string }): Promise<void> {
  const { error } = await params.supabase.from('credit_cards').delete().eq('org_id', params.orgId).eq('id', params.id);
  if (error) throw error;
}


