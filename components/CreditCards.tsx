import React, { useState } from 'react';
import { useFinance } from '../services/FinanceContext';
import { CreditCard } from '../types';
import { Calendar, AlertCircle, Plus, Wifi, Edit2 } from 'lucide-react';
import CardFormModal from './CardFormModal';

const CreditCards: React.FC = () => {
  const { cards } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-8 text-slate-800 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">Meus Cartões</h1>
          <p className="text-base text-slate-500 font-medium">Gestão de limites e faturas.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="hidden md:flex items-center gap-3 bg-white text-brand-deep px-6 py-3 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 hover:border-brand-lime hover:text-brand-deep transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Novo Cartão</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-up">
        {cards.map(card => {
          const percentUsed = (card.currentBill / card.limit) * 100;
          
          return (
            <div 
              key={card.id} 
              className="flex flex-col gap-6 cursor-pointer group"
              onClick={() => handleEdit(card)}
            >
              {/* Card Visual Premium - Realistic */}
              <div className={`w-full aspect-[1.586] rounded-[1.5rem] p-8 text-white shadow-2xl bg-gradient-to-br ${card.colorFrom} ${card.colorTo} flex flex-col justify-between relative overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02] ring-1 ring-black/5`}>
                
                {/* Texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/10 to-transparent transform rotate-12 blur-3xl"></div>

                <div className="flex justify-between items-start z-10">
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-100 to-yellow-400 shadow-sm relative overflow-hidden opacity-90">
                     <div className="absolute inset-0 border-[0.5px] border-black/10 rounded-md"></div>
                  </div>
                  <div className="flex gap-3">
                     <Wifi size={20} className="opacity-60 rotate-90" />
                     {/* Edit Icon hint on hover */}
                     <div className="bg-white/20 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={12} />
                     </div>
                  </div>
                </div>

                <div className="z-10 mt-auto mb-6">
                  <div className="flex items-center gap-3 text-lg md:text-xl font-mono tracking-widest text-white/90 shadow-sm">
                     <span>••••</span><span>••••</span><span>••••</span><span>4582</span>
                  </div>
                </div>

                <div className="z-10 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-white/70 font-bold tracking-widest uppercase mb-1">Titular</p>
                    <p className="text-xs font-bold tracking-wide uppercase">{card.name}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] text-white/70 font-bold mb-0.5">VALID</span>
                     <span className="text-xs font-mono font-bold mb-1">12/28</span>
                     <div className="flex -space-x-1.5 mt-1 opacity-90">
                       <div className="w-5 h-5 rounded-full bg-white/80 mix-blend-screen"></div>
                       <div className="w-5 h-5 rounded-full bg-white/50 mix-blend-screen"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Card Stats / Details Panel (CLEAN) */}
              <div className="card-base p-6 flex flex-col gap-6 border-t-0 hover:border-brand-lime/30 transition-colors">
                
                {/* Bill Amount */}
                <div className="flex justify-between items-end border-b border-slate-50 pb-5">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fatura Atual</p>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatCurrency(card.currentBill)}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disponível</p>
                         <p className="text-sm font-bold text-brand-green">{formatCurrency(card.limit - card.currentBill)}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Uso do Limite</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{Math.round(percentUsed)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${percentUsed > 80 ? 'bg-red-400' : 'bg-brand-lime'}`} 
                        style={{ width: `${percentUsed}%` }}
                    ></div>
                    </div>
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Fechamento</span>
                    </div>
                    <p className="font-bold text-slate-700 text-sm">Dia {card.closingDay}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                      <AlertCircle size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Vencimento</span>
                    </div>
                    <p className="font-bold text-red-500 text-sm">Dia {card.dueDay}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Card Button Mobile/Grid */}
        <button 
          onClick={handleCreate}
          className="w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-brand-lime hover:text-brand-lime transition-all flex flex-col items-center justify-center gap-3 bg-white min-h-[250px] group"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-1 group-hover:bg-brand-lime group-hover:text-white transition-colors">
             <Plus size={24} />
          </div>
          <span className="text-sm font-medium">Adicionar Cartão</span>
        </button>
      </div>

      {isModalOpen && <CardFormModal onClose={() => setIsModalOpen(false)} editingCard={editingCard} />}
    </div>
  );
};

export default CreditCards;