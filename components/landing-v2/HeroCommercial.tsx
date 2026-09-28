import React from 'react';
import { MessageSquare, ArrowRight, Star, ShieldCheck, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export const HeroCommercial: React.FC = () => {
  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20testar%20gr%C3%A1tis%20por%207%20dias%20no%20WhatsApp';

  const scrollToSimulador = () => {
    const el = document.getElementById('simulador');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-brand-darkBg text-white">
      {/* Luz ambiente de fundo otimizada (sem filtros SVG pesados) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[350px] md:h-[450px] bg-gradient-to-br from-brand-primary/30 via-brand-lime/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-0 opacity-70" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-lime/10 rounded-full blur-[90px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Badge de Destaque & Prova Social */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner mb-6 animate-fade-in">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-200">
              4.9/5 • O assistente financeiro preferido no WhatsApp
            </span>
          </div>

          {/* Headline Comercial de Alto Impacto */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.12] mb-6 text-white">
            Chega de planilhas.{' '}
            <br className="hidden sm:inline" />
            Controle seu dinheiro com um{' '}
            <span className="font-semibold text-brand-lime underline decoration-brand-lime/40 underline-offset-8">
              áudio no WhatsApp.
            </span>
          </h1>

          {/* Subheadline persuasiva com alívio de dor */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed mb-8">
            Gastou no almoço ou pagou uma conta? Mande um áudio, foto de cupom ou Pix.
            O <strong className="text-white font-medium">João.ai</strong> categoriza, organiza suas faturas e entrega tudo pronto em segundos.
          </p>

          {/* CTAs Principais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-6">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg font-bold text-base shadow-[0_0_35px_rgba(140,184,42,0.4)] hover:shadow-[0_0_45px_rgba(140,184,42,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5 fill-brand-darkBg" />
              <span>Testar 7 Dias Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToSimulador}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-medium text-sm transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-brand-lime" />
              <span>Ver Demonstração</span>
            </button>
          </div>

          {/* Garantias e Quebra de Objeções Rápidas */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium mb-12">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-lime" />
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-lime" />
              Pronto em 30 segundos
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-lime" />
              Privacidade total e LGPD
            </span>
          </div>

          {/* Micro-prova social de clientes */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full border-2 border-brand-darkBg bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                DR
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-darkBg bg-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                ML
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-darkBg bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                CF
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-darkBg bg-purple-700 flex items-center justify-center text-[10px] font-bold text-white">
                RN
              </div>
            </div>
            <span>
              Mais de <strong>1.500 autônomos, médicos e profissionais</strong> já deixaram as planilhas para trás.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroCommercial;
