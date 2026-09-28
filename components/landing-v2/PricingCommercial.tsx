import React, { useState } from 'react';
import { Check, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const PricingCommercial: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const WA_STARTER =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20come%C3%A7ar%20no%20plano%20Starter%20gratuito';

  const WA_PRO = isAnnual
    ? 'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20testar%20o%20plano%20Pro%20Anual%20com%2058%25%20de%20desconto%20(7%20dias%20gr%C3%A1tis)'
    : 'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20testar%20o%20plano%20Pro%20Mensal%20(7%20dias%20gr%C3%A1tis)';

  return (
    <section id="planos" className="py-20 md:py-28 bg-[#03120B] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-lime bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20">
            Investimento
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mt-4 mb-4">
            Preço justo e transparente.{' '}
            <span className="font-semibold text-brand-lime">Sem pegadinhas.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Menos de <strong className="text-white font-medium">R$ 0,41 por dia</strong> para nunca mais perder o sono com finanças.
          </p>

          {/* Toggle Anual / Mensal */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-full mt-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !isAnnual
                  ? 'bg-white text-brand-darkBg shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAnnual
                  ? 'bg-brand-lime text-brand-darkBg shadow-[0_0_15px_rgba(140,184,42,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="bg-brand-darkBg text-brand-lime text-[10px] px-2 py-0.5 rounded-full font-bold">
                58% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Cards de Preço */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

          {/* Card 1: Starter (Grátis) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <span className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full font-medium">
                  Para começar
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-6">
                Ideal para quem quer experimentar a facilidade do João sem pagar nada.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-slate-400">R$</span>
                  <span className="text-5xl font-extrabold text-white font-mono">0</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Gratuito para sempre</p>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Até 50 lançamentos por mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Cartão de crédito configurado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Registro por texto e áudio</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acesso ao Painel Web básico</span>
                </li>
              </ul>
            </div>

            <a
              href={WA_STARTER}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-center text-sm border border-white/15 transition-all"
            >
              Criar Conta Gratuita
            </a>
          </div>

          {/* Card 2: Pro (Mais Popular com Glow) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0F3C28] to-[#0A261A] border-2 border-brand-lime p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(140,184,42,0.25)] relative overflow-hidden transform md:-translate-y-2">

            <div className="absolute top-0 right-0 bg-brand-lime text-brand-darkBg text-[11px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-md">
              Mais Escolhido
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>Pro Ilimitado</span>
                  <Sparkles className="w-4 h-4 text-brand-lime" />
                </h3>
              </div>
              <p className="text-slate-300 text-xs mb-6">
                Controle financeiro absoluto com inteligência artificial completa e zero limites.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-brand-lime">R$</span>
                  <span className="text-5xl font-extrabold text-white font-mono">
                    {isAnnual ? '12,49' : '29,90'}
                  </span>
                  <span className="text-xs text-slate-300">/mês</span>
                </div>
                <p className="text-[11px] text-brand-lime font-medium mt-1">
                  {isAnnual ? 'Cobrado anualmente (R$ 149,90/ano) • Menos de R$ 0,41/dia' : 'Cobrado mensalmente • Cancele quando quiser'}
                </p>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Lançamentos ilimitados</strong> (áudio, foto e texto)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Múltiplos cartões de crédito</strong> com faturas separadas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Leitura de cupons e comprovantes Pix</strong> por foto</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Painel Web avançado</strong> com gráficos e metas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Exportação para contador</strong> em PDF e Excel</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand-lime shrink-0" />
                  <span><strong>Suporte prioritário</strong> direto no WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <a
                href={WA_PRO}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg font-bold text-center text-sm shadow-[0_0_25px_rgba(140,184,42,0.4)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Experimentar 7 Dias Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-center text-[10px] text-slate-300">
                🔒 Sem fidelidade • Cancele com 1 clique a qualquer momento
              </p>
            </div>

          </div>

        </div>

        {/* Box de Garantia Incondicional */}
        <div className="max-w-3xl mx-auto mt-14 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-brand-lime/20 border border-brand-lime/30 flex items-center justify-center text-brand-lime shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              Garantia Blindada de Satisfação (7 Dias)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Teste o João.ai sem restrições. Se durante os primeiros 7 dias você sentir que ele não facilitou sua vida financeira, você não paga nada. Risco 100% nosso.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingCommercial;
