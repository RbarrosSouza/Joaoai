import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.35
            }
        }
    };

    const childVariants = {
        hidden: { y: 28, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="joao-hero relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#012617] pt-24 text-white">
                <div className="joao-hero-scene" aria-hidden="true">
                    <img
                        src="/images/joao-hero-whatsapp-v3.png"
                        alt=""
                        className="joao-hero-scene__media"
                        fetchPriority="high"
                        decoding="async"
                    />
                </div>

                <div className="joao-hero__wash pointer-events-none absolute inset-0 z-[1]" />
                <div className="joao-hero__grain pointer-events-none absolute inset-0 z-[2]" />

                <motion.div
                    className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 pb-16 pt-8 text-left lg:px-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                <motion.div variants={childVariants} className="mb-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d1fb4b] sm:text-[11px]">
                    <span className="h-px w-8 bg-[#d1fb4b]" />
                    Finanças · IA · conversa
                </motion.div>

                <motion.h1
                    variants={childVariants}
                    className="max-w-[760px] text-[clamp(3.25rem,7.2vw,7.2rem)] font-display font-bold leading-[0.91] tracking-[-0.075em] text-white"
                    style={{ textShadow: '0 18px 48px rgba(0,0,0,0.42)' }}
                >
                    Suas finanças,
                    <span className="block text-[#d1fb4b]">em uma conversa.</span>
                </motion.h1>

                <motion.div variants={childVariants} className="mt-8 flex w-full max-w-xl flex-col items-start gap-8">
                    <p className="max-w-lg text-base font-normal leading-relaxed text-white/68 md:text-lg">
                        Mande uma mensagem, um áudio ou uma foto. O João registra,
                        organiza e mostra o que merece sua atenção — enquanto a vida continua.
                    </p>

                    <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <button
                            onClick={() => window.open('https://wa.me/5516981737906?text=Quero%20me%20cadastrar%20gratis%20e%20aproveitar%20o%20Jo%C3%A3o.ai', '_blank')}
                            className="group flex items-center justify-center gap-3 rounded-full bg-[#d1fb4b] px-7 py-4 text-sm font-bold text-[#012617] shadow-[0_18px_55px_rgba(209,251,75,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(209,251,75,0.28)] active:translate-y-0"
                        >
                            Mandar minha primeira mensagem
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-0.5 transition-transform">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <p className="-mt-1 text-xs text-white/48 sm:absolute sm:mt-[4.75rem]">
                            Abre uma conversa no WhatsApp · sem instalar aplicativo
                        </p>

                        <button
                            onClick={() => {
                                document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="group flex items-center gap-3 px-2 py-3 text-sm font-semibold text-white/68 transition-colors hover:text-white"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md transition-all group-hover:border-[#d1fb4b]/60 group-hover:bg-[#d1fb4b]/10">
                                <span className="ml-0.5 block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
                            </span>
                            Ver como funciona
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/12 pt-5 text-[10px] font-semibold uppercase tracking-[0.19em] text-white/48 sm:text-[11px]">
                        <span>WhatsApp</span>
                        <span className="h-1 w-1 rounded-full bg-[#92ef4e]" />
                        <span>Sem planilhas</span>
                        <span className="h-1 w-1 rounded-full bg-[#92ef4e]" />
                        <span>Organização automática</span>
                    </div>
                </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-40 w-full bg-gradient-to-t from-brand-darkBg via-brand-darkBg/55 to-transparent" />
                <div className="absolute bottom-8 right-6 z-20 hidden items-center gap-4 md:flex lg:right-12">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/42">Descubra o João</span>
                    <span className="relative block h-10 w-px overflow-hidden bg-white/15">
                        <span className="joao-scroll-line absolute left-0 top-0 h-4 w-px bg-[#d1fb4b]" />
                    </span>
                </div>
        </section>
    );
};

export default HeroSection;
