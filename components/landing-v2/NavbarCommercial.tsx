import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarCommercialProps {
  onOpenWhatsApp?: () => void;
}

export const NavbarCommercial: React.FC<NavbarCommercialProps> = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20come%C3%A7ar%20meu%20teste%20gr%C3%A1tis%20pelo%20WhatsApp';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Simulador', href: '#simulador' },
    { label: 'Comparativo', href: '#comparativo' },
    { label: 'Economia', href: '#economia' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-darkBg/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-deep to-brand-primary border border-brand-lime/30 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(140,184,42,0.2)] group-hover:scale-105 transition-transform duration-300">
              <img
                src="/Logos/logo-icon-only.png"
                alt="João.ai"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                João<span className="text-brand-lime">.ai</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse"></span>
                Finanças no WhatsApp
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs uppercase font-medium tracking-wider text-slate-300 hover:text-brand-lime transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Já sou cliente
            </button>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg font-bold text-sm shadow-[0_0_25px_rgba(140,184,42,0.35)] hover:shadow-[0_0_35px_rgba(140,184,42,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 fill-brand-darkBg" />
              <span>Testar Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-brand-lime text-brand-darkBg text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-brand-darkBg" />
              <span>Testar</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 border border-white/10"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="absolute top-20 left-4 right-4 bg-brand-darkBg border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-200 hover:text-brand-lime font-medium text-base py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-3 rounded-xl border border-white/15 text-slate-200 text-center font-medium hover:bg-white/5 transition-colors"
              >
                Acessar Painel Web
              </button>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-brand-lime text-brand-darkBg font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(140,184,42,0.3)]"
              >
                <MessageSquare className="w-4 h-4 fill-brand-darkBg" />
                <span>Testar Grátis no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarCommercial;
