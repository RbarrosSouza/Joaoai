import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const SocialProofTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Felipe Rocha',
      role: 'Médico Plantonista',
      city: 'São Paulo - SP',
      avatarBg: 'bg-emerald-600',
      initials: 'FR',
      text: 'Minha rotina em hospital é corrida demais. Antes, meus comprovantes de combustível e almoço viravam uma pilha amassada na carteira. Agora eu saio do plantão, mando um áudio de 4 segundos e pronto. O João fez eu nunca mais perder o controle.',
      rating: 5,
    },
    {
      name: 'Camila Silveira',
      role: 'Designer Freelancer',
      city: 'Belo Horizonte - MG',
      avatarBg: 'bg-blue-600',
      initials: 'CS',
      text: 'Eu passava todo domingo à noite estressada tentando lembrar no que tinha gastado na semana. Já tentei dezenas de apps e sempre desistia por causa de formulários chatos. O João no WhatsApp é a coisa mais prática que já inventaram.',
      rating: 5,
    },
    {
      name: 'Marcelo Fontes',
      role: 'Empresário & Dono de Café',
      city: 'Ribeirão Preto - SP',
      avatarBg: 'bg-amber-600',
      initials: 'MF',
      text: 'O que mais me impressionou foi a facilidade com múltiplos cartões. Eu falo "paguei no cartão da loja" ou "no pessoal" e a IA separa as faturas sem misturar. Chega no fim do mês e o relatório já está pronto pro meu contador.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#051A10] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Quem começou a usar,{' '}
            <span className="font-semibold text-brand-lime">não vive mais sem.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Depoimentos reais de profissionais que transformaram sua relação com o dinheiro.
          </p>
        </div>

        {/* Depoimentos */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-lime/30 transition-all duration-300 shadow-lg relative group"
            >
              <div>
                <Quote className="w-8 h-8 text-brand-lime/30 mb-4 group-hover:text-brand-lime/60 transition-colors" />
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime" />
                  </h4>
                  <p className="text-xs text-slate-400">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Métricas de Credibilidade */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-lime font-mono">4.9/5</p>
            <p className="text-xs text-slate-400 mt-1">Avaliação de satisfação</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">+50k</p>
            <p className="text-xs text-slate-400 mt-1">Lançamentos processados</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-lime font-mono">3 seg</p>
            <p className="text-xs text-slate-400 mt-1">Tempo médio de registro</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">100%</p>
            <p className="text-xs text-slate-400 mt-1">Seguro e criptografado</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SocialProofTestimonials;
