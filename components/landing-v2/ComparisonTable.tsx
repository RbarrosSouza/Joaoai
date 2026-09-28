import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const rows = [
    {
      feature: 'Como registrar um gasto',
      joao: 'Áudio ou foto de 3s no WhatsApp',
      sheets: 'Digitar célula por célula no PC',
      apps: 'Preencher formulário de 10 campos',
    },
    {
      feature: 'Funciona no WhatsApp?',
      joao: true,
      sheets: false,
      apps: false,
    },
    {
      feature: 'Leitura de notas fiscais e recibos',
      joao: 'IA lê em 2 segundos por foto',
      sheets: false,
      apps: 'Apenas em planos caros',
    },
    {
      feature: 'Gestão de múltiplos cartões de crédito',
      joao: 'Faturas e datas automáticas',
      sheets: 'Fórmulas manuais complexas',
      apps: 'Configuração manual cansativa',
    },
    {
      feature: 'Consultas rápidas ("Quanto gastei?")',
      joao: 'Resposta instantânea por chat',
      sheets: 'Filtrar tabelas dinâmicas',
      apps: 'Navegar por vários menus',
    },
    {
      feature: 'Precisa baixar aplicativo pesado?',
      joao: 'Não! Usa seu próprio WhatsApp',
      sheets: 'Sim, ou abrir no navegador',
      apps: 'Sim, ocupa memória do celular',
    },
    {
      feature: 'Chance de você desistir no 1º mês',
      joao: 'Praticamente zero (hábito natural)',
      sheets: 'Altíssima (> 85%)',
      apps: 'Alta (> 70%)',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#03120B] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-lime bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20">
            Comparativo Direto
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mt-4 mb-4">
            Coloque lado a lado e tire suas conclusões.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Veja por que quem experimenta o João.ai nunca mais volta para métodos antigos.
          </p>
        </div>

        {/* Tabela de Comparação */}
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-5 sm:p-6 text-sm font-semibold text-slate-300 w-2/5">
                  Critério de Avaliação
                </th>
                <th className="p-5 sm:p-6 text-sm font-bold text-brand-darkBg bg-brand-lime/95 text-center rounded-t-2xl w-1/5 shadow-md">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 fill-brand-darkBg" />
                    <span>João.ai</span>
                  </div>
                </th>
                <th className="p-5 sm:p-6 text-sm font-semibold text-slate-400 text-center w-1/5">
                  Planilhas Excel / Sheets
                </th>
                <th className="p-5 sm:p-6 text-sm font-semibold text-slate-400 text-center w-1/5">
                  Apps Tradicionais
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 sm:p-6 font-medium text-slate-200">
                    {row.feature}
                  </td>

                  {/* Coluna João.ai com destaque */}
                  <td className="p-5 sm:p-6 bg-brand-lime/10 text-center font-semibold text-white border-x border-brand-lime/20">
                    {typeof row.joao === 'boolean' ? (
                      row.joao ? (
                        <div className="w-6 h-6 rounded-full bg-brand-lime text-brand-darkBg flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-slate-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-brand-lime font-bold">{row.joao}</span>
                    )}
                  </td>

                  {/* Planilhas */}
                  <td className="p-5 sm:p-6 text-center text-slate-400">
                    {typeof row.sheets === 'boolean' ? (
                      row.sheets ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4" />
                        </div>
                      )
                    ) : (
                      <span>{row.sheets}</span>
                    )}
                  </td>

                  {/* Apps Tradicionais */}
                  <td className="p-5 sm:p-6 text-center text-slate-400">
                    {typeof row.apps === 'boolean' ? (
                      row.apps ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4" />
                        </div>
                      )
                    ) : (
                      <span>{row.apps}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

export default ComparisonTable;
