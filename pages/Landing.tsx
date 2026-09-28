import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLockup from '../components/landing/BrandLockup';

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
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#012617] pt-24 text-white">
        <img src="/images/joao-hero-whatsapp-v3.png" alt="" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,38,23,.98),rgba(1,38,23,.78)_42%,rgba(1,38,23,.16)_75%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d1fb4b]">
                <span className="h-px w-8 bg-[#d1fb4b]" />
                Finanças · IA · conversa
            </div>
            <h1 className="max-w-[760px] font-display text-[clamp(3.25rem,7.2vw,7.2rem)] font-bold leading-[0.91] tracking-[-0.075em] text-white">
                Suas finanças,
                <span className="block text-[#d1fb4b]">em uma conversa.</span>
            </h1>
        </div>
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
                className={`fixed top-0 z-50 w-full animate-[slideDown_0.8s_cubic-bezier(0.16,1,0.3,1)] border-b transition-all duration-500 ${scrolled
                    ? 'border-white/10 bg-[#012617]/82 py-2.5 shadow-[0_14px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl lg:py-3'
                    : 'border-transparent bg-gradient-to-b from-black/45 to-transparent py-5 lg:py-6'
                    }`}
                style={{ animationFillMode: 'both' }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <button className="group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao início">
                        <BrandLockup compact={scrolled} />
                    </button>

                    {/* Desktop buttons */}
                    <div className="hidden items-center gap-6 md:flex">
                        <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-white/65 transition-colors hover:text-white">
                            Como funciona
                        </button>
                        <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-white/65 transition-colors hover:text-white">
                            Planos
                        </button>
                        <button
                            onClick={() => navigate('/comercial')}
                            className="text-sm font-medium text-white/65 transition-colors hover:text-white"
                        >
                            Para empresas
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-300 hover:text-white' : 'text-white hover:text-brand-lime drop-shadow-md'}`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => window.open('https://wa.me/5516981737906?text=Quero%20me%20cadastrar%20gratis%20e%20aproveitar%20o%20Jo%C3%A3o.ai', '_blank')}
                            className="rounded-full border border-[#d1fb4b]/35 bg-[#d1fb4b] px-5 py-2.5 text-sm font-bold text-[#012617] shadow-[0_10px_30px_rgba(209,251,75,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                        >
                            Manda pro João
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] z-50"
                        aria-label="Menu"
                        aria-expanded={mobileMenu}
                        aria-controls="mobile-navigation"
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
                        id="mobile-navigation"
                        className="absolute top-20 left-4 right-4 bg-brand-darkBg/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 space-y-3 animate-[fadeSlideDown_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setMobileMenu(false); navigate('/comercial'); }}
                            className="w-full rounded-xl py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/5 hover:text-brand-lime"
                        >
                            Para empresas
                        </button>
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
                            Manda pro João
                        </button>
                    </div>
                </div>
            )}

            <main className="relative z-10">
                <Suspense fallback={<HeroFallback />}>
                    <HeroSection />
                </Suspense>
                <section aria-label="Resumo do João.ai" className="relative z-20 -mt-px border-y border-white/10 bg-[#012617]">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 py-5 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-12">
                        <div className="px-4 py-3 sm:py-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d1fb4b]">Conversa simples</p>
                            <p className="mt-1 text-sm text-white/60">Texto, áudio ou foto</p>
                        </div>
                        <div className="px-4 py-3 sm:py-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d1fb4b]">Organização automática</p>
                            <p className="mt-1 text-sm text-white/60">Registros prontos em segundos</p>
                        </div>
                        <div className="px-4 py-3 sm:py-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d1fb4b]">Visão completa</p>
                            <p className="mt-1 text-sm text-white/60">Tudo reunido no seu painel</p>
                        </div>
                    </div>
                </section>
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
                        <BrandLockup />
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
