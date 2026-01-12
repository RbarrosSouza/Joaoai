import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthShell: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBack?: boolean;
}> = ({ title, subtitle, children, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-semibold">Voltar</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
            aria-label="Ir para o início"
          >
            <div className="w-10 h-10 bg-white rounded-xl border border-white/60 shadow-premium flex items-center justify-center">
              <img src="/logo.svg" alt="João.ai" className="w-6 h-6 object-contain" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-brand-deep leading-none">
                joão<span className="text-brand-lime">.ai</span>
              </p>
              <p className="text-[9px] text-slate-400 tracking-[0.22em] font-medium mt-1">FINANCE</p>
            </div>
          </button>
        </div>

        <div className="card-base p-6 sm:p-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="text-[11px] text-slate-400 mt-6 text-center leading-relaxed">
          Ao continuar, você concorda em usar o João.ai como seu painel e manter os lançamentos no WhatsApp como fluxo principal.
        </p>
      </div>
    </div>
  );
};

export default AuthShell;


