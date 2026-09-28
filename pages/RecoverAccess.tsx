import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthShell from './AuthShell';
import { getAuthRedirectTo, getSupabaseClient } from '../services/supabaseClient';
import { useToast } from '../components/Toast';

const RecoverAccess: React.FC = () => {
  const supabase = getSupabaseClient();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    const base = getAuthRedirectTo();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${base}/definir-senha?onboarding=recovery`,
    });
    setLoading(false);
    if (error) return addToast('Não consegui enviar o link agora. Tente novamente.', 'ERROR');
    setSent(true);
  };

  return (
    <AuthShell title="Recuperar acesso" subtitle="Informe o e-mail da conta. Se ele estiver cadastrado, você receberá um link seguro.">
      {sent ? (
        <div className="rounded-2xl border border-brand-lime/30 bg-brand-lime/10 p-5 text-sm text-brand-deep">
          <p className="font-bold">Confira seu e-mail.</p>
          <p className="mt-1">Enviamos as próximas instruções. O link é pessoal e temporário.</p>
          <Link to="/login" className="mt-4 inline-block font-bold underline">Voltar para entrar</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">E-mail</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
              <Mail size={18} className="text-slate-400" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" required className="w-full outline-none text-sm font-semibold" placeholder="seuemail@exemplo.com" />
            </div>
          </label>
          <button disabled={loading} className="w-full rounded-2xl bg-brand-deep py-4 font-bold text-white disabled:opacity-50">{loading ? 'Enviando…' : 'Enviar link seguro'}</button>
          <Link to="/login" className="block text-center text-sm font-bold text-brand-deep hover:underline">Voltar para entrar</Link>
        </form>
      )}
    </AuthShell>
  );
};

export default RecoverAccess;
