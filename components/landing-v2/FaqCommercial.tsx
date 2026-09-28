import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqCommercial: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Preciso baixar ou instalar algum aplicativo no celular?',
      answer:
        'Não! Essa é a maior vantagem do João.ai. Ele funciona diretamente dentro do seu WhatsApp, como se fosse um contato com quem você conversa todos os dias. Para ver gráficos e relatórios detalhados, você pode acessar o Painel Web em qualquer computador ou navegador.',
    },
    {
      question: 'O João.ai tem acesso à minha conta ou senha do banco?',
      answer:
        'De forma alguma! O João nunca pede suas senhas bancárias e não tem autorização para movimentar seu dinheiro. Ele funciona como um concierge financeiro: você avisa o que gastou ou recebeu (por áudio, foto de comprovante ou texto) e ele organiza tudo com inteligência.',
    },
    {
      question: 'Como funciona o teste gratuito de 7 dias?',
      answer:
        'Você clica no botão, inicia uma conversa no WhatsApp e começa a registrar seus gastos imediatamente. Não pedimos cartão de crédito para iniciar o teste. Se após 7 dias você amar a praticidade, pode assinar o plano Pro para continuar com lançamentos ilimitados.',
    },
    {
      question: 'Posso cadastrar múltiplos cartões de crédito?',
      answer:
        'Sim! No plano Pro você pode cadastrar quantos cartões quiser (Nubank, Itaú, XP, Inter, etc.). Ao mandar uma despesa, basta dizer "no cartão XP" que ele lança na fatura correta de acordo com a data de fechamento.',
    },
    {
      question: 'E se eu mandar um áudio com barulho no fundo?',
      answer:
        'A inteligência artificial do João é calibrada para transcrever e entender áudios mesmo com ruído de rua, trânsito ou restaurante. Ele extrai com precisão o valor, o estabelecimento e a categoria.',
    },
    {
      question: 'Serve para quem é autônomo, MEI ou tem clínica/consultório?',
      answer:
        'Com certeza! Milhares de nossos usuários são médicos, advogados, consultores e pequenos empresários que usam o João para separar os gastos profissionais dos pessoais e exportar relatórios prontos em PDF para o contador no final do mês.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#051A10] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Tudo que você precisa saber para começar a usar o João hoje mesmo.
          </p>
        </div>

        {/* Acordeão */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white/10 border-brand-lime/40 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-white"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-lime shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-300 text-sm leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqCommercial;
