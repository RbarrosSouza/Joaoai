import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = lazy(() => import('../components/landing/HeroSection'));
const WhatsAppDemo = lazy(() => import('../components/landing/WhatsAppDemo'));
const ProblemComparison = lazy(() => import('../components/landing/ProblemComparison'));
const HowItWorks = lazy(() => import('../components/landing/HowItWorks'));
const FeaturesGrid = lazy(() => import('../components/landing/FeaturesGrid'));
const UseCases = lazy(() => import('../components/landing/UseCases'));
const Pricing = lazy(() => import('../components/landing/Pricing'));
const FAQ = lazy(() => import('../components/landing/FAQ'));
const CallToAction = lazy(() => import('../components/landing/CallToAction'));

/* ── Hero fallback: shows instantly while real Hero loads ── */
const HeroFallback: React.FC = () => (
    <section className="relative w-full min-h-[100svh] bg-brand-darkBg text-white flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-lime/20 bg-brand-lime/5 mb-8">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-lime" />
                </span>
                <span className="text-[11px] font-semibold text-brand-lime/80 tracking-[0.15em] uppercase">Assistente Financeiro Inteligente</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto text-white" style={{ textShadow: '0 16px 32px rgba(0,0,0,0.4)' }}>
                <span className="font-semibold text-brand-lime">João.ai</span>, o assistente{' '}
                <br className="hidden sm:block" />
                financeiro que mora no seu{' '}
                <span className="font-display italic text-brand-lime font-medium">WhatsApp.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
                Gastou? Mande um áudio, foto ou PDF.<br className="hidden sm:block" />
                O João registra, categoriza e organiza tudo pra você. <span className="text-slate-300 font-normal">Simples assim.</span>
            </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-darkBg to-transparent z-20 pointer-events-none" />
    </section>
);

const LazySection: React.FC<{
    children: React.ReactNode;
    placeholderClassName?: string;
}> = ({ children, placeholderClassName = 'min-h-[260px]' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
            { rootMargin: '300px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const placeholder = (
        <div
            className={`w-full ${placeholderClassName} rounded-[2rem] bg-white/60 border border-slate-200/60`}
            aria-hidden="true"
        />
    );

    return (
        <div ref={ref}>
            {isInView ? (
                <Suspense fallback={placeholder}>
                    {children}
                </Suspense>
            ) : (
                placeholder
            )}
        </div>
    );
};

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-background text-slate-800 font-sans font-light selection:bg-brand-lime/30 scroll-smooth overflow-x-hidden">
            {/* NavBar */}
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 border-b animate-[slideDown_0.8s_cubic-bezier(0.16,1,0.3,1)] ${scrolled
                    ? 'bg-brand-darkBg/80 backdrop-blur-2xl border-white/10 shadow-glass py-2 lg:py-3'
                    : 'bg-transparent border-transparent py-6 lg:py-8'
                    }`}
                style={{ animationFillMode: 'both' }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <div className="relative group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className={`transition-all duration-500 overflow-hidden flex items-center ${scrolled ? 'h-10' : 'h-14'}`}>
                            <img src="/Logos/joao-logo-high-res.png" alt="João.ai Logo" className="h-[150%] max-w-[250%] w-auto object-contain select-none pointer-events-none" />
                        </div>
                    </div>

                    {/* Desktop buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-300 hover:text-white' : 'text-white hover:text-brand-lime drop-shadow-md'}`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => window.open('https://wa.me/5516981737906?text=Quero%20me%20cadastrar%20gratis%20e%20aproveitar%20o%20Jo%C3%A3o.ai', '_blank')}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-brand-darkBg bg-brand-lime/90 hover:bg-brand-lime shadow-[0_0_20px_rgba(140,184,42,0.2)] hover:shadow-[0_0_30px_rgba(140,184,42,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            Criar conta grátis
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] z-50"
                        aria-label="Menu"
                    >
                        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${mobileMenu ? 'rotate-45 translate-y-[7px] bg-white' : scrolled ? 'bg-white' : 'bg-white'}`}></span>
                        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${mobileMenu ? 'opacity-0 scale-0' : 'bg-white'}`}></span>
                        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${mobileMenu ? '-rotate-45 -translate-y-[7px] bg-white' : scrolled ? 'bg-white' : 'bg-white'}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenu(false)}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div
                        className="absolute top-20 left-4 right-4 bg-brand-darkBg/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 space-y-3 animate-[fadeSlideDown_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setMobileMenu(false); navigate('/login'); }}
                            className="w-full py-3 text-center text-sm font-medium text-white hover:text-brand-lime transition-colors rounded-xl hover:bg-white/5"
                        >
                            Entrar
                        </button>
                        <div className="h-px bg-white/10"></div>
                        <button
                            onClick={() => { setMobileMenu(false); window.open('https://wa.me/5516981737906?text=Quero%20me%20cadastrar%20gratis%20e%20aproveitar%20o%20Jo%C3%A3o.ai', '_blank'); }}
                            className="w-full py-3 text-center text-sm font-bold text-brand-darkBg bg-brand-lime/90 hover:bg-brand-lime rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(140,184,42,0.2)]"
                        >
                            Criar conta grátis
                        </button>
                    </div>
                </div>
            )}

            <main className="relative z-10">
                <Suspense fallback={<HeroFallback />}>
                    <HeroSection />
                </Suspense>
                <LazySection placeholderClassName="min-h-[600px] !bg-brand-darkBg !border-0">
                    <WhatsAppDemo />
                </LazySection>
                <LazySection placeholderClassName="min-h-[420px]">
                    <ProblemComparison />
                </LazySection>
                <LazySection placeholderClassName="min-h-[420px]">
                    <HowItWorks />
                </LazySection>
                <LazySection placeholderClassName="min-h-[520px]">
                    <FeaturesGrid />
                </LazySection>
                <LazySection placeholderClassName="min-h-[420px]">
                    <UseCases />
                </LazySection>
                <LazySection placeholderClassName="min-h-[620px]">
                    <Pricing />
                </LazySection>
                <LazySection placeholderClassName="min-h-[480px]">
                    <FAQ />
                </LazySection>
                <LazySection placeholderClassName="min-h-[360px]">
                    <CallToAction />
                </LazySection>
            </main>

            {/* Liquid Glass Footer */}
            <footer className="bg-brand-darkBg text-white py-24 border-t border-white/5 relative overflow-hidden">
                {/* Glassmorphism accents */}
                <div className="absolute top-[-50px] right-[10%] w-[300px] h-[300px] bg-brand-primary/20 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[-100px] left-[5%] w-[400px] h-[400px] bg-brand-secondary/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 relative z-10">

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="h-20 flex items-center justify-center overflow-hidden transition-all">
                                    <img src="/Logos/joao-logo-high-res.png" alt="João.ai Logo" className="h-full w-auto object-contain" />
                                </div>
                                <div className="absolute top-1 -right-2 w-4 h-4 bg-brand-lime rounded-full border-2 border-brand-darkBg shadow-glow animate-pulse-slow"></div>
                            </div>
                        </div>
                        <p className="text-sm font-light text-slate-300 max-w-sm leading-relaxed mt-2">
                            Seu concierge financeiro pessoal.<br />
                            Sua tranquilidade financeira em um áudio.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm text-slate-400 font-light w-full md:w-auto">
                        <div className="flex flex-col gap-3">
                            <span className="text-white font-medium mb-2">Produto</span>
                            <a href="#how-it-works" className="hover:text-brand-lime transition-colors">Como Funciona</a>
                            <a href="#features" className="hover:text-brand-lime transition-colors">Painel Web</a>
                            <a href="#pricing" className="hover:text-brand-lime transition-colors">Planos</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-white font-medium mb-2">Empresa</span>
                            <a href="#" className="hover:text-brand-lime transition-colors">Sobre Nós</a>
                            <a href="#" className="hover:text-brand-lime transition-colors">Imprensa</a>
                            <a href="#" className="hover:text-brand-lime transition-colors">Contato</a>
                        </div>
                        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                            <span className="text-white font-medium mb-2">Legal</span>
                            <a href="#" className="hover:text-brand-lime transition-colors">Termos de Uso</a>
                            <a href="#" className="hover:text-brand-lime transition-colors">Privacidade</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-brand-glassBorder flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 relative z-10">
                    <p>© {new Date().getFullYear()} João.ai. Todos os direitos reservados.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-lime shadow-glow animate-pulse"></span> Sistemas Operacionais</span>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
