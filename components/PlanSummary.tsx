import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { useAccess } from '../services/AccessContext';

const PlanSummary: React.FC = () => {
  const { access } = useAccess();
  if (!access) return null;

  const isStarter = access.plan_code === 'starter';
  const label = access.plan_code === 'pro' ? 'Pro' : access.plan_code === 'legacy' ? 'Acesso completo' : 'Starter';
  const used = access.transactions_used ?? 0;
  const limit = access.monthly_transaction_limit;
  const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <section className="mb-6 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur" aria-label="Seu plano">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-deep text-brand-lime">
            {isStarter ? <Sparkles size={18} /> : <Crown size={18} />}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Seu plano</p>
            <p className="font-bold text-brand-deep">{label}{access.access_status === 'trial' ? ' · período de teste' : ''}</p>
          </div>
        </div>
        {limit !== null && (
          <div className="min-w-[190px] flex-1 sm:max-w-xs">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>Lançamentos no mês</span><span>{used}/{limit}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-lime transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlanSummary;
