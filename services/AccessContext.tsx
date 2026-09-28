import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSupabaseClient } from './supabaseClient';
import { fetchActiveOrgId } from './financeTransactionsSupabase';

export type JoaoAccess = {
  org_id: string;
  plan_code: 'starter' | 'pro' | 'legacy';
  access_status: 'active' | 'trial' | 'suspended' | 'inactive';
  trial_ends_at: string | null;
  paid_until: string | null;
  features: Record<string, boolean>;
  monthly_transaction_limit: number | null;
  transactions_used: number;
  transactions_remaining: number | null;
  active_card_limit: number | null;
  active_cards_used: number;
};

type AccessContextValue = {
  access: JoaoAccess | null;
  isLoading: boolean;
  error: string | null;
  refreshAccess: () => Promise<void>;
};

const AccessContext = createContext<AccessContextValue | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [access, setAccess] = useState<JoaoAccess | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  const refreshAccess = useCallback(async () => {
    if (!supabase || !user) {
      setAccess(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const orgId = await fetchActiveOrgId({ supabase, userId: user.id });
      if (!orgId) throw new Error('Sua organização ainda não foi preparada.');
      const { data, error: rpcError } = await supabase.rpc('joao_get_access_v6', { p_org_id: orgId });
      if (rpcError) throw rpcError;
      setAccess(data as JoaoAccess);
    } catch (err) {
      setAccess(null);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar seu acesso.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => { void refreshAccess(); }, [refreshAccess]);

  const value = useMemo(() => ({ access, isLoading, error, refreshAccess }), [access, isLoading, error, refreshAccess]);
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
};

export function useAccess(): AccessContextValue {
  const value = useContext(AccessContext);
  if (!value) throw new Error('useAccess must be used within AccessProvider');
  return value;
}
