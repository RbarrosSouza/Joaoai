import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-0 px-0 bg-brand-background relative flex justify-center pb-32">
            <div className="w-full max-w-[96%] rounded-[4rem] bg-brand-darkBg text-white overflow-hidden shadow-[0_30px_60px_rgba(6,78,59,0.3)] relative border border-brand-glassBorder mx-auto">

                {/* Liquid Glass / Glowing effects */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 animate-morph"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-lime/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3 animate-morph" style={{ animationDelay: '2s' }}></div>

                {/* Subtle Noise Texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-10 px-6 py-32 md:py-48 flex flex-col items-center text-center">

                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-brand-glassBorder bg-brand-glass backdrop-blur-md mb-12 shadow-glass">
                        <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse-slow shadow-glow"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-white drop-shadow-sm">Comece Agora</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-light tracking-tight mb-8 leading-[1.05] max-w-5xl drop-shadow-md">
                        Chega de perder tempo <span className="font-display italic text-brand-lime pr-2 font-semibold">organizando gasto.</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mb-16 leading-relaxed">
                        Manda uma mensagem pro João e deixa a IA fazer o trabalho chato. Seus gráficos ficam prontos enquanto você vive.
                    </p>

                    <div className="flex flex-col items-center w-full">
                        <button
                            onClick={() => navigate('/signup')}
                            className="group relative px-16 py-6 bg-brand-lime text-brand-darkBg rounded-full text-xl font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(140,184,42,0.4)] w-full sm:w-auto"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide">
                                Criar minha conta grátis
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                        </button>
                        <p className="text-sm font-medium text-slate-300 mt-8 flex items-center justify-center gap-3 bg-brand-glass px-6 py-2 rounded-full backdrop-blur-sm border border-brand-glassBorder">
                            ✓ Sem cartão de crédito · Setup em 30 segundos
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CallToAction;
