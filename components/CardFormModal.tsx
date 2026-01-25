import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, Calendar, ShieldCheck, Wifi } from 'lucide-react';
import { useFinance } from '../services/FinanceContext';
import { CreditCard as CreditCardType } from '../types';
import { uuidv4 } from '../utils/uuid';

interface CardFormModalProps {
  onClose: () => void;
  editingCard?: CreditCardType | null;
}

const CARD_SKINS = [
  { from: 'from-violet-500', to: 'to-fuchsia-500', name: 'Roxo' },
  { from: 'from-slate-700', to: 'to-slate-900', name: 'Black' },
  { from: 'from-emerald-500', to: 'to-teal-700', name: 'Esmeralda' },
  { from: 'from-blue-600', to: 'to-cyan-500', name: 'Ocean' },
  { from: 'from-orange-500', to: 'to-red-500', name: 'Sunset' },
  { from: 'from-slate-300', to: 'to-slate-400', name: 'Platinum' },
];

const CardFormModal: React.FC<CardFormModalProps> = ({ onClose, editingCard }) => {
  const { addCard, updateCard } = useFinance();
  
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Mastercard');
  const [limit, setLimit] = useState('');
  const [closingDay, setClosingDay] = useState(1);
  const [dueDay, setDueDay] = useState(10);
  const [selectedSkin, setSelectedSkin] = useState(CARD_SKINS[0]);

  useEffect(() => {
    if (editingCard) {
      setName(editingCard.name);
      setBrand(editingCard.brand);
      setLimit(editingCard.limit.toString());
      setClosingDay(editingCard.closingDay);
      setDueDay(editingCard.dueDay);
      const foundSkin = CARD_SKINS.find(s => s.from === editingCard.colorFrom);
      if (foundSkin) setSelectedSkin(foundSkin);
    }
  }, [editingCard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !limit) return;

    const cardData = {
      name,
      brand,
      limit: parseFloat(limit),
      closingDay,
      dueDay,
      colorFrom: selectedSkin.from,
      colorTo: selectedSkin.to,
      currentBill: editingCard ? editingCard.currentBill : 0
    };

    if (editingCard) {
      updateCard(editingCard.id, cardData);
    } else {
      addCard({ ...cardData, id: uuidv4() } as CreditCardType);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
             <h2 className="text-xl font-bold text-slate-800">{editingCard ? 'Editar Cartão' : 'Novo Cartão'}</h2>
             <p className="text-xs text-slate-400 font-medium mt-0.5">Defina limites e datas importantes.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          
          {/* Card Preview */}
          <div className={`w-full aspect-[1.586] rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${selectedSkin.from} ${selectedSkin.to} relative overflow-hidden transition-all duration-500`}>
             <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
             <div className="flex justify-between items-start z-10 relative">
               <div className="w-10 h-7 rounded bg-white/20 backdrop-blur-sm border border-white/10"></div>
               <Wifi size={18} className="rotate-90 opacity-70" />
             </div>
             <div className="absolute bottom-6 left-6 z-10">
               <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Titular</p>
               <p className="font-bold tracking-widest uppercase">{name || 'SEU NOME'}</p>
             </div>
             <div className="absolute bottom-6 right-6 z-10 text-right">
               <p className="font-bold text-sm">{brand}</p>
             </div>
          </div>

          {/* Visual Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">Visual</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {CARD_SKINS.map((skin, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSkin(skin)}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${skin.from} ${skin.to} flex-shrink-0 border-2 transition-all ${selectedSkin.name === skin.name ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Nome do Cartão / Titular</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ex: Nubank, Inter..."
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                />
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Bandeira</label>
                <select 
                  value={brand} 
                  onChange={e => setBrand(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-xl font-medium text-slate-700 focus:outline-none"
                >
                   <option value="Mastercard">Mastercard</option>
                   <option value="Visa">Visa</option>
                   <option value="Elo">Elo</option>
                   <option value="Amex">Amex</option>
                   <option value="Hipercard">Hipercard</option>
                </select>
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Limite Total</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    value={limit} 
                    onChange={e => setLimit(e.target.value)} 
                    placeholder="0,00"
                    className="w-full bg-slate-50 p-3 pl-9 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-lime/50"
                  />
                </div>
             </div>
             
             <div className="col-span-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block flex items-center gap-1">
                 <Calendar size={10} /> Fechamento
               </label>
               <select 
                  value={closingDay} 
                  onChange={e => setClosingDay(Number(e.target.value))}
                  className="w-full bg-slate-50 p-3 rounded-xl font-medium text-slate-700 focus:outline-none"
                >
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>Dia {d}</option>)}
                </select>
             </div>

             <div className="col-span-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block flex items-center gap-1 text-red-400">
                 <ShieldCheck size={10} /> Vencimento
               </label>
               <select 
                  value={dueDay} 
                  onChange={e => setDueDay(Number(e.target.value))}
                  className="w-full bg-slate-50 p-3 rounded-xl font-medium text-slate-700 focus:outline-none"
                >
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>Dia {d}</option>)}
                </select>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={!name || !limit}
              className="px-8 py-3 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check size={18} strokeWidth={3} />
              {editingCard ? 'Salvar Alterações' : 'Criar Cartão'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CardFormModal;