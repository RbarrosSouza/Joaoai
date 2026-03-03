import React, { Suspense, lazy, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const JoaoAiDemoVideo = lazy(() => import('./JoaoAiDemoVideo'));

const WhatsAppDemo: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: '200px 0px' });
    const shouldLoadDemo = isInView;

    return (
        <section
            ref={sectionRef}
            id="whatsapp-demo"
            className="relative py-16 md:py-28 lg:py-36 bg-brand-darkBg overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-lime/8 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

            {/* Noise overlay */}
            <div
                className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-24">
                    {/* ─── Left: Copy ─── */}
                    <motion.div
                        className="flex-1 text-center lg:text-left max-w-xl"
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-lime/20 bg-brand-lime/5 backdrop-blur-xl mb-8">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-lime" />
                            </span>
                            <span className="text-[11px] font-semibold text-brand-lime/80 tracking-[0.15em] uppercase">
                                Veja na prática
                            </span>
                        </span>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-light text-white tracking-tight leading-[1.15] mb-8">
                            É só mandar{' '}
                            <span className="font-display italic text-brand-lime font-medium">
                                uma mensagem.
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10">
                            Texto, áudio ou foto de nota fiscal.
                            <br className="hidden sm:block" />
                            O João entende, registra e categoriza
                            <br className="hidden sm:block" />
                            em <span className="text-brand-lime font-medium">segundos</span>.
                        </p>

                        <button
                            onClick={() => window.location.hash = '/signup'}
                            className="hidden lg:flex group items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-lime/90 hover:bg-brand-lime text-brand-darkBg rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_30px_rgba(140,184,42,0.25)] hover:shadow-[0_0_40px_rgba(140,184,42,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Começar Gratuitamente
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-0.5 transition-transform">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </motion.div>

                    {/* ─── Center: Chevrons ─── */}
                    <motion.div
                        className="hidden lg:flex items-center justify-center gap-3 flex-shrink-0 px-6 self-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="text-brand-lime text-4xl font-light select-none"
                                animate={{
                                    opacity: [0.15, 0.6, 0.15],
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: 'easeInOut',
                                }}
                            >
                                ›
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* ─── Right: Demo Video ─── */}
                    <motion.div
                        className="flex-shrink-0 w-full max-w-[400px]"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Suspense
                            fallback={(
                                <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0B2316] shadow-glass p-8 flex flex-col items-center justify-center gap-4 min-h-[520px]">
                                    <div className="w-12 h-12 rounded-full border-2 border-brand-lime/40 border-t-brand-lime animate-spin"></div>
                                    <div className="text-xs uppercase tracking-[0.2em] text-brand-lime/80 font-semibold">Carregando demo</div>
                                </div>
                            )}
                        >
                            {shouldLoadDemo ? (
                                <JoaoAiDemoVideo />
                            ) : (
                                <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0B2316] shadow-glass p-8 flex flex-col items-center justify-center gap-4 min-h-[520px]">
                                    <div className="w-16 h-16 rounded-full bg-brand-lime/10 flex items-center justify-center text-brand-lime text-lg font-semibold">▶</div>
                                    <div className="text-sm text-slate-200 font-medium">Demo pronta para tocar</div>
                                    <div className="text-xs text-slate-400">Role até aqui para iniciar a animação.</div>
                                </div>
                            )}
                        </Suspense>

                        {/* Mobile-only CTA below video */}
                        <button
                            onClick={() => window.location.hash = '/signup'}
                            className="flex lg:hidden group items-center justify-center gap-2.5 mx-auto mt-6 px-7 py-3.5 bg-brand-lime/90 hover:bg-brand-lime text-brand-darkBg rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_30px_rgba(140,184,42,0.25)] active:scale-[0.98]"
                        >
                            Começar Gratuitamente
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhatsAppDemo;
