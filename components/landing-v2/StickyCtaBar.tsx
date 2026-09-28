import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const StickyCtaBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Quero%20come%C3%A7ar%20meu%20teste%20gr%C3%A1tis%20de%207%20dias%20no%20WhatsApp';

  useEffect(() => {
    const handleScroll = () => {
      // Exibe a barra apenas após o usuário rolar 350px
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Ação rápida WhatsApp" className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-brand-darkBg/95 border-t border-brand-lime/20 backdrop-blur-lg md:hidden shadow-2xl animate-slide-up">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-deep border border-brand-lime/40 p-1 flex items-center justify-center shrink-0">
            <img
              src="/Logos/logo-icon-only.png"
              alt="João.ai"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">João.ai no WhatsApp</p>
            <p className="text-[10px] text-brand-lime font-medium">7 dias de teste grátis</p>
          </div>
        </div>

        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-full bg-brand-lime hover:bg-[#9cd02c] text-brand-darkBg text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(140,184,42,0.4)] active:scale-95 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-brand-darkBg" />
          <span>Testar Agora</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};

export default StickyCtaBar;
