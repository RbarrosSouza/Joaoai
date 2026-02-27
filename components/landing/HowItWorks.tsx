import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Zap, FileText, BarChart3 } from 'lucide-react';

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

                <div className="text-center mb-24 relative">
                    {/* Abstract watermark centered */}
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-display italic text-brand-primary/5 opacity-30 z-[-1] leading-none tracking-tighter">
                        Simples.
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 tracking-tight">
                        Como funciona na <span className="font-display italic text-brand-primary">vida real.</span>
                    </h2>
                </div>

                <div className="flex flex-col gap-24 lg:gap-32">

                    {/* Step 01 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative"
                    >
                        <div className="flex-1 lg:text-right relative">
                            <span className="absolute -top-16 lg:-top-20 lg:-right-4 text-[8rem] font-display italic text-brand-primary/10 opacity-50 z-[-1] leading-none">1</span>
                            <h3 className="text-3xl lg:text-4xl font-semibold text-brand-primary mb-4 tracking-tight">Gastou? Avisa o João.</h3>
                            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md ml-auto">
                                No meio do almoço, no Uber, no mercado. Manda um áudio, uma foto do recibo ou digita rapidinho. Sem abrir app, sem login, sem atrito.
                            </p>
                        </div>

                        <div className="shrink-0 w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center z-10 shadow-[0_0_30px_rgba(15,118,110,0.4)] relative">
                            <div className="absolute inset-0 rounded-full border border-brand-primary animate-ping opacity-50"></div>
                            <Mic size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 relative w-full lg:w-auto">
                            {/* WhatsApp Mockup */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-glass border border-slate-200 max-w-sm ml-0 lg:ml-0 rotate-2 hover:rotate-0 transition-transform duration-500 mx-auto lg:mx-0 flex flex-col gap-4">
                                {/* Mensagem Simulada (Input) - User Audio */}
                                <div className="self-end bg-brand-lime/10 border border-brand-lime/20 rounded-2xl rounded-tr-sm p-3 text-slate-700 text-sm shadow-sm relative w-[85%]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mic size={14} className="text-brand-primary" />
                                        <div className="h-1 bg-brand-primary/30 rounded-full flex-1 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                                className="absolute left-0 top-0 h-full bg-brand-primary rounded-full"
                                            ></motion.div>
                                        </div>
                                        <span className="text-[10px] text-brand-primary font-medium">0:04</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 italic mt-1 pb-1">"Gastei R$ 150 no Uber do Mercado..."</p>
                                    <div className="text-right mt-1 absolute bottom-2 right-2"><span className="text-[10px] text-brand-lime font-bold">14:02 ✓✓</span></div>
                                </div>

                                {/* Bot Confirmation */}
                                <div className="self-start bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm p-3 text-slate-700 text-sm shadow-sm relative w-[85%] mt-2">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Zap size={14} className="text-brand-secondary" />
                                        <span className="text-xs font-bold text-slate-800">João.ai</span>
                                    </div>
                                    <p className="leading-relaxed text-sm text-slate-600">✅ <b>Registrado!</b><br />Transporte: R$ 150,00 no Cartão Black.</p>
                                    <div className="text-right mt-1"><span className="text-[10px] text-slate-400">14:02</span></div>
                                </div>
                            </div>
                        </div>

                    </motion.div>


                    {/* Step 02 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 relative"
                    >
                        <div className="flex-1 relative">
                            <span className="absolute -top-16 lg:-top-20 lg:-left-4 text-[8rem] font-display italic text-brand-secondary/10 opacity-50 z-[-1] leading-none">2</span>
                            <h3 className="text-3xl lg:text-4xl font-semibold text-brand-secondary mb-4 tracking-tight">A IA entende tudo.</h3>
                            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md">
                                O João escuta seu áudio, lê sua foto e entende o contexto. Valor, categoria, data, forma de pagamento. Tudo organizado em segundos.
                            </p>
                        </div>

                        <div className="shrink-0 w-16 h-16 rounded-full bg-brand-secondary text-white flex items-center justify-center z-10 shadow-[0_0_30px_rgba(20,184,166,0.4)] relative">
                            <div className="absolute inset-0 rounded-full border border-brand-secondary animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                            <Zap size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 flex justify-end w-full lg:w-auto">
                            <div className="bg-brand-darkBg text-white rounded-[2rem] p-6 shadow-glass border border-brand-glassBorder max-w-sm -rotate-2 hover:rotate-0 transition-transform duration-500 mx-auto lg:mx-0 w-full relative overflow-hidden flex flex-col gap-5">
                                {/* Liquid Glass Highlight */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/30 rounded-full blur-[40px]"></div>

                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>
                                    <span className="text-xs uppercase tracking-widest text-brand-lime font-bold">Sistema Atualizado</span>
                                </div>

                                {/* Grafico Animado 1: Fatura do Cartão */}
                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs mb-2 font-medium">
                                        <span className="text-slate-400">Cartão Black</span>
                                        <span className="text-white font-bold transition-all duration-300">R$ 4.890,00</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: "60%" }}
                                            animate={{ width: "85%" }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                            className="bg-brand-lime h-full rounded-full absolute left-0 top-0 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                                        ></motion.div>
                                    </div>
                                </div>

                                {/* Grafico Animado 2: Categoria Transporte */}
                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs mb-2 font-medium">
                                        <span className="text-slate-400">Transporte (Uber)</span>
                                        <span className="text-white font-bold transition-all duration-300">R$ 650,00</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: "30%" }}
                                            animate={{ width: "65%" }}
                                            transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
                                            className="bg-brand-secondary h-full rounded-full absolute left-0 top-0 shadow-[0_0_10px_rgba(20,184,166,0.6)]"
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* Step 03 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative"
                    >
                        <div className="flex-1 lg:text-right relative">
                            <span className="absolute -top-16 lg:-top-20 lg:-right-4 text-[8rem] font-display italic text-brand-darkBg/5 opacity-50 z-[-1] leading-none">3</span>
                            <h3 className="text-3xl lg:text-4xl font-semibold text-brand-darkBg mb-4 tracking-tight">Seu painel fica pronto.</h3>
                            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md ml-auto">
                                Abra o dashboard quando quiser. Tudo que você mandou virou gráfico: por categoria, por cartão, por mês. Sem digitar nada.
                            </p>
                        </div>

                        <div className="shrink-0 w-16 h-16 rounded-full bg-brand-darkBg text-white flex items-center justify-center z-10 shadow-[0_0_30px_rgba(2,44,34,0.3)] relative">
                            <div className="absolute inset-0 rounded-full border border-brand-darkBg animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
                            <FileText size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 w-full lg:w-auto">
                            <div className="bg-white rounded-[2rem] p-6 shadow-premium border border-slate-200 w-full max-w-md rotate-1 hover:rotate-0 transition-transform duration-500 mx-auto lg:mx-0">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Fatura Cartão Black</h4>
                                        <p className="text-xs text-slate-400">Novembro 2023</p>
                                    </div>
                                    <div className="text-xl font-bold text-brand-darkBg">R$ 4.890</div>
                                </div>

                                {/* Fake UI bars */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Transporte</span><span className="font-medium text-slate-700">R$ 600</span></div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-brand-secondary h-1.5 rounded-full w-[35%]"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Alimentação</span><span className="font-medium text-slate-700">R$ 1.200</span></div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full w-[65%]"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 04 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 relative"
                    >
                        <div className="flex-1 relative">
                            <span className="absolute -top-16 lg:-top-20 lg:-left-4 text-[8rem] font-display italic text-brand-primary/10 opacity-50 z-[-1] leading-none">4</span>
                            <h3 className="text-3xl lg:text-4xl font-semibold text-brand-primary mb-4 tracking-tight">Você enxerga o cenário completo.</h3>
                            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-md">
                                Compare meses, identifique onde está gastando mais e tome decisões com dados reais. Controle financeiro de verdade, sem planilha.
                            </p>
                        </div>

                        <div className="shrink-0 w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center z-10 shadow-[0_0_30px_rgba(15,118,110,0.4)] relative">
                            <div className="absolute inset-0 rounded-full border border-brand-primary animate-ping opacity-50" style={{ animationDelay: '1.5s' }}></div>
                            <BarChart3 size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 flex justify-end w-full lg:w-auto">
                            <div className="bg-white rounded-[2rem] p-6 shadow-premium border border-slate-200 w-full max-w-md -rotate-1 hover:rotate-0 transition-transform duration-500 mx-auto lg:mx-0">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Comparativo Mensal</h4>
                                        <p className="text-xs text-slate-400">Novembro vs Dezembro</p>
                                    </div>
                                    <div className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">-12% gastos</div>
                                </div>

                                {/* Animated Bar Chart */}
                                <div className="flex items-end gap-6 h-32 border-b border-slate-200 pb-2 mb-6 justify-center">
                                    {/* Month 1 */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 bg-slate-100 rounded-t-md relative flex items-end justify-center h-[100px]">
                                            <motion.div
                                                initial={{ height: "0%" }}
                                                whileInView={{ height: "100%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                                className="w-full bg-slate-300 rounded-t-md shadow-inner"
                                            ></motion.div>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Nov</span>
                                    </div>
                                    {/* Month 2 */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 bg-slate-100 rounded-t-md relative flex items-end justify-center h-[100px]">
                                            <motion.div
                                                initial={{ height: "0%" }}
                                                whileInView={{ height: "80%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                                                className="w-full bg-brand-primary rounded-t-md shadow-inner"
                                            ></motion.div>
                                        </div>
                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Dez</span>
                                    </div>
                                </div>

                                {/* Animated Category Comparison */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Alimentação</span>
                                        <div className="flex gap-2 w-32 items-center">
                                            <div className="h-2 bg-slate-100 rounded-full flex-1 relative overflow-hidden">
                                                <motion.div initial={{ width: "0" }} whileInView={{ width: "90%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }} className="absolute top-0 left-0 h-full bg-slate-300 rounded-full"></motion.div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full flex-1 relative overflow-hidden">
                                                <motion.div initial={{ width: "0" }} whileInView={{ width: "70%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.2 }} className="absolute top-0 left-0 h-full bg-brand-primary rounded-full"></motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Lazer</span>
                                        <div className="flex gap-2 w-32 items-center">
                                            <div className="h-2 bg-slate-100 rounded-full flex-1 relative overflow-hidden">
                                                <motion.div initial={{ width: "0" }} whileInView={{ width: "60%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.0 }} className="absolute top-0 left-0 h-full bg-slate-300 rounded-full"></motion.div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full flex-1 relative overflow-hidden">
                                                <motion.div initial={{ width: "0" }} whileInView={{ width: "40%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.4 }} className="absolute top-0 left-0 h-full bg-brand-primary rounded-full"></motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
