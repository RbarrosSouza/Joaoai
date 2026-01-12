import React, { useState } from 'react';
import { useFinance } from '../services/FinanceContext';
import { Account, AccountType } from '../types';
import { Plus, Landmark, Wallet, PiggyBank, TrendingUp, Edit2, ArrowRight } from 'lucide-react';
import AccountFormModal from './AccountFormModal';

const Accounts: React.FC = () => {
  const { accounts, transactions, isPrivacyMode } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const privacyClass = isPrivacyMode ? 'blur-[7px] opacity-60 select-none' : '';

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const getAccountIcon = (type: AccountType) => {
      switch(type) {
          case AccountType.WALLET: return <Wallet size={20} />;
          case AccountType.SAVINGS: return <PiggyBank size={20} />;
          case AccountType.INVESTMENT: return <TrendingUp size={20} />;
          default: return <Landmark size={20} />;
      }
  };

  const getAccountLabel = (type: AccountType) => {
    switch(type) {
        case AccountType.WALLET: return 'Carteira Física';
        case AccountType.SAVINGS: return 'Poupança / Reserva';
        case AccountType.INVESTMENT: return 'Investimentos';
        default: return 'Conta Corrente';
    }
};

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="w-full space-y-8 text-slate-800 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">Minhas Contas</h1>
          <p className="text-base text-slate-500 font-medium">Gestão de saldo e liquidez.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="hidden md:flex items-center gap-3 bg-white text-brand-deep px-6 py-3 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 hover:border-brand-lime hover:text-brand-deep transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Nova Conta</span>
        </button>
      </div>
      
      {/* Total Balance Summary */}
      <div className="card-base p-8 bg-brand-deep text-white relative overflow-hidden animate-slide-up">
         <div className="absolute right-0 top-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                 <p className="text-brand-lime font-bold uppercase tracking-widest text-xs mb-2">Saldo Global (Líquido)</p>
                 <h2 className={`text-4xl md:text-5xl font-light tracking-tight transition-all duration-300 ${privacyClass}`}>
                     {formatCurrency(totalBalance)}
                 </h2>
             </div>
             <div className="text-right text-white/60 text-sm">
                 <p>Soma de todas as contas ativas.</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {accounts.map(account => {
          return (
            <div 
              key={account.id} 
              className="group cursor-pointer"
              onClick={() => handleEdit(account)}
            >
              {/* Account Card Visual - Fluid/Liquid Theme */}
              <div className={`w-full aspect-[1.586] rounded-[1.5rem] p-8 text-white shadow-2xl bg-gradient-to-br ${account.colorFrom} ${account.colorTo} flex flex-col justify-between relative overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02] ring-1 ring-black/5`}>
                
                {/* Fluid Background Effect */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60 blur-3xl scale-150 group-hover:scale-125 transition-transform duration-[2s]">
                        <path fill="#FFFFFF" d="M39.5,-65.3C50.2,-56.7,57.1,-43.3,64.3,-30.3C71.5,-17.3,79,-4.8,77.1,7C75.2,18.8,63.9,29.8,53.2,39.4C42.5,48.9,32.4,56.9,20.8,61.9C9.2,67,-3.9,69,-16.2,66.1C-28.5,63.3,-40,55.6,-49.6,46C-59.2,36.4,-67,24.9,-70.6,11.8C-74.2,-1.3,-73.6,-16,-66.6,-28.4C-59.6,-40.8,-46.2,-50.9,-33.3,-58.4C-20.4,-65.9,-8,-70.8,2.8,-75.6L13.6,-80.4" transform="translate(100 100)" />
                    </svg>
                </div>

                {/* Header */}
                <div className="flex justify-between items-start z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                      {getAccountIcon(account.type)}
                  </div>
                  <div className="flex gap-3">
                     <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">{getAccountLabel(account.type)}</span>
                     </div>
                  </div>
                </div>

                {/* Balance (Center Stage) */}
                <div className="z-10 mt-auto mb-4">
                  <p className="text-[10px] text-white/70 font-bold tracking-widest uppercase mb-1">Saldo Disponível</p>
                  <div className={`flex items-center gap-3 text-2xl md:text-3xl font-semibold tracking-tight text-white shadow-sm transition-all duration-300 ${privacyClass}`}>
                     {formatCurrency(account.balance)}
                  </div>
                </div>

                {/* Footer */}
                <div className="z-10 flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs font-bold tracking-wide uppercase flex items-center gap-2">
                        {account.name}
                        {account.bankName && <span className="opacity-60 font-normal">• {account.bankName}</span>}
                    </p>
                  </div>
                  <div className="bg-white/20 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={12} />
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {/* Add Account Button */}
        <button 
          onClick={handleCreate}
          className="w-full aspect-[1.586] border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 font-bold hover:border-brand-lime hover:text-brand-lime transition-all flex flex-col items-center justify-center gap-3 bg-white group"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-1 group-hover:bg-brand-lime group-hover:text-white transition-colors">
             <Plus size={24} />
          </div>
          <span className="text-sm font-medium">Adicionar Conta</span>
        </button>
      </div>

      {isModalOpen && <AccountFormModal onClose={() => setIsModalOpen(false)} editingAccount={editingAccount} />}
    </div>
  );
};

export default Accounts;