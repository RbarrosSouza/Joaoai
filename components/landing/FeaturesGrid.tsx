import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Receipt, Wallet, Bell, RefreshCw, Zap } from 'lucide-react';

const FeaturesGrid: React.FC = () => {

    const variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section id="features" className="py-24 md:py-32 bg-brand-background relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="inline-block px-3 py-1.5 rounded-full bg-slate-200/50 text-slate-500 font-semibold tracking-wide text-xs mb-6 mix-blend-multiply border border-slate-300">
                            O QUE VOCÊ GANHA
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-brand-deep tracking-tight">
                            Tudo que você precisa, <span className="font-display italic text-brand-primary">sem complicação.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-slate-500 font-light max-w-md">
                        Ferramentas simples que trabalham por você, enquanto você vive.
                    </p>
                </div>

                {/* Liquid Glass Bento Box Grid */}
                <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Bento Item 1 - Large Focus (Gestão de Cartões) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={variants}
                        className="md:col-span-2 md:row-span-2 bg-brand-darkBg text-white rounded-[2.5rem] p-8 md:p-12 border border-brand-glassBorder shadow-glass relative overflow-hidden group flex flex-col justify-end"
                    >
                        {/* Liquid Glass ambient glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full mix-blend-screen filter blur-[80px] group-hover:bg-brand-secondary/30 transition-colors duration-1000 -translate-y-1/2 translate-x-1/2"></div>

                        <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet size={120} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 max-w-md">
                            <div className="w-14 h-14 bg-brand-glass rounded-2xl flex items-center justify-center backdrop-blur-md border border-brand-glassBorder mb-8 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                                <Wallet className="text-brand-lime" size={28} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-4 text-white drop-shadow-md">Cartões Multi-Bandeira</h3>
                            <p className="text-slate-300 font-light text-lg leading-relaxed">
                                Tem Nubank, Itaú e outro cartão? Adiciona todos. Quando mandar seu gasto, diz qual cartão usou. O João organiza cada fatura separado.
                            </p>
                        </div>

                        {/* Embedded Abstract UI Element */}
                        <div className="relative z-10 mt-8 hidden lg:flex self-end bg-brand-glass backdrop-blur-xl border border-brand-glassBorder rounded-2xl p-6 shadow-glass gap-6 items-center group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="h-16 flex items-center justify-center">
                                <img src="/Logos/joao-logo-high-res.png" alt="João.ai" className="h-full w-auto object-contain" />
                            </div>
                            <div>
                                <div className="text-xs text-brand-lime font-bold">Fatura Fechada</div>
                                <div className="text-lg font-medium">R$ 4.250,80</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bento Item 2 - Medium (Analytics) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={variants}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group flex flex-col"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-12 h-12 bg-slate-50 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-2">Insights Automáticos</h3>
                        <p className="text-slate-500 font-light flex-1">
                            Para onde seu dinheiro está indo? Descubra com gráficos que se atualizam sozinhos a cada mensagem que você manda.
                        </p>
                    </motion.div>

                    {/* Bento Item 3 - Medium (Recibos via Visão) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={variants}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group flex flex-col"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-12 h-12 bg-slate-50 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                            <Receipt size={24} />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-2">Leitura de Recibos</h3>
                        <p className="text-slate-500 font-light flex-1">
                            Fotografou a nota fiscal? A IA lê o valor, a loja e a data. Pronto. Seu comprovante fica guardado e o gasto catalogado.
                        </p>
                    </motion.div>

                    {/* Bento Item 4 - Wide (Recorrências) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={variants}
                        className="md:col-span-3 bg-brand-primary text-white rounded-[2.5rem] p-8 md:p-12 border border-brand-secondary/30 shadow-premium relative overflow-hidden group flex flex-col md:flex-row items-center gap-8 justify-between"
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                        <div className="flex-1 relative z-10 w-full max-w-2xl">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-6">
                                <RefreshCw className="text-brand-lime" size={24} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-3">Gastos Recorrentes</h3>
                            <p className="text-brand-background/80 font-light text-lg">
                                Netflix, academia, Spotify. Marca como recorrente e o João prevê seu comprometimento do mês seguinte. Sem surpresas.
                            </p>
                        </div>

                        <div className="relative z-10 hidden lg:block">
                            <div className="flex -space-x-4">
                                <div className="w-16 h-16 rounded-full border-2 border-brand-primary bg-slate-800 flex items-center justify-center z-30 shadow-lg text-xs font-bold text-white">
                                    NETFLIX
                                </div>
                                <div className="w-16 h-16 rounded-full border-2 border-brand-primary bg-brand-deep flex items-center justify-center z-20 shadow-lg text-xs font-bold text-white">
                                    SPOTIFY
                                </div>
                                <div className="w-16 h-16 rounded-full border-2 border-brand-primary bg-slate-600 flex items-center justify-center z-10 shadow-lg text-xs font-bold text-white">
                                    GYMPASS
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
