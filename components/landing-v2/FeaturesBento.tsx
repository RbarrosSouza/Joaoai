import React from 'react';
import { CreditCard, BarChart3, Camera, MessageSquareText, FileSpreadsheet, ShieldCheck, Zap } from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-[#03120B] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-lime bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20">
            Recursos Essenciais
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mt-4 mb-4">
            Tudo que seu dinheiro precisa,{' '}
            <span className="font-semibold text-brand-lime">direto no seu bolso.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            O João cuida de toda a parte chata enquanto você foca em viver sua vida e fazer seu negócio crescer.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Card 1: Multi-Cartões (Destaque Grande) */}
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-[#0F3C28] to-[#0A261A] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-brand-lime/40 transition-colors">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-lime/20 border border-brand-lime/30 flex items-center justify-center text-brand-lime mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Gestão Inteligente de Múltiplos Cartões
              </h3>
              <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                Tem cartão Nubank, Itaú, XP e Inter? Basta falar no áudio qual cartão usou.
                O João separa as faturas pelo dia de fechamento e vencimento de cada um.
              </p>
            </div>

            {/* Mockup visual de cartões */}
            <div className="mt-8 pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Nubank Ultravioleta</p>
                  <p className="text-lg font-bold text-white font-mono">R$ 3.840,50</p>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-bold">
                  Fecha dia 18
                </span>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Itaú Personnalité</p>
                  <p className="text-lg font-bold text-white font-mono">R$ 1.920,00</p>
                </div>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full font-bold">
                  Fecha dia 25
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Leitura de Recibos */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:border-brand-lime/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-lime/20 border border-brand-lime/30 flex items-center justify-center text-brand-lime mb-6">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visão Computacional de Recibos</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Tire foto do cupom do restaurante, posto ou farmácia. A IA lê valores, data e impostos sem você digitar nada.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-brand-lime font-medium flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Reconhece 99% das notas fiscais
            </div>
          </div>

          {/* Card 3: Consultas Rápidas no WhatsApp */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:border-brand-lime/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-lime/20 border border-brand-lime/30 flex items-center justify-center text-brand-lime mb-6">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pergunte o que quiser no Chat</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Mande: "Quanto gastei em delivery esse mês?" ou "Qual meu saldo disponível?". O João calcula e responde em 3 segundos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
              "Você gastou R$ 380 em Delivery (-12% vs mês passado)"
            </div>
          </div>

          {/* Card 4: Painel Web com Gráficos (Destaque Grande) */}
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-[#0F3C28] to-[#0A261A] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-brand-lime/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-lime/20 border border-brand-lime/30 flex items-center justify-center text-brand-lime mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Painel Web Completo de Retaguarda
              </h3>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Para quando você quiser sentar e ver relatórios aprofundados, conciliações, orçamentos planejados e comparativos mensais.
                Tudo sincronizado em tempo real com o que você enviou pelo WhatsApp.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                📊 Gráficos por categoria
              </span>
              <span className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                🎯 Metas de economia
              </span>
              <span className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                📄 Exportação PDF para contador
              </span>
              <span className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                🔒 Acesso protegido por senha
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesBento;
