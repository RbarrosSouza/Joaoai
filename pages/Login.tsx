import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Send } from 'lucide-react';
import AuthShell from './AuthShell';
import { useToast } from '../components/Toast';
import { getSupabaseClient } from '../services/supabaseClient';
import { setExpectedPhoneForNextAuth } from '../services/AuthContext';

function normalizePhoneE164Like(input: string): string | null {
  const cleaned = (input ?? '').toString().trim().replace(/[^0-9+]/g, '');
  const normalized = /^\d{8,15}$/.test(cleaned) ? `+${cleaned}` : cleaned;
  if (!/^\+[1-9][0-9]{7,14}$/.test(normalized)) return null;
  return normalized;
}

const Login: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhoneE164Like(phone), [phone]);
  const canSubmit = Boolean(email.trim()) && Boolean(normalizedPhone) && !isSubmitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast('Supabase não está configurado neste ambiente.', 'ERROR');
      return;
    }
    if (!normalizedPhone) {
      addToast('Informe seu telefone no formato +55… (E.164).', 'ERROR');
      return;
    }

    setIsSubmitting(true);
    try {
      setExpectedPhoneForNextAuth(normalizedPhone);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        addToast('Não consegui enviar o login. Confere seu e-mail?', 'ERROR');
        return;
      }

      addToast('Enviei um link de acesso no seu e-mail.', 'SUCCESS');
      addToast('Abra o link no mesmo dispositivo/navegador para entrar.', 'INFO');
      navigate('/', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Entrar"
      subtitle="Use o mesmo e-mail e telefone que você usa para registrar via WhatsApp. Vou te mandar um link seguro no e-mail."
      showBack={false}
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-slate-600">E-mail</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand-lime/60 focus-within:ring-4 focus-within:ring-brand-lime/10">
            <Mail size={18} className="text-slate-400" />
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              className="w-full outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-slate-600">Telefone (WhatsApp)</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand-lime/60 focus-within:ring-4 focus-within:ring-brand-lime/10">
            <Phone size={18} className="text-slate-400" />
            <input
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="+5511999999999"
              className="w-full outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
            Dica: use sempre com código do país, ex: <span className="font-semibold text-slate-700">+55</span>.
          </p>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-brand-deep text-white font-bold py-4 shadow-float border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-premium transition-all active:scale-[0.99]"
        >
          <Send size={18} />
          {isSubmitting ? 'Enviando…' : 'Enviar link de acesso'}
        </button>

        <div className="pt-2">
          <p className="text-sm text-slate-500">
            Não tem conta ainda?{' '}
            <Link to="/signup" className="font-bold text-brand-deep hover:underline">
              Criar agora
            </Link>
          </p>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Se o link abrir e você não entrar, normalmente é porque o telefone não confere com o cadastro.
          </p>
        </div>

        {!supabase && (
          <div className="mt-2 p-4 rounded-2xl border border-red-200 bg-white text-red-600 text-sm font-semibold">
            Supabase não configurado: defina <span className="font-bold">VITE_SUPABASE_URL</span> e{' '}
            <span className="font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</span>.
          </div>
        )}
      </form>
    </AuthShell>
  );
};

export default Login;


