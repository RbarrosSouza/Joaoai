import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useAccess } from '../services/AccessContext';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, session } = useAuth();
  const { isLoading: isAccessLoading, access, error, refreshAccess } = useAccess();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-background">
        <div className="glass-panel rounded-2xl px-6 py-5 shadow-premium border border-white/60">
          <p className="text-sm font-semibold text-slate-700">Carregando…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isAccessLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-background">
        <div className="glass-panel rounded-2xl px-6 py-5 shadow-premium border border-white/60">
          <p className="text-sm font-semibold text-slate-700">Preparando seu espaço…</p>
        </div>
      </div>
    );
  }

  if (!access || error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-background p-5">
        <div className="glass-panel max-w-md rounded-3xl px-7 py-7 shadow-premium border border-white/60 text-center">
          <h1 className="text-xl font-bold text-brand-deep">Seu acesso ainda não ficou pronto</h1>
          <p className="mt-2 text-sm text-slate-500">Se você acabou de criar a conta, aguarde alguns segundos e tente novamente.</p>
          <button onClick={() => void refreshAccess()} className="mt-5 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-white">Tentar novamente</button>
        </div>
      </div>
    );
  }

  if (!['active', 'trial'].includes(access.access_status)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-background p-5">
        <div className="glass-panel max-w-md rounded-3xl px-7 py-7 shadow-premium border border-white/60 text-center">
          <h1 className="text-xl font-bold text-brand-deep">Acesso temporariamente indisponível</h1>
          <p className="mt-2 text-sm text-slate-500">Fale com o João no WhatsApp para regularizar sua conta. Seus dados continuam guardados.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
