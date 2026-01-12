import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from './supabaseClient';
import { useToast } from '../components/Toast';

type AuthContextValue = {
  supabaseConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizePhoneLoose(input: string): string {
  const raw = (input ?? '').toString().trim();
  const cleaned = raw.replace(/[^0-9+]/g, '');
  if (/^\d{8,15}$/.test(cleaned)) return `+${cleaned}`;
  return cleaned;
}

function samePhone(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return normalizePhoneLoose(a) === normalizePhoneLoose(b);
}

const EXPECTED_PHONE_KEY = 'joaoai_expected_phone_e164';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      if (!supabase) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        // PKCE callback: troca code por sessão e limpa a URL
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          // Não bloqueia: se falhar, cai em login normal
          if (error) addToast('Não consegui validar seu login. Tente novamente.', 'ERROR');

          params.delete('code');
          const next = params.toString();
          const newUrl = `${window.location.origin}${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`;
          window.history.replaceState({}, document.title, newUrl);
        }

        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);

        const { data: sub } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
          setSession(nextSession ?? null);

          if (event === 'SIGNED_IN' && nextSession?.user) {
            const expectedPhone = sessionStorage.getItem(EXPECTED_PHONE_KEY);
            if (expectedPhone) {
              const storedPhone = nextSession.user.phone || (nextSession.user.user_metadata as any)?.phone_e164;
              if (storedPhone && !samePhone(storedPhone, expectedPhone)) {
                await supabase.auth.signOut();
                addToast('Seu telefone não confere com este acesso. Verifique e tente de novo.', 'ERROR');
                navigate('/login', { replace: true });
              }
              sessionStorage.removeItem(EXPECTED_PHONE_KEY);
            }
          }
        });

        unsubscribe = () => sub.subscription.unsubscribe();
      } finally {
        setIsLoading(false);
      }
    }

    void init();
    return () => unsubscribe?.();
  }, [addToast, navigate, supabase]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      supabaseConfigured: Boolean(supabase),
      isLoading,
      session,
      user: session?.user ?? null,
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    };
  }, [isLoading, session, supabase]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function setExpectedPhoneForNextAuth(phoneE164: string) {
  sessionStorage.setItem(EXPECTED_PHONE_KEY, phoneE164);
}


