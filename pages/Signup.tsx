import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, User } from 'lucide-react';
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

type Step = 1 | 2;

const Signup: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhoneE164Like(phone), [phone]);

  const next = () => {
    if (!name.trim()) {
      addToast('Me diga seu nome para continuar.', 'ERROR');
      return;
    }
    if (!normalizedPhone) {
      addToast('Informe seu telefone no formato +55… (E.164).', 'ERROR');
      return;
    }
    setStep(2);
  };

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
    if (!email.trim()) {
      addToast('Informe seu e-mail para eu te enviar o acesso.', 'ERROR');
      return;
    }

    setIsSubmitting(true);
    try {
      setExpectedPhoneForNextAuth(normalizedPhone);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
          data: {
            name: name.trim(),
            phone_e164: normalizedPhone,
          },
        },
      });

      if (error) {
        addToast('Não consegui criar seu acesso. Tente novamente.', 'ERROR');
        return;
      }

      addToast('Pronto! Te enviei um link de acesso por e-mail.', 'SUCCESS');
      addToast('Abra o link para finalizar. Depois, é só usar o WhatsApp pra lançar.', 'INFO');
      navigate('/', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Primeiro confirmo seus dados principais. Depois te mando um link seguro por e-mail."
    >
      <form onSubmit={submit} className="space-y-4">
        {step === 1 && (
          <>
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
                Esse telefone é o que conecta seu WhatsApp à sua organização no banco.
              </p>
            </label>

            <button
              type="button"
              onClick={next}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-brand-deep text-white font-bold py-4 shadow-float border border-white/10 hover:shadow-premium transition-all active:scale-[0.99]"
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Confere antes de enviar</p>
              <p className="mt-2 text-sm font-bold text-slate-800">{name.trim() || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">{normalizedPhone || '—'}</p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 text-xs font-bold text-brand-deep hover:underline"
              >
                Editar
              </button>
            </div>

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
              <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                Eu vou te mandar um link seguro aqui (sem senha).
              </p>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-brand-deep text-white font-bold py-4 shadow-float border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-premium transition-all active:scale-[0.99]"
            >
              {isSubmitting ? 'Enviando…' : 'Enviar link de acesso'}
              <ArrowRight size={18} />
            </button>

            {!supabase && (
              <div className="mt-2 p-4 rounded-2xl border border-red-200 bg-white text-red-600 text-sm font-semibold">
                Supabase não configurado: defina <span className="font-bold">VITE_SUPABASE_URL</span> e{' '}
                <span className="font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</span>.
              </div>
            )}
          </>
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


