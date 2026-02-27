import React from 'react';
import { Check, X } from 'lucide-react';

const ComparisonMatrix: React.FC = () => {
    return (
        <section id="comparison" className="py-24 md:py-32 bg-brand-background relative">
            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold tracking-wide text-xs mb-6 border border-brand-primary/20">
                        POR QUE MUDAR
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight mb-6">
                        Planilha dá trabalho. App de banco é limitado. <br className="hidden md:block" />
                        <span className="font-display italic text-brand-primary">O João resolve.</span>
                    </h2>
                </div>

                <div className="relative rounded-3xl overflow-hidden shadow-glass border border-slate-200 bg-white">

                    <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50">
                        <div className="col-span-2 p-6 md:p-8 flex items-end">
                            <span className="text-sm font-semibold text-slate-400 tracking-widest uppercase">Características</span>
                        </div>
                        <div className="col-span-1 p-6 md:p-8 border-l border-slate-200 text-center flex flex-col items-center justify-end">
                            <span className="text-lg font-medium text-slate-500 mb-2">Planilhas & Apps</span>
                        </div>
                        <div className="col-span-1 p-6 md:p-8 border-l border-brand-glassBorder bg-brand-darkBg text-center flex flex-col items-center justify-end relative shadow-[0_0_30px_rgba(6,78,59,0.5)]">
                            {/* Subtle Glass Top Highlight */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-lime"></div>
                            <div className="flex items-center justify-center h-20 py-2">
                                <img src="/Logos/Captura de Tela 2026-02-20 às 02.37.56.png" alt="João.ai" className="h-full w-auto object-contain" />
                            </div>
                        </div>
                    </div>

                    {[
                        { feature: "Entrada de dados", old: "Digitar linha por linha 😩", novo: "Manda um áudio e pronto", highlight: true },
                        { feature: "Categorização", old: "Manual", novo: "A IA faz por você", highlight: true },
                        { feature: "Tempo por semana", old: "2 a 3 horas", novo: "Menos de 5 minutos", highlight: true },
                        { feature: "Relatórios visuais", old: "Depende da sua habilidade", novo: "Prontos, bonitos e automáticos", highlight: false },
                        { feature: "Lembretes", old: "Nenhum", novo: "Direto no seu WhatsApp", highlight: false }
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="col-span-2 p-5 md:p-6 flex items-center">
                                <span className="text-sm md:text-base font-medium text-slate-700">{row.feature}</span>
                            </div>
                            <div className="col-span-1 p-5 md:p-6 border-l border-slate-100 flex items-center justify-center text-center">
                                {row.old === "Manual" || row.old === "Nenhum" ? (
                                    <X className="text-red-400 mx-auto" size={20} />
                                ) : (
                                    <span className="text-xs md:text-sm text-slate-500 font-light">{row.old}</span>
                                )}
                            </div>
                            <div className="col-span-1 p-5 md:p-6 border-l border-brand-primary/30 bg-brand-darkBg/5 flex items-center justify-center text-center relative group">
                                {/* Liquid Glass Highlight Row Hover */}
                                <div className="absolute inset-0 bg-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                {row.highlight ? (
                                    <span className="text-xs md:text-sm font-semibold text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-full">{row.novo}</span>
                                ) : (
                                    <div className="flex items-center gap-2 text-brand-primary">
                                        <Check size={18} className="text-brand-lime" />
                                        <span className="text-xs md:text-sm font-medium hidden md:block">{row.novo}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Table Footer Call to Action */}
                    <div className="grid grid-cols-4 bg-slate-50">
                        <div className="col-span-3"></div>
                        <div className="col-span-1 border-l border-brand-primary/30 bg-brand-darkBg flex items-center justify-center p-4">
                            <button className="text-sm font-bold text-brand-lime hover:text-white transition-colors">
                                Testar Grátis →
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ComparisonMatrix;
