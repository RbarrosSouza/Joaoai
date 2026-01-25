import React, { useState, useEffect } from 'react';
import { X, Check, Landmark, Wallet, PiggyBank, TrendingUp, Building2 } from 'lucide-react';
import { useFinance } from '../services/FinanceContext';
import { Account, AccountType } from '../types';
import { BANK_PRESETS } from '../constants';
import { uuidv4 } from '../utils/uuid';

interface AccountFormModalProps {
  onClose: () => void;
  editingAccount?: Account | null;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({ onClose, editingAccount }) => {
  const { addAccount, updateAccount } = useFinance();
  
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('Nubank');
  const [type, setType] = useState<AccountType>(AccountType.CHECKING);
  const [balance, setBalance] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(BANK_PRESETS[0]);

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setBankName(editingAccount.bankName || '');
      setType(editingAccount.type);
      setBalance(editingAccount.balance.toString());
      
      const foundPreset = BANK_PRESETS.find(p => p.colorFrom === editingAccount.colorFrom);
      if (foundPreset) {
          setSelectedPreset(foundPreset);
      } else {
          // Custom or fallback
          setSelectedPreset({ 
              name: 'Custom', 
              colorFrom: editingAccount.colorFrom, 
              colorTo: editingAccount.colorTo 
          });
      }
    }
  }, [editingAccount]);

  const handlePresetChange = (preset: typeof BANK_PRESETS[0]) => {
      setSelectedPreset(preset);
      setBankName(preset.name); // Auto-fill bank name
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const accountData = {
      name,
      bankName,
      type,
      balance: parseFloat(balance) || 0,
      icon: type === AccountType.WALLET ? 'wallet' : 'landmark',
      colorFrom: selectedPreset.colorFrom,
      colorTo: selectedPreset.colorTo
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
    } else {
      addAccount({ ...accountData, id: uuidv4() } as Account);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
             <h2 className="text-xl font-bold text-slate-800">{editingAccount ? 'Editar Conta' : 'Nova Conta'}</h2>
             <p className="text-xs text-slate-400 font-medium mt-0.5">Onde seu dinheiro está guardado.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          
          {/* Card Preview (The "Fluid" Bank Card) */}
          <div className={`w-full aspect-[1.586] rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${selectedPreset.colorFrom} ${selectedPreset.colorTo} relative overflow-hidden transition-all duration-500`}>
             {/* Fluid/Liquid Effect */}
             <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50 blur-3xl scale-150 animate-pulse-slow">
                  <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.3C59,43.1,47.1,51.8,34.8,59.3C22.5,66.8,9.8,73.1,-4.2,80.4C-18.2,87.7,-33.5,96,-47.3,92.5C-61.1,89,-73.4,73.7,-81.4,57.1C-89.4,40.5,-93.1,22.6,-90.4,6.2C-87.7,-10.2,-78.6,-25.1,-68.2,-37.9C-57.8,-50.7,-46.1,-61.4,-33.3,-69.2C-20.5,-77,-6.6,-81.9,4.4,-89.5L15.4,-97.1" transform="translate(100 100)" />
                </svg>
             </div>
             
             <div className="flex justify-between items-start z-10 relative">
               <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/10">
                   <Landmark size={20} className="text-white" />
               </div>
               <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <span className="text-[10px] font-bold uppercase tracking-wider">{type === AccountType.WALLET ? 'Carteira' : type === AccountType.SAVINGS ? 'Poupança' : 'Corrente'}</span>
               </div>
             </div>

             <div className="absolute bottom-6 left-6 z-10">
               <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Nome da Conta</p>
               <p className="font-bold text-lg tracking-wide truncate pr-4">{name || 'Minha Conta'}</p>
             </div>
             
             <div className="absolute bottom-6 right-6 z-10 text-right">
                <p className="font-bold text-sm opacity-90">{bankName || 'Banco'}</p>
             </div>
          </div>

          {/* Bank Preset Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">Instituição</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
              {BANK_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetChange(preset)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border transition-all whitespace-nowrap ${selectedPreset.name === preset.name ? 'border-brand-lime bg-brand-lime/10 text-brand-deep font-bold' : 'border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${preset.colorFrom} ${preset.colorTo}`}></div>
                  <span className="text-xs">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Nome da Conta</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ex: Conta Principal, Reserva..."
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                />
             </div>
             
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Tipo</label>
                <div className="relative">
                   <select 
                    value={type} 
                    onChange={e => setType(e.target.value as AccountType)}
                    className="w-full bg-slate-50 p-3 rounded-xl font-medium text-slate-700 focus:outline-none appearance-none"
                   >
                     <option value={AccountType.CHECKING}>Corrente</option>
                     <option value={AccountType.SAVINGS}>Poupança</option>
                     <option value={AccountType.WALLET}>Carteira (Dinheiro)</option>
                     <option value={AccountType.INVESTMENT}>Investimento</option>
                   </select>
                </div>
             </div>

             <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Saldo Inicial</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    value={balance} 
                    onChange={e => setBalance(e.target.value)} 
                    placeholder="0,00"
                    disabled={!!editingAccount} // Disable editing balance directly to encourage transactions? Or allow correction? Let's allow for now but typically apps use "Adjustment" transactions.
                    className="w-full bg-slate-50 p-3 pl-9 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                  />
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={!name}
              className="px-8 py-3 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check size={18} strokeWidth={3} />
              {editingAccount ? 'Salvar Alterações' : 'Criar Conta'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AccountFormModal;
