import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, MessageSquare } from 'lucide-react';

export const FooterCommercial: React.FC = () => {
  const navigate = useNavigate();

  const WA_LINK =
    'https://wa.me/5516981737906?text=Ol%C3%A1%20Jo%C3%A3o!%20Vim%20pelo%20site%20e%20quero%20tirar%20uma%20d%C3%BAvida';

  return (
    <footer className="bg-[#020B07] text-white pt-16 pb-24 md:pb-16 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Selos de Segurança e Confiança */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 mb-12 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
            <Lock className="w-5 h-5 text-brand-lime shrink-0" />
            <div>
              <p className="font-bold text-white">Criptografia Ponta a Ponta</p>
              <p className="text-slate-400 text-[11px]">Seus áudios e mensagens trafegam 100% protegidos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
            <ShieldCheck className="w-5 h-5 text-brand-lime shrink-0" />
            <div>
              <p className="font-bold text-white">Conformidade com a LGPD</p>
              <p className="text-slate-400 text-[11px]">Seus dados financeiros pertencem apenas a você.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-brand-lime shrink-0" />
            <div>
              <p className="font-bold text-white">Zero Acesso Bancário</p>
              <p className="text-slate-400 text-[11px]">Nunca solicitamos senhas de cartão ou conta.</p>
            </div>
          </div>
        </div>

        {/* Links Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

          {/* Coluna Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-deep to-brand-primary border border-brand-lime/30 p-1 flex items-center justify-center">
                <img
                  src="/Logos/logo-icon-only.png"
                  alt="João.ai"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                João<span className="text-brand-lime">.ai</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O assistente financeiro que transforma a complexidade do dinheiro em um simples áudio no WhatsApp.
              Menos tempo com planilhas, mais vida para você.
            </p>

            <div className="pt-2">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-lime hover:underline"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Fale conosco no WhatsApp Oficial</span>
              </a>
            </div>
          </div>

          {/* Coluna Navegação */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-300">Navegação</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#como-funciona" className="hover:text-brand-lime transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-brand-lime transition-colors">
                  Simulador Interativo
                </a>
              </li>
              <li>
                <a href="#comparativo" className="hover:text-brand-lime transition-colors">
                  Comparativo com Planilhas
                </a>
              </li>
              <li>
                <a href="#economia" className="hover:text-brand-lime transition-colors">
                  Calculadora de Economia
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-brand-lime transition-colors">
                  Planos e Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-lime transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna Acesso & Painel */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-300">Clientes</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-brand-lime transition-colors text-left"
                >
                  Entrar no Painel Web
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/5516981737906?text=Quero%20ajuda%20com%20minha%20conta%20do%20Jo%C3%A3o.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-lime transition-colors"
                >
                  Suporte ao Assinante
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Direitos */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} João.ai. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span>Sistemas operacionais e prontos para atender</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterCommercial;
