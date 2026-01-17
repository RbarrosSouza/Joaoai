import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Phone, User } from 'lucide-react';
import AuthShell from './AuthShell';
import { useToast } from '../components/Toast';
import { getSupabaseClient, getSupabaseEnvStatus } from '../services/supabaseClient';

function normalizePhoneE164Like(input: string): string | null {
  const cleaned = (input ?? '').toString().trim().replace(/[^0-9+]/g, '');
  const normalized = /^\d{8,15}$/.test(cleaned) ? `+${cleaned}` : cleaned;
  if (!/^\+[1-9][0-9]{7,14}$/.test(normalized)) return null;
  return normalized;
}

const Signup: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  const supabaseStatus = getSupabaseEnvStatus();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhoneE164Like(phone), [phone]);

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
    if (!name.trim()) {
      addToast('Me diga seu nome para continuar.', 'ERROR');
      return;
    }
    if (!email.trim()) {
      addToast('Informe seu e-mail para eu te enviar o acesso.', 'ERROR');
      return;
    }
    if (password.length < 8) {
      addToast('Sua senha precisa ter pelo menos 8 caracteres.', 'ERROR');
      return;
    }
    if (password !== confirmPassword) {
      addToast('As senhas não conferem.', 'ERROR');
      return;
    }

    setIsSubmitting(true);
    try {
      // Criação de conta: email + senha (telefone fica no metadata para o trigger de provisionamento criar org)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone_e164: normalizedPhone,
          },
        },
      });

      if (error) {
        addToast('Não consegui criar sua conta. Verifique os dados e tente de novo.', 'ERROR');
        return;
      }

      // Se o projeto exigir confirmação de e-mail, pode não vir sessão aqui.
      if (data.session) {
        addToast('Conta criada! Bem-vindo(a).', 'SUCCESS');
        navigate('/', { replace: true });
      } else {
        addToast('Conta criada! Agora confirme seu e-mail para entrar.', 'SUCCESS');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Crie sua conta com e-mail e senha. O telefone é o que conecta seu WhatsApp à sua organização."
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-slate-600">Seu nome</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand-lime/60 focus-within:ring-4 focus-within:ring-brand-lime/10">
            <User size={18} className="text-slate-400" />
            <input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              type="text"
              autoComplete="name"
              placeholder="Como você quer ser chamado(a)?"
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
            Esse telefone conecta seu WhatsApp à sua organização no banco.
          </p>
        </label>

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
          <span className="text-xs font-semibold text-slate-600">Senha</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand-lime/60 focus-within:ring-4 focus-within:ring-brand-lime/10">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <input
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              className="w-full outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-slate-600">Confirmar senha</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand-lime/60 focus-within:ring-4 focus-within:ring-brand-lime/10">
            <Eye size={18} className="text-slate-300" />
            <input
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repita a senha"
              className="w-full outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-brand-deep text-white font-bold py-4 shadow-float border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-premium transition-all active:scale-[0.99]"
        >
          {isSubmitting ? 'Criando…' : 'Criar conta'}
          <ArrowRight size={18} />
        </button>

        {!supabase && (
          <div className="mt-2 p-4 rounded-2xl border border-red-200 bg-white text-red-600 text-sm font-semibold leading-relaxed">
            Supabase não configurado neste ambiente.
            <div className="mt-2 text-[12px] text-red-600/90 font-medium">
              Faltando: {supabaseStatus.missing.join(', ')}.
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Se você está rodando local (ex.: <span className="font-semibold">192.168…</span>), as envs da Vercel não aplicam — crie um{' '}
              <span className="font-semibold">.env.local</span> com <span className="font-semibold">VITE_SUPABASE_URL</span> e{' '}
              <span className="font-semibold">VITE_SUPABASE_PUBLISHABLE_KEY</span>.
            </div>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-slate-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-bold text-brand-deep hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
};

export default Signup;


