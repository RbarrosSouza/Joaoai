import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const QAItem: React.FC<{ question: string; answer: React.ReactNode; isOpen: boolean; onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-brand-glassBorder/30 last:border-0 relative group">
            {/* Subtle hover background highlight */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

            <button
                className="w-full text-left py-6 flex justify-between items-center focus:outline-none relative z-10 px-4 md:px-6"
                onClick={onClick}
            >
                <span className={`text-xl font-medium transition-colors ${isOpen ? 'text-brand-lime' : 'text-slate-200 group-hover:text-white'}`}>
                    {question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-brand-lime/20 text-brand-lime' : 'bg-brand-glass border border-brand-glassBorder text-slate-400 group-hover:text-white group-hover:bg-white/10'}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden px-4 md:px-6"
                    >
                        <div className="pb-8 text-lg text-slate-400 font-light leading-relaxed max-w-3xl">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Preciso instalar algum app?",
            answer: "Não. O João funciona direto no WhatsApp. Você salva o número como contato e começa a mandar mensagens. O painel de gráficos você acessa pelo navegador."
        },
        {
            question: "É seguro mandar foto de nota fiscal?",
            answer: "Sim. A IA só lê dados fiscais (valor, loja, data). Seus dados são criptografados e nunca são vendidos ou compartilhados."
        },
        {
            question: "Ele entende áudio bagunçado?",
            answer: "Entende. Pode mandar: \"gastei duzentos de gasolina hoje no cartão do Nubank\" e ele classifica certinho: valor, categoria, conta e data."
        },
        {
            question: "Meu banco já tem gráficos, por que usar o João?",
            answer: "Apps de banco só mostram o que passou naquele banco. E a categorização é genérica. O João consolida todos os seus gastos em um lugar só, com categorias que fazem sentido."
        },
        {
            question: "Como funciona o plano Pro?",
            answer: "Você pode testar grátis por 7 dias. Se gostar, são R$ 29,90/mês ou R$ 149,90/ano com 58% de desconto. Sem fidelidade, cancela quando quiser."
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-brand-darkBg text-white relative">
            {/* Ambient Liquid Glass effect */}
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-brand-glass text-brand-lime font-semibold tracking-wide text-xs mb-6 border border-brand-glassBorder">
                        DÚVIDAS FREQUENTES
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-light tracking-tight">
                        Tudo que você quer <span className="font-display italic text-brand-lime">saber.</span>
                    </h2>
                </div>

                <div className="bg-brand-glass backdrop-blur-md rounded-3xl border border-brand-glassBorder p-4 md:p-8 shadow-glass">
                    {faqs.map((faq, index) => (
                        <QAItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
