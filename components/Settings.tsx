import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, HelpCircle, ChevronLeft, Save, Check, Lock, Mail, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react';
import { useFinance } from '../services/FinanceContext';

type SettingsView = 'MENU' | 'PROFILE' | 'NOTIFICATIONS' | 'SECURITY' | 'HELP';

const Settings: React.FC = () => {
  const { userSettings, updateUserSettings } = useFinance();
  const [currentView, setCurrentView] = useState<SettingsView>('MENU');

  // Local state for forms
  const [profileForm, setProfileForm] = useState({ name: userSettings.name, email: userSettings.email });
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '' });

  const handleSaveProfile = () => {
    updateUserSettings(profileForm);
    setCurrentView('MENU');
  };

  const handleSaveSecurity = () => {
    // Mock save
    setCurrentView('MENU');
  };

  // --- Sub-Components for Views ---

  const MenuCard = ({ icon: Icon, title, desc, onClick }: any) => (
    <div onClick={onClick} className="card-base p-6 hover:shadow-float transition-all cursor-pointer group flex flex-col items-start h-full">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-lime group-hover:text-white transition-colors mb-4">
            <Icon size={24} />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );

  const Header = ({ title }: { title: string }) => (
      <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setCurrentView('MENU')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
  );

  // --- VIEWS ---

  if (currentView === 'PROFILE') {
      return (
          <div className="max-w-2xl mx-auto pb-20 animate-fade-in">
              <Header title="Meu Perfil" />
              <div className="card-base p-8 space-y-6">
                  <div className="flex flex-col items-center mb-6">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3 border-4 border-white shadow-lg">
                          <User size={40} />
                      </div>
                      <button className="text-xs font-bold text-brand-deep hover:underline">Alterar Foto</button>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Nome de Exibição</label>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">E-mail</label>
                      <input 
                        type="email" 
                        value={profileForm.email} 
                        onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                      />
                  </div>

                  <button onClick={handleSaveProfile} className="w-full py-4 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 transition-all flex items-center justify-center gap-2 mt-4">
                      <Save size={18} /> Salvar Alterações
                  </button>
              </div>
          </div>
      );
  }

  if (currentView === 'NOTIFICATIONS') {
      return (
        <div className="max-w-2xl mx-auto pb-20 animate-fade-in">
            <Header title="Notificações" />
            <div className="card-base divide-y divide-slate-50">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-800">Notificações Gerais</h4>
                        <p className="text-xs text-slate-500 mt-1">Ativar ou desativar todos os alertas.</p>
                    </div>
                    <button onClick={() => updateUserSettings({ enableNotifications: !userSettings.enableNotifications })} className={`text-brand-deep transition-all ${userSettings.enableNotifications ? 'text-brand-lime' : 'text-slate-300'}`}>
                        {userSettings.enableNotifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                    </button>
                </div>

                <div className={`transition-opacity duration-300 ${!userSettings.enableNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-800">Alertas de Vencimento</h4>
                            <p className="text-xs text-slate-500 mt-1">Avisar quando uma conta estiver vencendo.</p>
                        </div>
                        <button onClick={() => updateUserSettings({ notifyBillDue: !userSettings.notifyBillDue })} className={`text-brand-deep transition-all ${userSettings.notifyBillDue ? 'text-brand-lime' : 'text-slate-300'}`}>
                            {userSettings.notifyBillDue ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-800">Alertas de Limite</h4>
                            <p className="text-xs text-slate-500 mt-1">Avisar ao atingir 80% do limite do cartão.</p>
                        </div>
                        <button onClick={() => updateUserSettings({ notifyLimitAlert: !userSettings.notifyLimitAlert })} className={`text-brand-deep transition-all ${userSettings.notifyLimitAlert ? 'text-brand-lime' : 'text-slate-300'}`}>
                            {userSettings.notifyLimitAlert ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-800">Contas em Atraso</h4>
                            <p className="text-xs text-slate-500 mt-1">Alerta crítico para contas vencidas.</p>
                        </div>
                        <button onClick={() => updateUserSettings({ notifyOverdue: !userSettings.notifyOverdue })} className={`text-brand-deep transition-all ${userSettings.notifyOverdue ? 'text-brand-lime' : 'text-slate-300'}`}>
                            {userSettings.notifyOverdue ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (currentView === 'SECURITY') {
      return (
        <div className="max-w-2xl mx-auto pb-20 animate-fade-in">
            <Header title="Segurança" />
            <div className="card-base p-8 space-y-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Senha Atual</label>
                    <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50" />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Confirmar Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50" />
                </div>
                 
                 <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-700">Biometria / FaceID</h4>
                        <p className="text-xs text-slate-400">Usar biometria para entrar no app.</p>
                    </div>
                    <ToggleRight size={40} className="text-slate-300 cursor-not-allowed" />
                 </div>

                <button onClick={handleSaveSecurity} className="w-full py-4 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 transition-all flex items-center justify-center gap-2 mt-4">
                      <Lock size={18} /> Atualizar Senha
                </button>
            </div>
        </div>
      );
  }

  if (currentView === 'HELP') {
      return (
        <div className="max-w-2xl mx-auto pb-20 animate-fade-in">
             <Header title="Central de Ajuda" />
             <div className="space-y-4">
                 <div className="card-base p-6">
                     <h3 className="font-bold text-slate-800 mb-2">Como cadastrar um cartão?</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">Vá até o menu "Cartões", clique no botão "Novo Cartão" no topo da tela e preencha os dados de limite e datas.</p>
                 </div>
                 <div className="card-base p-6">
                     <h3 className="font-bold text-slate-800 mb-2">Como funcionam as categorias?</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">Categorias ajudam a agrupar seus gastos. Você pode criar novas categorias e subcategorias no menu "Categorias".</p>
                 </div>
                 <div className="card-base p-6">
                     <h3 className="font-bold text-slate-800 mb-2">O app é seguro?</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">Sim! O FinZen funciona no modelo "Local First". Seus dados ficam salvos no seu navegador e não são enviados para servidores externos.</p>
                 </div>
                 
                 <div className="mt-8 text-center">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Precisa de mais ajuda?</p>
                     <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-brand-deep font-bold text-sm hover:bg-slate-50 transition-colors">
                         Falar com Suporte
                     </button>
                 </div>
             </div>
        </div>
      )
  }

  // --- MAIN MENU VIEW ---
  return (
    <div className="w-full space-y-8 pb-20 text-slate-800">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-brand-deep flex items-center gap-3">
           <SettingsIcon size={32} className="text-brand-lime" />
           Configurações
        </h1>
        <p className="text-lg text-slate-500 font-medium">Preferências gerais do aplicativo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
         <MenuCard 
            icon={User} 
            title="Perfil" 
            desc="Gerenciar dados pessoais e conta." 
            onClick={() => setCurrentView('PROFILE')} 
         />
         <MenuCard 
            icon={Bell} 
            title="Notificações" 
            desc="Alertas de faturas e limites." 
            onClick={() => setCurrentView('NOTIFICATIONS')} 
         />
         <MenuCard 
            icon={Shield} 
            title="Segurança" 
            desc="Biometria e senha de acesso." 
            onClick={() => setCurrentView('SECURITY')} 
         />
         <MenuCard 
            icon={HelpCircle} 
            title="Ajuda" 
            desc="Suporte e perguntas frequentes." 
            onClick={() => setCurrentView('HELP')} 
         />
      </div>
      
      <div className="p-6 rounded-2xl bg-brand-lime/10 border border-brand-lime/20 flex items-start gap-4 mt-4">
          <div className="p-2 bg-white rounded-full text-brand-deep shrink-0">
             <SettingsIcon size={20} />
          </div>
          <div>
             <h4 className="font-bold text-brand-deep text-sm mb-1">Versão 2.0.0 (Premium)</h4>
             <p className="text-xs text-brand-deep/70">Seu aplicativo está atualizado com as últimas funcionalidades de segurança e design.</p>
          </div>
      </div>
    </div>
  );
};

export default Settings;