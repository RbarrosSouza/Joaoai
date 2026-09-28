import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import { useAuth } from '../services/AuthContext';
import { getSupabaseClient } from '../services/supabaseClient';
import { useToast } from '../components/Toast';

const SetPassword: React.FC = () => {
  const supabase = getSupabaseClient();
  const { session, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [show, setShow] = useState(false);
  const [validating, setValidating] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function validateLink() {
      if (!supabase || isLoading) return;
      if (session) {
        if (!cancelled) { setReady(true); setValidating(false); }
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');
      const type = params.get('type');
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
        if (!cancelled) {
          setReady(!error);
          setValidating(false);
          if (error) addToast('Este link expirou ou já foi usado. Peça um novo acesso.', 'ERROR');
        }
        return;
      }
      if (!cancelled) setValidating(false);
    }
    void validateLink();
    return () => { cancelled = true; };
  }, [addToast, isLoading, session, supabase]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !ready) return;
    if (password.length < 8) return addToast('Use pelo menos 8 caracteres.', 'ERROR');
    if (password !== confirmation) return addToast('As senhas não conferem.', 'ERROR');
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) return addToast(`Não consegui salvar sua senha. ${error.message}`, 'ERROR');
    addToast('Senha criada. Seu painel está pronto!', 'SUCCESS');
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthShell title="Crie sua senha" subtitle="Você recebeu um acesso pessoal. Agora escolha sua senha para entrar no painel.">
      {validating ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-600">Validando seu acesso…</p>
      ) : !ready ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-bold">Este acesso não está mais válido.</p>
          <button onClick={() => navigate('/recuperar-acesso')} className="mt-3 font-bold underline">Enviar um novo link</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-brand-lime/10 p-4 text-sm text-brand-deep">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-lime" />
            <p><strong>Acesso confirmado.</strong> Sua senha é pessoal e não será enviada pelo WhatsApp.</p>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Nova senha</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
              <KeyRound size={18} className="text-slate-400" />
              <input value={password} onChange={e => setPassword(e.target.value)} type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo de 8 caracteres" className="w-full outline-none text-sm font-semibold" />
              <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'} className="text-slate-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Repita a senha</span>
            <input value={confirmation} onChange={e => setConfirmation(e.target.value)} type={show ? 'text' : 'password'} autoComplete="new-password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold outline-none" />
          </label>
          <button disabled={saving} className="w-full rounded-2xl bg-brand-deep py-4 font-bold text-white disabled:opacity-50">{saving ? 'Salvando…' : 'Criar senha e entrar'}</button>
        </form>
      )}
    </AuthShell>
  );
};

export default SetPassword;
