import React, { useState } from 'react';
import { Home, List, CreditCard, PieChart, Plus, Settings, Layers, BarChart3, Landmark, Menu as MenuIcon, X, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TransactionModal from './TransactionModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Navigation Items Component - Desktop
  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 w-full text-left group ${isActive(path)
        ? 'bg-white/10 text-brand-lime font-semibold shadow-[0_0_20px_rgba(149,189,35,0.05)] border border-white/5'
        : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
    >
      <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 2} className={`transition-transform duration-300 ${!isActive(path) && 'group-hover:translate-x-1'}`} />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  // Mobile Bottom Nav Item
  const MobileNavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive(path) ? 'text-brand-deep' : 'text-slate-400'}`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${isActive(path) ? 'bg-brand-lime/10' : ''}`}>
        <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );

  // Mobile Drawer Menu Item
  const DrawerItem = ({ path, icon: Icon, label, desc }: { path: string, icon: any, label: string, desc: string }) => (
    <button
      onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
      className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm hover:border-brand-lime/30"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-deep" />
    </button>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-background text-slate-800">

      {/* Desktop Sidebar - Dark Anchor */}
      <aside className="hidden md:flex flex-col w-72 h-full p-6 bg-brand-deep z-20 shadow-2xl relative">
        {/* Subtle noise/gradient overlay for texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-12 px-2 pt-2 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
            {/* Logo Container */}
            <div className="w-11 h-11 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden group-hover:bg-white/10 transition-all shadow-lg">
              <img src="/logo.svg" alt="João.ai Logo" className="w-8 h-8 object-contain" />
            </div>
            {/* Status Dot */}
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-lime rounded-full border-2 border-brand-deep shadow-glow animate-pulse-slow"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">joão<span className="text-brand-lime">.ai</span></h1>
            <p className="text-[9px] text-slate-400 tracking-[0.2em] font-medium mt-1">FINANCE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 relative z-10">
          <NavItem path="/" icon={Home} label="Início" />
          <NavItem path="/analytics" icon={BarChart3} label="Análises" />
          <NavItem path="/transactions" icon={List} label="Extrato" />
          <NavItem path="/planning" icon={PieChart} label="Planejamento" />
          <NavItem path="/accounts" icon={Landmark} label="Contas" />
          <NavItem path="/cards" icon={CreditCard} label="Cartões" />
          <NavItem path="/categories" icon={Layers} label="Categorias" />
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2 relative z-10">
          <button
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-4 px-5 py-3.5 transition-colors w-full rounded-2xl hover:bg-white/5 ${isActive('/settings') ? 'text-brand-lime font-semibold bg-white/5' : 'text-slate-400 hover:text-white'}`}
          >
            <Settings size={22} strokeWidth={2} />
            <span className="text-sm tracking-wide">Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-brand-background">
        <div className="w-full max-w-[1600px] mx-auto min-h-full flex flex-col p-6 md:p-12 pb-48 md:pb-12">
          {children}
        </div>
      </main>

      {/* Desktop FAB */}
      <div className="hidden md:block fixed bottom-10 right-10 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-deep text-brand-lime pl-6 pr-8 py-4 rounded-full shadow-float hover:scale-105 hover:shadow-premium transition-all active:scale-95 flex items-center gap-3 group border border-white/10 backdrop-blur-md"
        >
          <div className="bg-brand-lime/20 p-1 rounded-full">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300 text-brand-lime" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base text-white tracking-wide">Nova Transação</span>
        </button>
      </div>

      {/* --- MOBILE NAVIGATION --- */}

      {/* Mobile Bottom Bar (Native Feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 pb-safe pt-2 z-40 px-2 shadow-lg">
        <div className="flex justify-between items-end h-16 relative">

          {/* Left Group */}
          <div className="flex-1 flex justify-evenly">
            <MobileNavItem path="/" icon={Home} label="Início" />
            <MobileNavItem path="/transactions" icon={List} label="Extrato" />
          </div>

          {/* Center Space for Floating FAB */}
          <div className="w-20 h-full relative flex justify-center z-50">
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute -top-6 bg-brand-deep text-brand-lime w-14 h-14 rounded-full shadow-float flex items-center justify-center transform transition-transform active:scale-95 hover:shadow-premium border-4 border-[#F7F9F8]"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
            <span className="text-[10px] font-medium tracking-wide text-slate-400 absolute bottom-1">Novo</span>
          </div>

          {/* Right Group */}
          <div className="flex-1 flex justify-evenly">
            <MobileNavItem path="/analytics" icon={BarChart3} label="Análises" />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 w-16 ${isMobileMenuOpen ? 'text-brand-deep' : 'text-slate-400'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isMobileMenuOpen ? 'bg-brand-lime/10' : ''}`}>
                <MenuIcon size={24} strokeWidth={isMobileMenuOpen ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">Menu</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Full Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>

          <div className="bg-[#F7F9F8] rounded-t-[2rem] p-6 pb-safe pt-2 animate-slide-up relative z-10 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 mt-2"></div>

            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl font-bold text-slate-800">Menu Completo</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 pb-8">
              <DrawerItem path="/planning" icon={PieChart} label="Planejamento" desc="Metas e orçamentos mensais" />
              <DrawerItem path="/accounts" icon={Landmark} label="Contas & Bancos" desc="Saldo e liquidez" />
              <DrawerItem path="/cards" icon={CreditCard} label="Cartões de Crédito" desc="Faturas e limites" />
              <DrawerItem path="/categories" icon={Layers} label="Categorias" desc="Organize seus gastos" />
              <div className="h-4"></div>
              <DrawerItem path="/settings" icon={Settings} label="Configurações" desc="Perfil, segurança e app" />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Layout;