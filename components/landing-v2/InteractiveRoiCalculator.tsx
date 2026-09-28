import React, { useState } from 'react';
import { Calculator, ArrowRight, Clock, DollarSign, TrendingUp } from 'lucide-react';

export const InteractiveRoiCalculator: React.FC = () => {
  const [weeklyHours, setWeeklyHours] = useState<number>(3);
  const [untrackedExpenses, setUntrackedExpenses] = useState<number>(300);

  // Cálculos de impacto anual
  const hoursSavedYear = weeklyHours * 50; // 50 semanas no ano
  const moneySavedYear = untrackedExpenses * 12;
  const joaoCostAnnual = 149.9;
  const netBenefit = moneySavedYear - joaoCostAnnual;
  const roiMultiplier = Math.max(1, Math.round(moneySavedYear / joaoCostAnnual));

  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Fiz%20o%20c%C3%A1lculo%20de%20economia%20no%20site%20e%20quero%20come%C3%A7ar%20a%20economizar%20tempo%20e%20dinheiro';

  return (
    <section id="economia" className="py-20 md:py-28 bg-[#051A10] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Retorno (ROI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Quanto custa <span className="font-semibold text-rose-400">não controlar</span> suas finanças?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Ajuste as barras abaixo e veja o impacto real do João.ai na sua rotina e no seu bolso:
          </p>
        </div>

        {/* Container da Calculadora */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-gradient-to-br from-[#0F3C28]/60 to-[#0A261A]/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">

          {/* Controles (Sliders) */}
          <div className="lg:col-span-6 space-y-8">

            {/* Slider 1: Horas por semana */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="hours-slider" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-lime" />
                  <span>Horas por semana gastas com finanças</span>
                </label>
                <span className="text-lg font-bold text-brand-lime font-mono">
                  {weeklyHours} {weeklyHours === 1 ? 'hora' : 'horas'}
                </span>
              </div>
              <input
                id="hours-slider"
                type="range"
                min="1"
                max="10"
                step="1"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-brand-lime"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1h / sem</span>
                <span>5h / sem</span>
                <span>10h / sem</span>
              </div>
            </div>

            {/* Slider 2: Dinheiro que escapa */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="expenses-slider" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-lime" />
                  <span>Gastos invisíveis ou assinaturas que escapam/mês</span>
                </label>
                <span className="text-lg font-bold text-brand-lime font-mono">
                  R$ {untrackedExpenses}
                </span>
              </div>
              <input
                id="expenses-slider"
                type="range"
                min="100"
                max="1500"
                step="50"
                value={untrackedExpenses}
                onChange={(e) => setUntrackedExpenses(Number(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-brand-lime"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>R$ 100</span>
                <span>R$ 750</span>
                <span>R$ 1.500</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              * Baseado em pesquisas do Sebrae e Febraban sobre desperdícios com falta de conciliação financeira e taxas esquecidas.
            </p>

          </div>

          {/* Resultado Visual de Alto Impacto */}
          <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Seu Retorno Anual Estimado:
              </span>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 mb-1">Tempo recuperado</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    ~{hoursSavedYear}h
                  </p>
                  <p className="text-[11px] text-brand-lime mt-1 font-medium">
                    equivalente a {Math.round(hoursSavedYear / 8)} dias úteis de folga!
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 mb-1">Dinheiro resgatado</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-lime font-mono">
                    R$ {moneySavedYear.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1 font-medium">
                    em vazamentos evitados no ano
                  </p>
                </div>
              </div>

              <div className="bg-brand-lime/10 border border-brand-lime/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-lime font-bold uppercase tracking-wider">
                    Retorno sobre Investimento
                  </p>
                  <p className="text-xs text-slate-300">
                    O João.ai se paga <strong>{roiMultiplier}x</strong> no ano
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-lime font-mono">
                    {roiMultiplier}x ROI
                  </span>
                </div>
              </div>
            </div>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg font-bold text-sm shadow-[0_0_25px_rgba(140,184,42,0.4)] transition-all duration-200"
            >
              <span>Começar a Economizar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractiveRoiCalculator;
