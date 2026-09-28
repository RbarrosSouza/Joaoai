import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarCommercial from '../components/landing-v2/NavbarCommercial';
import HeroCommercial from '../components/landing-v2/HeroCommercial';
import WhatsAppInteractiveSimulator from '../components/landing-v2/WhatsAppInteractiveSimulator';
import ProblemSolutionComparison from '../components/landing-v2/ProblemSolutionComparison';
import FeaturesBento from '../components/landing-v2/FeaturesBento';
import InteractiveRoiCalculator from '../components/landing-v2/InteractiveRoiCalculator';
import ComparisonTable from '../components/landing-v2/ComparisonTable';
import SocialProofTestimonials from '../components/landing-v2/SocialProofTestimonials';
import PricingCommercial from '../components/landing-v2/PricingCommercial';
import FaqCommercial from '../components/landing-v2/FaqCommercial';
import StickyCtaBar from '../components/landing-v2/StickyCtaBar';
import FooterCommercial from '../components/landing-v2/FooterCommercial';
import { Sparkles, ArrowRight } from 'lucide-react';

export const LandingCommercial: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rola para o topo na primeira renderização
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#03120B] text-slate-100 font-sans selection:bg-brand-lime/30 selection:text-white scroll-smooth">

      {/* Banner Superior de Demonstração / Comparação de Versões */}
      <div className="bg-brand-deep/90 border-b border-brand-lime/20 py-2 px-4 text-center text-xs text-slate-300 relative z-50 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-brand-lime font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Versão Alternativa Comercial (Alta Conversão & Alta Velocidade)
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <button
          onClick={() => navigate('/vendas')}
          className="hidden sm:inline-flex items-center gap-1 text-slate-400 hover:text-white underline text-[11px] transition-colors"
        >
          Ver versão clássica (/vendas)
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Barra de Navegação */}
      <NavbarCommercial />

      {/* Conteúdo Principal */}
      <main className="relative">
        <HeroCommercial />
        <WhatsAppInteractiveSimulator />
        <ProblemSolutionComparison />
        <FeaturesBento />
        <InteractiveRoiCalculator />
        <ComparisonTable />
        <SocialProofTestimonials />
        <PricingCommercial />
        <FaqCommercial />
      </main>

      {/* Rodapé Corporativo */}
      <FooterCommercial />

      {/* Barra de Conversão Mobile Flutuante */}
      <StickyCtaBar />
    </div>
  );
};

export default LandingCommercial;
