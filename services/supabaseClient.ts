import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseEnv = {
  url?: string;
  key?: string;
};

function readSupabaseEnv(): SupabaseEnv {
  // Vite expõe apenas envs com prefixo VITE_
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  return {
    url,
    key: publishableKey || anonKey,
  };
}

export function getSupabaseEnvStatus(): {
  isConfigured: boolean;
  missing: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY_OR_VITE_SUPABASE_ANON_KEY'>;
} {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const missing: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY_OR_VITE_SUPABASE_ANON_KEY'> = [];
  if (!url) missing.push('VITE_SUPABASE_URL');
  if (!publishableKey && !anonKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY_OR_VITE_SUPABASE_ANON_KEY');

  return { isConfigured: missing.length === 0, missing };
}

let cached: SupabaseClient | null | undefined;

/**
 * Retorna um client do Supabase quando configurado por env.
 *
 * - Não quebra o app caso as envs ainda não estejam setadas (retorna `null`).
 * - Preferimos `VITE_SUPABASE_PUBLISHABLE_KEY`; fallback para `VITE_SUPABASE_ANON_KEY`.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const { url, key } = readSupabaseEnv();
  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Importante para SPAs com HashRouter: evita depender de hash para callback.
      flowType: 'pkce',
    },
  });

  return cached;
}


