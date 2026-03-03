import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const childVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="relative w-full min-h-[100svh] bg-brand-darkBg text-white flex flex-col items-center justify-center overflow-hidden pt-20">

            {/* BOLD FRONTEND DESIGN: Massive background logo spinning slowly */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 0.03, scale: 1, rotate: 0 }}
                transition={{ duration: 3, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] md:w-[1200px] pointer-events-none z-0 mix-blend-screen"
            >
                <img src="/Logos/logo-icon-only.png" alt="" className="w-full h-full object-contain animate-[spin_120s_linear_infinite]" />
            </motion.div>

            {/* Liquid Glass Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/40 rounded-full mix-blend-screen filter blur-[120px] animate-morph pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-brand-lime/10 rounded-full mix-blend-screen filter blur-[150px] animate-morph pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

            {/* Mesh Noise Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Pre-title brand tag */}
                <motion.div variants={childVariants} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-lime/20 bg-brand-lime/5 backdrop-blur-xl mb-8">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-lime"></span>
                    </span>
                    <span className="text-[11px] font-semibold text-brand-lime/80 tracking-[0.15em] uppercase">Assistente Financeiro Inteligente</span>
                </motion.div>

                <motion.h1
                    variants={childVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto text-white"
                    style={{ textShadow: '0 16px 32px rgba(0,0,0,0.4)' }}
                >
                    <span className="font-semibold text-brand-lime">João.ai</span>, o assistente{' '}
                    <br className="hidden sm:block" />
                    financeiro que mora no seu{' '}
                    <span className="font-display italic text-brand-lime font-medium relative">
                        WhatsApp.
                        <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-brand-lime/60 to-transparent"></span>
                    </span>
                </motion.h1>

                <motion.div variants={childVariants} className="flex flex-col items-center w-full max-w-xl mx-auto gap-10">
                    <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed">
                        Gastou? Mande um áudio, foto ou PDF.<br className="hidden sm:block" />
                        O João registra, categoriza e organiza tudo pra você. <span className="text-slate-300 font-normal">Simples assim.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-5 w-full">
                        <button
                            onClick={() => navigate('/signup')}
                            className="group flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-lime/90 hover:bg-brand-lime text-brand-darkBg rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_30px_rgba(140,184,42,0.25)] hover:shadow-[0_0_40px_rgba(140,184,42,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Começar Gratuitamente
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-0.5 transition-transform">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            onClick={() => {
                                document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="text-sm font-medium text-slate-500 hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-slate-700 hover:after:bg-slate-500 after:transition-colors"
                        >
                            Ver Como Funciona
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Fade out to the next section */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-darkBg to-transparent z-20 pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
