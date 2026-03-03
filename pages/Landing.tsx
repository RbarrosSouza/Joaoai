import React, { useState, useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import ProblemComparison from '../components/landing/ProblemComparison';
import WhatsAppDemo from '../components/landing/WhatsAppDemo';
import HowItWorks from '../components/landing/HowItWorks';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import UseCases from '../components/landing/UseCases';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CallToAction from '../components/landing/CallToAction';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-background text-slate-800 font-sans font-light selection:bg-brand-lime/30 scroll-smooth overflow-x-hidden">
            {/* Liquid Glass NavBar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled
                    ? 'bg-brand-darkBg/80 backdrop-blur-2xl border-white/10 shadow-glass py-2 lg:py-3'
                    : 'bg-transparent border-transparent py-6 lg:py-8'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <div className="relative group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className={`transition-all duration-500 overflow-hidden flex items-center ${scrolled ? 'h-10' : 'h-14'}`}>
                            <img src="/Logos/joao-logo-high-res.png" alt="João.ai Logo" className="h-[150%] max-w-[250%] w-auto object-contain select-none pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {session ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`text-sm font-semibold transition-colors ${scrolled ? 'text-brand-lime hover:text-white' : 'text-brand-lime hover:text-white drop-shadow-md'}`}
                            >
                                Ir para o App
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-300 hover:text-white' : 'text-white hover:text-brand-lime drop-shadow-md'}`}
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-6 py-2.5 rounded-full text-sm font-bold text-brand-darkBg bg-brand-lime/90 hover:bg-brand-lime shadow-[0_0_20px_rgba(140,184,42,0.2)] hover:shadow-[0_0_30px_rgba(140,184,42,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    Criar conta grátis
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.nav>

            <main className="relative z-10">
                <HeroSection />
                <WhatsAppDemo />
                <ProblemComparison />
                <HowItWorks />
                <FeaturesGrid />
                <UseCases />
                <Pricing />
                <FAQ />
                <CallToAction />
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
                                    <img src="/Logos/Captura de Tela 2026-02-20 às 02.37.56.png" alt="João.ai Logo" className="h-full w-auto object-contain" />
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
