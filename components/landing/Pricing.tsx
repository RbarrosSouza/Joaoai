import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const navigate = useNavigate();

    return (
        <section id="pricing" className="py-24 md:py-32 bg-brand-background relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-light text-slate-800 tracking-tight mb-8">
                        Simples de usar. Simples de <span className="font-display italic text-brand-primary pr-2">pagar.</span>
                    </h2>

                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-800' : 'text-slate-400'}`}>Mensal</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-16 h-8 bg-brand-primary rounded-full p-1 relative shadow-inner cursor-pointer"
                        >
                            <motion.div
                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                animate={{ x: isAnnual ? 32 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-slate-800' : 'text-slate-400'}`}>
                            Anual <span className="text-brand-lime ml-1 bg-brand-primary/10 px-2 py-0.5 rounded-full text-xs font-bold border border-brand-primary/20">58% off</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card Grátis */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 flex flex-col relative group hover:shadow-xl transition-shadow duration-500">
                        <h3 className="text-2xl font-semibold text-slate-800 mb-2">Starter</h3>
                        <p className="text-slate-500 font-light mb-8 h-12">Comece a organizar suas finanças sem gastar nada.</p>

                        <div className="mb-8 relative h-20">
                            <span className="text-lg font-medium text-slate-400 absolute top-2">R$</span>
                            <span className="text-6xl md:text-7xl font-display font-medium text-slate-800 ml-6">0</span>
                            <span className="text-slate-500 font-light absolute bottom-2 ml-2">/mês</span>
                        </div>

                        <div className="flex-1">
                            <ul className="space-y-4 mb-10">
                                {['Até 50 registros por mês', 'Dashboard financeiro básico', '1 cartão de crédito', 'Suporte via comunidade'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check size={18} className="text-slate-300 shrink-0" />
                                        <span className="text-slate-600 font-light whitespace-normal leading-tight">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full py-5 bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Criar conta grátis
                        </button>
                    </div>

                    {/* Card Premium (Liquid Glass) */}
                    <div className="bg-brand-darkBg text-white rounded-[2.5rem] p-8 md:p-12 border border-brand-glassBorder shadow-glass flex flex-col relative overflow-hidden group transform md:-translate-y-4">
                        {/* Liquid Glass Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/30 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-secondary/40 transition-colors duration-1000"></div>

                        <div className="absolute top-6 right-8">
                            <span className="bg-brand-lime text-brand-darkBg text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-glow">Mais popular</span>
                        </div>

                        <h3 className="text-2xl font-semibold text-white mb-2 relative z-10">Pro</h3>
                        <p className="text-slate-300 font-light mb-8 h-12 relative z-10">Pra quem quer controle total e zero limite.</p>

                        <div className="mb-8 relative h-20 z-10">
                            <span className="text-lg font-medium text-brand-lime absolute top-2">R$</span>
                            <div className="relative inline-block ml-6 w-32 h-20 overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={isAnnual ? 'annual' : 'monthly'}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute inset-0 text-6xl md:text-7xl font-display font-medium text-brand-lime flex items-center"
                                    >
                                        {isAnnual ? '12,49' : '29,90'}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <span className="text-brand-lime/60 font-light absolute bottom-2">/mês{isAnnual && ', R$ 149,90/ano'}</span>
                        </div>

                        <div className="flex-1 relative z-10">
                            <ul className="space-y-4 mb-10">
                                {['Registros ilimitados por voz e texto', 'Dashboard completo e customizável', 'Leitura de recibos por foto', 'Previsão de gastos e recorrências', 'Exportação PDF para seu contador'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check size={18} className="text-brand-lime shrink-0" />
                                        <span className="text-slate-200 font-light opacity-90">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/signup')}
                            className="relative z-10 w-full py-5 bg-brand-lime text-brand-darkBg rounded-2xl font-bold hover:shadow-[0_0_40px_rgba(140,184,42,0.4)] hover:-translate-y-1 transition-all duration-300"
                        >
                            Começar 7 dias grátis
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;
