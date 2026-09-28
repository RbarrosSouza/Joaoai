import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

export const ProblemSolutionComparison: React.FC = () => {
  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20sair%20do%20caos%20financeiro%20e%20testar%20gr%C3%A1tis';

  return (
    <section id="comparativo" className="py-20 md:py-28 bg-[#051A10] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-lime bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20">
            A Diferença na Prática
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mt-4 mb-4">
            Por que mais de 90% das pessoas{' '}
            <span className="font-semibold text-rose-400 line-through decoration-rose-500">desistem de planilhas?</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            O problema não é sua falta de disciplina. O problema é a ferramenta errada.
          </p>
        </div>

        {/* Grade Comparativa Caos vs Paz */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Card: O Jeito Antigo (Caos) */}
          <div className="rounded-3xl bg-rose-950/20 border border-rose-900/30 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-900/30 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">O Jeito Antigo</h3>
                  <p className="text-xs text-rose-300">Planilhas, apps burocráticos e estresse</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Esquecimento constante:</strong> Você gasta na rua, guarda o recibo na carteira e esquece de lançar.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Domingos perdidos:</strong> Ter que sentar no computador para preencher 40 linhas de Excel com dor de cabeça.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Apps com 15 formulários:</strong> Pedem data, hora, conta, categoria, beneficiário... você desiste em 3 dias.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Susto na fatura:</strong> O fim do mês chega e você não faz ideia de onde foi parar metade do seu salário.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-900/30 text-xs text-rose-300/80 italic">
              Resultado: Frustração, descontrole e a eterna sensação de trabalhar apenas para pagar contas.
            </div>
          </div>

          {/* Card: Com o João.ai (Paz) */}
          <div className="rounded-3xl bg-brand-deep/50 border border-brand-lime/30 p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(140,184,42,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-lime/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-lime/20 border border-brand-lime/40 flex items-center justify-center text-brand-lime">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Com o João.ai
                    <span className="text-[10px] bg-brand-lime text-brand-darkBg font-bold px-2 py-0.5 rounded-full uppercase">
                      Alívio Total
                    </span>
                  </h3>
                  <p className="text-xs text-brand-lime/80">Sem atrito, no aplicativo que você já usa todo dia</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                  <span>
                    <strong>Áudios de 3 segundos:</strong> "Gastei 45 no almoço". Pronto, lançado e categorizado antes de entrar no carro.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero tempo no fim de semana:</strong> Seus relatórios, gráficos e faturas já estão 100% montados em tempo real.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                  <span>
                    <strong>Fotos de comprovantes e cupons:</strong> Tirou foto de uma nota de R$ 180 do mercado? A IA lê e registra os detalhes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                  <span>
                    <strong>Tranquilidade garantida:</strong> Pergunte "Quanto gastei esse mês?" e o João responde na hora com seu saldo seguro.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-lime/20 flex items-center justify-between">
              <span className="text-xs text-brand-lime font-medium">
                Economia média de <strong>4 horas por semana</strong>
              </span>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-darkBg bg-brand-lime hover:bg-[#9cd02c] px-4 py-2 rounded-full transition-all"
              >
                <span>Quero essa paz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProblemSolutionComparison;
