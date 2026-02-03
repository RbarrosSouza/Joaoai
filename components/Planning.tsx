import React, { useState } from 'react';
import { useCategories, useFinance } from '../services/FinanceContext';
import { getIcon } from '../constants';
import { TransactionType } from '../types';
import { Target, AlertTriangle, Plus, CalendarDays, Wallet, Edit2, ChevronLeft, ChevronRight, X, Check, Repeat, Calendar } from 'lucide-react';
import { parseLocalDateString, isoToLocalDateString } from '../utils/dateUtils';

const Planning: React.FC = () => {
  const categories = useCategories();
  const { transactions, setCategoryBudget } = useFinance();
  const [activeTab, setActiveTab] = useState<'BUDGET' | 'FUTURE'>('BUDGET');
  
  // Time Navigation State
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Edit Budget Modal State
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [applyScope, setApplyScope] = useState<'SINGLE' | 'FUTURE'>('FUTURE');

  const activeCategories = categories.filter(c => c.isActive !== false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getMonthKey = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const changeMonth = (offset: number) => {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + offset);
      setSelectedDate(newDate);
  };

  // Helper for native month input
  const handleMonthInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const [year, month] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, 1));
  };
  
  // Format for input type="month" value
  const monthInputValue = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;

  // Helper to get budget for a specific category in the selected month
  const getBudgetForCategory = (catId: string) => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return 0;

      const key = getMonthKey(selectedDate);
      // Priority: Specific Month Budget -> Default Budget -> 0
      return cat.monthlyBudgets?.[key] ?? cat.budget ?? 0;
  };

  const getSpentByCategory = (catId: string) => {
    return transactions
      .filter(t => {
          const tDate = parseLocalDateString(isoToLocalDateString(t.date));
          return t.categoryId === catId && 
                 t.type === TransactionType.EXPENSE && 
                 tDate.getMonth() === selectedDate.getMonth() &&
                 tDate.getFullYear() === selectedDate.getFullYear();
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleOpenBudgetEdit = (catId: string) => {
      const currentBudget = getBudgetForCategory(catId);
      setBudgetInput(currentBudget > 0 ? currentBudget.toString() : '');
      setEditingBudgetCategory(catId);
      setApplyScope('FUTURE'); // Default to future as it's the most common "setting a standard" action
  };

  const handleSaveBudget = () => {
      if (!editingBudgetCategory) return;
      const amount = parseFloat(budgetInput) || 0;
      
      setCategoryBudget(
          editingBudgetCategory, 
          amount, 
          selectedDate, 
          applyScope === 'FUTURE'
      );
      
      setEditingBudgetCategory(null);
  };

  const futureTransactions = transactions
    .filter(t => {
      const tDate = parseLocalDateString(isoToLocalDateString(t.date));
      const today = new Date();
      today.setHours(0,0,0,0);
      return tDate > today;
    })
    .sort((a, b) => parseLocalDateString(isoToLocalDateString(a.date)).getTime() - parseLocalDateString(isoToLocalDateString(b.date)).getTime());

  const totalBudgetMonth = activeCategories.reduce((acc, cat) => acc + getBudgetForCategory(cat.id), 0);
  const totalSpentMonth = activeCategories.reduce((acc, cat) => acc + getSpentByCategory(cat.id), 0);

  return (
    <div className="space-y-8 w-full text-slate-800 pb-20">
      
      {/* 1. Top Bar: Title & Month Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">Planejamento</h1>
          <p className="text-base text-slate-500 font-medium">Defina metas e acompanhe seu progresso.</p>
        </div>
        
        {/* Simplified Date Selector with Native Input Overlay */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm relative z-20">
            <button 
                onClick={() => changeMonth(-1)}
                className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-colors z-20 relative"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="px-3 text-center min-w-[140px] relative">
                <span className="text-base font-bold text-slate-800 capitalize flex items-center justify-center gap-1">
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}
                    <span className="text-slate-300 font-light">/</span>
                    {selectedDate.getFullYear()}
                </span>
                {/* Invisible Native Month Input */}
                <input 
                  type="month"
                  value={monthInputValue}
                  onChange={handleMonthInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
            </div>
            <button 
                onClick={() => changeMonth(1)}
                className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-colors z-20 relative"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="border-b border-slate-200 flex gap-6 px-1">
           <button 
             onClick={() => setActiveTab('BUDGET')}
             className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'BUDGET' ? 'border-brand-lime text-brand-deep' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             Orçamentos
           </button>
           <button 
             onClick={() => setActiveTab('FUTURE')}
             className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'FUTURE' ? 'border-brand-lime text-brand-deep' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             Lançamentos Futuros
           </button>
      </div>

      {activeTab === 'BUDGET' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Summary Card */}
            <div className="col-span-1 md:col-span-2 2xl:col-span-3 card-base px-8 py-6 flex flex-col md:flex-row items-center gap-6 mb-2 border border-brand-lime/20 bg-brand-lime/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="bg-white p-3 rounded-full text-brand-deep shadow-sm z-10">
                <Target size={24} strokeWidth={2} />
              </div>
              <div className="flex-1 text-center md:text-left flex flex-col md:flex-row md:items-center gap-4 z-10">
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Planejado ({selectedDate.toLocaleDateString('pt-BR', { month: 'short' })})</p>
                   <p className="text-2xl font-bold text-brand-deep tracking-tight">{formatCurrency(totalBudgetMonth)}</p>
                </div>
                <div className="h-8 w-[1px] bg-brand-lime/20 mx-4 hidden md:block"></div>
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Disponível Geral</p>
                   <p className={`text-xl font-bold tracking-tight ${totalBudgetMonth - totalSpentMonth < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                       {formatCurrency(totalBudgetMonth - totalSpentMonth)}
                   </p>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            {activeCategories.map(cat => {
              const spent = getSpentByCategory(cat.id);
              const budget = getBudgetForCategory(cat.id);
              const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : (spent > 0 ? 100 : 0);
              const isOver = budget > 0 && spent > budget;
              const isUnplanned = budget === 0 && spent > 0;

              return (
                <div key={cat.id} className="card-base p-6 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border hover:border-brand-lime/30">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm text-slate-500`}>
                            {getIcon(cat.icon, 20)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{cat.name}</h3>
                            <button 
                                onClick={() => handleOpenBudgetEdit(cat.id)}
                                className="text-[10px] font-bold text-brand-deep hover:underline mt-0.5 flex items-center gap-1"
                            >
                                {budget > 0 ? `Meta: ${formatCurrency(budget)}` : 'Definir Meta'}
                                <Edit2 size={10} />
                            </button>
                        </div>
                    </div>
                    {/* Action */}
                    <button 
                        onClick={() => handleOpenBudgetEdit(cat.id)}
                        className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-brand-lime hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Edit2 size={14} />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mb-3 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Consumido</span>
                        <span className={`text-2xl font-bold tracking-tight ${isOver || isUnplanned ? 'text-red-500' : 'text-slate-800'}`}>
                            {formatCurrency(spent)}
                        </span>
                    </div>
                    <span className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-slate-400'} mb-1`}>{percentage.toFixed(0)}%</span>
                  </div>

                  {/* Bar */}
                  <div className="relative pt-2">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                        <div 
                          style={{ width: `${percentage}%` }} 
                          className={`flex flex-col text-center whitespace-nowrap justify-center ${isOver || isUnplanned ? 'bg-red-500' : 'bg-brand-lime'} transition-all duration-1000 ease-out rounded-full`}
                        ></div>
                    </div>
                    {isOver ? (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md w-fit">
                        <AlertTriangle size={10} /> Excedido em {formatCurrency(spent - budget)}
                      </p>
                    ) : budget > 0 ? (
                      <p className="text-[10px] text-brand-green font-bold flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md w-fit">
                        Disponível: {formatCurrency(budget - spent)}
                      </p>
                    ) : spent > 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md w-fit">
                            Sem meta definida
                        </p>
                    ) : (
                        <p className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5 px-2 py-1 w-fit">
                            Sem gastos
                        </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
      ) : (
          <div className="animate-fade-in space-y-6">
              <div className="card-base p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <CalendarDays className="text-slate-400" size={20} />
                     Próximos Lançamentos (Geral)
                  </h3>
                  
                  {futureTransactions.length === 0 ? (
                      <div className="text-center py-20 text-slate-400">
                          <p>Nenhum lançamento futuro.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {futureTransactions.map(t => {
                             const date = parseLocalDateString(isoToLocalDateString(t.date));
                             const cat = categories.find(c => c.id === t.categoryId);
                             
                             return (
                                <div key={t.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-100 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-xl text-slate-400 font-bold border border-slate-100">
                                            <span className="text-[10px] uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg leading-none text-slate-700">{date.getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{t.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-slate-100 text-slate-500`}>
                                                    {cat?.name}
                                                </span>
                                                {t.frequency === 'INSTALLMENT' && (
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
                                                        {t.installments?.current}/{t.installments?.total}
                                                    </span>
                                                )}
                                                {t.frequency === 'RECURRING' && (
                                                    <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-bold uppercase">
                                                        Fixa
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-base ${t.type === 'INCOME' ? 'text-brand-green' : 'text-slate-700'} tracking-tight`}>
                                        {formatCurrency(t.amount)}
                                    </span>
                                </div>
                             )
                          })}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* EDIT BUDGET MODAL */}
      {editingBudgetCategory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Definir Orçamento</h3>
                        <p className="text-xs text-slate-400 font-medium">
                            {categories.find(c => c.id === editingBudgetCategory)?.name} • {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button 
                        onClick={() => setEditingBudgetCategory(null)}
                        className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-8 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Valor Limite</p>
                    <div className="flex items-center gap-1 mb-6">
                        <span className="text-xl font-bold text-slate-300 pb-1">R$</span>
                        <input 
                            type="number" 
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="0,00"
                            className="w-40 text-4xl font-bold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200 text-center tracking-tight"
                            autoFocus
                        />
                    </div>

                    {/* Scope Selector (The Time Dimension Solution) */}
                    <div className="w-full bg-slate-50 p-1.5 rounded-xl flex gap-1 mb-6">
                        <button
                            onClick={() => setApplyScope('SINGLE')}
                            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${applyScope === 'SINGLE' ? 'bg-white text-brand-deep shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Calendar size={16} />
                            <span>Apenas {selectedDate.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                        </button>
                        <button
                            onClick={() => setApplyScope('FUTURE')}
                            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${applyScope === 'FUTURE' ? 'bg-white text-brand-deep shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Repeat size={16} />
                            <span>{selectedDate.toLocaleDateString('pt-BR', { month: 'short' })} em diante</span>
                        </button>
                    </div>

                    <button 
                        onClick={handleSaveBudget}
                        className="w-full py-3.5 bg-brand-deep text-brand-lime rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} strokeWidth={3} />
                        Salvar Meta
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Planning;