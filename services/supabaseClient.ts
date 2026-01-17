import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseEnv = {
  url?: string;
  key?: string;
};

type SupabaseEnvStatus = {
  isConfigured: boolean;
  missing: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY_OR_VITE_SUPABASE_ANON_KEY'>;
  issues: string[];
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

function getProjectRefFromSupabaseUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // Formato padrão: https://<project_ref>.supabase.co
    const host = u.hostname.toLowerCase();
    if (host.endsWith('.supabase.co')) {
      const maybeRef = host.split('.supabase.co')[0];
      return maybeRef || null;
    }
    return null;
  } catch {
    return null;
  }
}

function decodeJwtPayloadUnsafe(token: string): any | null {
  // Apenas para validação "best-effort" de mismatch. Não valida assinatura.
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadB64.padEnd(payloadB64.length + ((4 - (payloadB64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function validateSupabaseEnv({ url, key }: SupabaseEnv): SupabaseEnvStatus {
  const missing: SupabaseEnvStatus['missing'] = [];
  const issues: string[] = [];

  const trimmedUrl = (url ?? '').trim();
  const trimmedKey = (key ?? '').trim();

  if (!trimmedUrl) missing.push('VITE_SUPABASE_URL');
  if (!trimmedKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY_OR_VITE_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    return { isConfigured: false, missing, issues };
  }

  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(trimmedUrl);
    if (!/^https?:$/.test(parsedUrl.protocol)) issues.push('VITE_SUPABASE_URL deve começar com http(s).');
  } catch {
    issues.push('VITE_SUPABASE_URL não é uma URL válida.');
  }

  // Se for uma anon key (JWT), validamos se o `ref` bate com a URL (evita 401 em produção por mismatch).
  if (trimmedKey.split('.').length >= 2) {
    const payload = decodeJwtPayloadUnsafe(trimmedKey);
    const ref = payload?.ref as string | undefined;
    const urlRef = parsedUrl ? getProjectRefFromSupabaseUrl(parsedUrl.toString()) : null;
    if (ref && urlRef && ref !== urlRef) {
      issues.push(
        `Mismatch: a chave anon parece ser do projeto "${ref}", mas a URL aponta para "${urlRef}". Confira as envs na Vercel.`,
      );
    }
  }

  return { isConfigured: issues.length === 0, missing, issues };
}

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const { url, key } = readSupabaseEnv();
  return validateSupabaseEnv({ url, key });
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
  const status = validateSupabaseEnv({ url, key });
  if (!status.isConfigured) {
    cached = null;
    return cached;
  }

  cached = createClient(url!.trim(), key!.trim(), {
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

/**
 * URL de redirect para fluxos de Auth (ex.: confirmação de e-mail / PKCE).
 *
 * Importante:
 * - Este app usa `HashRouter`, então o hash não deve ser a fonte da querystring do callback.
 * - Mantemos o redirect no "base URL" (origin + pathname), para garantir que o `?code=...`
 *   venha na querystring (lido pelo `AuthContext`) e não dentro do hash.
 */
export function getAuthRedirectTo(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}


