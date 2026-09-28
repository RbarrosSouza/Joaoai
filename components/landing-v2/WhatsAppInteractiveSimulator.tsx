import React, { useState } from 'react';
import { Mic, Camera, Send, CheckCheck, Sparkles, ArrowRight, Play, Check, ShieldCheck } from 'lucide-react';

interface Scenario {
  id: string;
  buttonLabel: string;
  icon: 'mic' | 'camera' | 'text';
  userMessage: {
    type: 'audio' | 'image' | 'text';
    content: string;
    subtext?: string;
    time: string;
  };
  botResponse: {
    title: string;
    amount: string;
    category: string;
    payment: string;
    status: string;
    balanceImpact: string;
    time: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'audio',
    buttonLabel: '🎙️ Enviar áudio: Almoço de R$ 68',
    icon: 'mic',
    userMessage: {
      type: 'audio',
      content: '0:04',
      subtext: '"João, gastei 68 reais no almoço de hoje no cartão Nubank"',
      time: '12:45',
    },
    botResponse: {
      title: 'Anotado com sucesso! 🍽️',
      amount: 'R$ 68,00',
      category: 'Alimentação / Restaurantes',
      payment: 'Cartão Nubank (Final 8421)',
      status: 'Fatura de Março',
      balanceImpact: 'Gasto mensal: R$ 2.450 / Meta R$ 3.000',
      time: '12:45',
    },
  },
  {
    id: 'image',
    buttonLabel: '🧾 Foto de Cupom: Posto R$ 180',
    icon: 'camera',
    userMessage: {
      type: 'image',
      content: '📸 Cupom_Posto_Shell.jpg',
      subtext: 'Foto da comanda/nota fiscal enviada',
      time: '17:12',
    },
    botResponse: {
      title: 'Nota fiscal lida pela IA! ⛽',
      amount: 'R$ 180,00',
      category: 'Transporte / Combustível',
      payment: 'Pix (Itaú)',
      status: 'Pago e Conciliado',
      balanceImpact: 'Subtotal Transporte: R$ 520 no mês',
      time: '17:12',
    },
  },
  {
    id: 'income',
    buttonLabel: '💰 Mensagem: Recebi R$ 3.500 Pix',
    icon: 'text',
    userMessage: {
      type: 'text',
      content: 'Caiu o Pix de 3500 do cliente Pedro consultoria',
      time: '09:30',
    },
    botResponse: {
      title: 'Receita registrada! 🎉',
      amount: '+ R$ 3.500,00',
      category: 'Receitas / Consultoria',
      payment: 'Conta Corrente Inter',
      status: 'Saldo Disponível',
      balanceImpact: 'Saldo total do mês: + R$ 5.890,00',
      time: '09:30',
    },
  },
];

export const WhatsAppInteractiveSimulator: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('audio');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const current = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    if (id === activeScenarioId) return;
    setIsTyping(true);
    setActiveScenarioId(id);
    setTimeout(() => {
      setIsTyping(false);
    }, 450);
  };

  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Testei%20o%20simulador%20no%20site%20e%20quero%20come%C3%A7ar%20no%20WhatsApp';

  return (
    <section id="simulador" className="py-20 md:py-28 bg-[#03120B] text-white relative overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulação em Tempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Veja a facilidade na sua frente.{' '}
            <span className="font-semibold text-brand-lime">Clique e teste.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Escolha uma das situações abaixo para ver como o João processa suas despesas instantaneamente pelo WhatsApp:
          </p>
        </div>

        {/* Botões de Cenários Interativos */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto mb-10">
          {SCENARIOS.map((s) => {
            const isActive = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s.id)}
                className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-md ${
                  isActive
                    ? 'bg-brand-lime text-brand-darkBg scale-105 shadow-[0_0_25px_rgba(140,184,42,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span>{s.buttonLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup do WhatsApp + Dashboard Preview */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">

          {/* Lado Esquerdo: Chat do WhatsApp */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-[#111B21] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">

              {/* Header do WhatsApp */}
              <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-deep border border-brand-lime/40 p-1 flex items-center justify-center">
                      <img
                        src="/Logos/logo-icon-only.png"
                        alt="João.ai"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202C33]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white text-sm">João.ai Finanças</span>
                      <span className="text-[10px] bg-brand-lime/20 text-brand-lime font-bold px-1.5 py-0.5 rounded">
                        ✓ OFICIAL
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">online agora</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Sem download de app
                </div>
              </div>

              {/* Corpo de Mensagens */}
              <div className="p-4 sm:p-5 space-y-4 min-h-[340px] bg-[#0b141a] flex flex-col justify-end text-sm">

                {/* Balão do Usuário */}
                <div className="self-end max-w-[85%] bg-[#005C4B] text-white p-3 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 animate-fade-in">
                  {current.userMessage.type === 'audio' && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                      <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-lime w-2/3 rounded-full" />
                      </div>
                      <span className="text-[11px] text-slate-300 font-mono">0:04</span>
                    </div>
                  )}

                  {current.userMessage.type === 'image' && (
                    <div className="rounded-lg bg-black/30 p-2 text-xs border border-white/10 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-brand-lime" />
                      <span className="font-medium text-slate-200">{current.userMessage.content}</span>
                    </div>
                  )}

                  {current.userMessage.type === 'text' && (
                    <p className="text-sm text-slate-100">{current.userMessage.content}</p>
                  )}

                  {current.userMessage.subtext && (
                    <p className="text-xs text-slate-300 italic pt-0.5">
                      {current.userMessage.subtext}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-300">
                    <span>{current.userMessage.time}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>

                {/* Balão do João (Resposta) */}
                {isTyping ? (
                  <div className="self-start bg-[#202C33] text-slate-300 px-4 py-2.5 rounded-2xl rounded-tl-xs text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
                    <span>João está digitando e processando...</span>
                  </div>
                ) : (
                  <div className="self-start max-w-[90%] bg-[#202C33] text-white p-4 rounded-2xl rounded-tl-xs shadow-lg space-y-2.5 border border-white/5 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-brand-lime text-xs font-bold uppercase tracking-wider">
                      <Check className="w-4 h-4" />
                      <span>{current.botResponse.title}</span>
                    </div>

                    <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400">Valor:</span>
                        <span className="text-base font-bold text-white font-mono">
                          {current.botResponse.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Categoria:</span>
                        <span className="text-slate-200 font-medium">{current.botResponse.category}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Forma / Cartão:</span>
                        <span className="text-brand-lime font-medium">{current.botResponse.payment}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                      <span>{current.botResponse.balanceImpact}</span>
                      <span className="text-[10px]">{current.botResponse.time}</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Input Falso do WhatsApp */}
              <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3 border-t border-white/5">
                <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Mensagem ou áudio para João...</span>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <Mic className="w-4 h-4 text-brand-lime" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center text-brand-darkBg">
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Lado Direito: Por que isso é revolucionário? */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
                <span>Zero Atrito, Zero Planilhas</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Você já tentou baixar aplicativos de finanças e desistiu em 3 dias porque era chato digitar tudo?
                Com o João, registrar um gasto leva exatamente <strong>4 segundos</strong>.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Áudios naturais:</strong> Fale como quiser. A IA extrai valor, estabelecimento e forma de pagamento.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Múltiplos cartões:</strong> Diga "foi no Nubank" ou "no Itaú" e a fatura certa será debitada.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Sincronização web automática:</strong> Gráficos, saldos e relatórios atualizam na hora.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg font-bold text-sm shadow-[0_0_25px_rgba(140,184,42,0.3)] transition-all duration-200"
                >
                  <span>Experimentar Agora no seu WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhatsAppInteractiveSimulator;
