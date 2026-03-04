import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Brain, CreditCard, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Animated counter hook ──────────────────────────────── */
function useCounter(end: number, duration = 2000, startWhen = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!startWhen) return;
        let start = 0;
        const step = end / (duration / 16);
        const id = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(id); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(id);
    }, [end, duration, startWhen]);
    return count;
}

const ComparisonMatrix: React.FC = () => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    const hours = useCounter(3, 1800, isInView);
    const minutes = useCounter(5, 1800, isInView);
    const accuracy = useCounter(98, 2200, isInView);
    const cards = useCounter(12, 1600, isInView);

    const stats = [
        {
            icon: <Clock size={20} className="text-red-400" />,
            value: `${hours}h → ${minutes}min`,
            label: 'Tempo por semana',
            sublabel: 'De 3 horas digitando para 5 minutos por áudio',
            glowColor: 'rgba(140,184,42,0.2)',
            valueColor: 'text-brand-lime',
            iconBg: 'bg-brand-lime/10 border-brand-lime/20',
            delay: 0,
        },
        {
            icon: <Brain size={20} className="text-brand-secondary" />,
            value: `${accuracy}%`,
            label: 'Precisão da IA',
            sublabel: 'Categoriza seus gastos automaticamente',
            glowColor: 'rgba(20,184,166,0.2)',
            valueColor: 'text-brand-secondary',
            iconBg: 'bg-brand-secondary/10 border-brand-secondary/20',
            delay: 0.08,
        },
        {
            icon: <CreditCard size={20} className="text-brand-lime" />,
            value: `${cards}+`,
            label: 'Cartões simultâneos',
            sublabel: 'Todos os seus cartões organizados em um só lugar',
            glowColor: 'rgba(140,184,42,0.2)',
            valueColor: 'text-brand-lime',
            iconBg: 'bg-brand-lime/10 border-brand-lime/20',
            delay: 0.16,
        },
        {
            icon: <TrendingDown size={20} className="text-amber-400" />,
            value: '0',
            label: 'Planilhas necessárias',
            sublabel: 'Relatórios prontos, bonitos e automáticos',
            glowColor: 'rgba(251,191,36,0.2)',
            valueColor: 'text-amber-400',
            iconBg: 'bg-amber-400/10 border-amber-400/20',
            delay: 0.24,
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="comparison"
            className="py-24 md:py-36 bg-brand-darkBg relative overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-brand-primary/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-brand-lime/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-brand-lime/10 text-brand-lime font-semibold tracking-wide text-xs mb-6 border border-brand-lime/20"
                    >
                        POR QUE MUDAR
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-4"
                    >
                        De horas para <span className="font-display italic text-brand-lime">minutos.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 font-light max-w-lg mx-auto"
                    >
                        Números reais de quem trocou a planilha pelo João.
                    </motion.p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: stat.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.08] transition-all duration-500 hover:border-white/20 overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundColor: stat.glowColor }}
                            />

                            <div className="relative z-10">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${stat.iconBg}`}>
                                    {stat.icon}
                                </div>
                                <div className={`text-4xl md:text-5xl font-display font-semibold mb-2 tracking-tight ${stat.valueColor}`}>
                                    {stat.value}
                                </div>
                                <div className="text-white font-medium text-sm mb-1">{stat.label}</div>
                                <div className="text-slate-400 font-light text-xs leading-relaxed">{stat.sublabel}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-12 flex justify-center"
                >
                    <button
                        onClick={() => window.open('https://wa.me/5516981737906?text=Quero%20me%20cadastrar%20gratis%20e%20aproveitar%20o%20Jo%C3%A3o.ai', '_blank')}
                        className="group flex items-center gap-2.5 px-7 py-3.5 bg-brand-lime/90 hover:bg-brand-lime text-brand-darkBg rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_30px_rgba(140,184,42,0.25)] hover:shadow-[0_0_40px_rgba(140,184,42,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Começar gratuitamente
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparisonMatrix;
