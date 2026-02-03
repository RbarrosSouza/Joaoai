import React, { useState, useMemo } from 'react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { getIcon } from '../constants';
import { TransactionType } from '../types';
import { 
  TrendingUp, TrendingDown, Calendar, ArrowRight, 
  ArrowUpRight, ArrowDownRight, Activity, PieChart, 
  AlertCircle, ChevronLeft, ChevronRight, Zap, BarChart3,
  Target, Wallet, ArrowLeftRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Line, ComposedChart, Cell 
} from 'recharts';
import { parseLocalDateString, isoToLocalDateString } from '../utils/dateUtils';

const Analytics: React.FC = () => {
  const { transactions, isPrivacyMode } = useFinance();
  const categories = useCategories();
  
  // State: Date Control & Comparison Mode
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [comparisonMode, setComparisonMode] = useState<'PREV_MONTH' | 'AVG_6_MONTHS'>('PREV_MONTH');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatChartCurrency = (value: number) => {
    if (isPrivacyMode) return '••••••';
    return formatCurrency(value);
  };
  
  const privacyClass = isPrivacyMode ? 'blur-[6px] opacity-60 select-none' : '';
  const privacyClassLight = isPrivacyMode ? 'blur-[4px] opacity-60 select-none' : '';

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const handleMonthInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const [year, month] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, 1));
  };

  const monthInputValue = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;

  // --- DATA PROCESSING ---

  // 1. Current Month Stats
  const currentMonthStats = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    
    const filtered = transactions.filter(t => {
      const d = parseLocalDateString(isoToLocalDateString(t.date));
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const income = filtered.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expense = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);

    return { income, expense, transactions: filtered };
  }, [selectedDate, transactions]);

  // 2. Previous Month Stats
  const prevMonthStats = useMemo(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const month = prevDate.getMonth();
    const year = prevDate.getFullYear();

    const filtered = transactions.filter(t => {
      const d = parseLocalDateString(isoToLocalDateString(t.date));
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const income = filtered.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expense = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);

    return { income, expense };
  }, [selectedDate, transactions]);

  // 3. Six Month Average Stats (New for Comparison)
  const sixMonthAvgStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    // Calculate average of the *previous* 6 months relative to selected date
    for (let i = 1; i <= 6; i++) {
        const d = new Date(selectedDate);
        d.setMonth(d.getMonth() - i);
        
        const monthTrans = transactions.filter(t => {
            const tDate = parseLocalDateString(isoToLocalDateString(t.date));
            return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
        });

        totalIncome += monthTrans.filter(t => t.type === TransactionType.INCOME).reduce((a, t) => a + t.amount, 0);
        totalExpense += monthTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((a, t) => a + t.amount, 0);
    }
    return { income: totalIncome / 6, expense: totalExpense / 6 };
  }, [selectedDate, transactions]);


  // --- CALCULATIONS BASED ON COMPARISON MODE ---
  
  const referenceStats = comparisonMode === 'PREV_MONTH' ? prevMonthStats : sixMonthAvgStats;
  const referenceLabel = comparisonMode === 'PREV_MONTH' ? 'vs Mês Anterior' : 'vs Média (6m)';

  const expenseChange = referenceStats.expense > 0 
    ? ((currentMonthStats.expense - referenceStats.expense) / referenceStats.expense) * 100 
    : 0;
  
  const incomeChange = referenceStats.income > 0
    ? ((currentMonthStats.income - referenceStats.income) / referenceStats.income) * 100
    : 0;

  // Savings Rate
  const savingsAmount = currentMonthStats.income - currentMonthStats.expense;
  const savingsRate = currentMonthStats.income > 0 ? (savingsAmount / currentMonthStats.income) * 100 : 0;
  
  // Daily Average
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const currentDay = (selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear()) 
    ? new Date().getDate() 
    : daysInMonth;
  
  const dailyAverage = currentMonthStats.expense / Math.max(currentDay, 1);

  // Future Projections
  const pendingExpenses = currentMonthStats.transactions
    .filter(t => t.isPending && t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  // 4. Evolution Data
  const evolutionData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setMonth(d.getMonth() - i);
      
      const monthTrans = transactions.filter(t => {
        const tDate = parseLocalDateString(isoToLocalDateString(t.date));
        return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
      });

      const inc = monthTrans.filter(t => t.type === TransactionType.INCOME).reduce((a, t) => a + t.amount, 0);
      const exp = monthTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((a, t) => a + t.amount, 0);

      data.push({
        name: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        Receitas: inc,
        Despesas: exp,
        Saldo: inc - exp
      });
    }
    return data;
  }, [selectedDate, transactions]);

  // 5. Category Analysis
  const categoryAnalysis = useMemo(() => {
    const stats = categories.map(cat => {
      const currentTotal = currentMonthStats.transactions
        .filter(t => t.categoryId === cat.id && t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + t.amount, 0);
      
      // Compare with Previous Month always for category specific trends (more relevant immediate context)
      const prevTotal = transactions
        .filter(t => {
          const d = parseLocalDateString(isoToLocalDateString(t.date));
          const prevD = new Date(selectedDate);
          prevD.setMonth(prevD.getMonth() - 1);
          return t.categoryId === cat.id && 
                 t.type === TransactionType.EXPENSE &&
                 d.getMonth() === prevD.getMonth() &&
                 d.getFullYear() === prevD.getFullYear();
        })
        .reduce((acc, t) => acc + t.amount, 0);

      const change = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

      return {
        ...cat,
        value: currentTotal,
        prevValue: prevTotal,
        change,
        isUp: currentTotal > prevTotal
      };
    })
    .filter(c => c.value > 0 || c.prevValue > 0)
    .sort((a, b) => b.value - a.value);

    return stats;
  }, [categories, currentMonthStats, transactions, selectedDate]);


  return (
    <div className="space-y-8 w-full text-slate-800 pb-20">
      
      {/* HEADER: Context & Date */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-3">
             <BarChart3 size={32} className="text-brand-lime" />
             Análise Financeira
          </h1>
          <div className="flex items-center gap-4 text-slate-500 font-medium text-sm mt-2">
             <span>Comparar com:</span>
             <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                <button 
                   onClick={() => setComparisonMode('PREV_MONTH')}
                   className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${comparisonMode === 'PREV_MONTH' ? 'bg-white text-brand-deep shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   Mês Anterior
                </button>
                <button 
                   onClick={() => setComparisonMode('AVG_6_MONTHS')}
                   className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${comparisonMode === 'AVG_6_MONTHS' ? 'bg-white text-brand-deep shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   Média (6m)
                </button>
             </div>
          </div>
        </div>

        {/* Date Selector - Cleaned Up with Native Month Picker Overlay */}
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

      {/* SECTION 1: THE PULSE (4-GRID SYSTEM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-up">
        
        {/* 1. Expense Card */}
        <div className="card-base p-6 relative overflow-hidden group">
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saídas</span>
                 <span className={`text-2xl font-bold text-slate-800 tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {formatCurrency(currentMonthStats.expense)}
                 </span>
              </div>
              <div className="flex flex-col items-end">
                 <div className={`p-1.5 px-2 rounded-lg flex items-center gap-1 text-xs font-bold ${expenseChange > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {expenseChange > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(expenseChange).toFixed(1)}%
                 </div>
                 <span className="text-[9px] font-bold text-slate-300 mt-1">{referenceLabel}</span>
              </div>
           </div>
           {/* Spending Velocity Indicator */}
           <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
              <Activity size={12} className="text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">
                Média: <span className={`font-bold text-slate-700 ${privacyClassLight}`}>{formatCurrency(dailyAverage)}/dia</span>
              </p>
           </div>
        </div>

        {/* 2. Income Card */}
        <div className="card-base p-6 relative overflow-hidden group">
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Entradas</span>
                 <span className={`text-2xl font-bold text-slate-800 tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {formatCurrency(currentMonthStats.income)}
                 </span>
              </div>
              <div className="flex flex-col items-end">
                  <div className={`p-1.5 px-2 rounded-lg flex items-center gap-1 text-xs font-bold ${incomeChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                     {incomeChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                     {Math.abs(incomeChange).toFixed(1)}%
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 mt-1">{referenceLabel}</span>
              </div>
           </div>
           <p className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-50">
             Baseado em {currentMonthStats.transactions.filter(t => t.type === TransactionType.INCOME).length} recebimentos.
           </p>
        </div>

        {/* 3. Savings Rate Card */}
        <div className="card-base p-6 relative overflow-hidden group border border-brand-lime/20 bg-brand-lime/5">
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-brand-deep uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Target size={12} className="text-brand-lime fill-brand-lime" />
                    Taxa de Economia
                 </span>
                 <span className={`text-2xl font-bold text-brand-deep tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {savingsRate.toFixed(1)}%
                 </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-deep shadow-sm">
                 <Wallet size={16} />
              </div>
           </div>
           {/* Visual Progress Bar for Savings */}
           <div className="w-full bg-black/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${savingsRate > 20 ? 'bg-brand-lime' : savingsRate > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
              ></div>
           </div>
           <p className="text-[10px] text-brand-deep/60 font-bold mt-2 text-right">META: 20%</p>
        </div>

        {/* 4. Forecast Card */}
        <div className="card-base p-6 relative overflow-hidden group">
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Zap size={10} />
                    A Vencer
                 </span>
                 <span className={`text-2xl font-bold text-slate-800 tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {formatCurrency(pendingExpenses)}
                 </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                 <Calendar size={16} />
              </div>
           </div>
           <p className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-50">
             Valor pendente para o fim do mês.
           </p>
        </div>
      </div>

      {/* SECTION 2: EVOLUTION */}
      <div className="card-base p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Activity size={20} className="text-slate-400" />
               Fluxo de Caixa Semestral
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-brand-deep"></div> Receitas
               </div>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div> Despesas
               </div>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className="w-3 h-1 rounded-full bg-brand-lime"></div> Saldo Líquido
               </div>
            </div>
         </div>
         
         <div className="h-[250px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={evolutionData} margin={{top: 10, right: 0, left: -20, bottom: 0}} barGap={8}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                  <Tooltip 
                     cursor={{fill: '#F8FAFC', radius: 6}}
                     contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', padding: '12px' }}
                     formatter={(value: number) => formatChartCurrency(value)}
                  />
                  <Bar dataKey="Receitas" fill="#133326" radius={[4, 4, 4, 4]} maxBarSize={40} />
                  <Bar dataKey="Despesas" fill="#E2E8F0" radius={[4, 4, 4, 4]} maxBarSize={40} />
                  <Line type="monotone" dataKey="Saldo" stroke="#95BD23" strokeWidth={3} dot={{r: 4, fill: '#95BD23', strokeWidth: 0}} />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* SECTION 3: CATEGORY DEEP DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
         
         {/* Top Spenders List */}
         <div className="card-base p-0 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <PieChart size={18} className="text-slate-400" />
                  Análise por Categoria
               </h3>
               <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">vs Mês Anterior</span>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar p-2">
               {categoryAnalysis.map((cat, idx) => (
                  <div key={cat.id} className="p-4 hover:bg-slate-50 rounded-xl transition-all group">
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} bg-opacity-10 text-opacity-100`}>
                              {getIcon(cat.icon, 18)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-700 text-sm">{cat.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 {cat.change !== 0 ? (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${cat.change > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                       {cat.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                       {Math.abs(cat.change).toFixed(0)}%
                                    </span>
                                 ) : (
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Estável</span>
                                 )}
                                 <span className={`text-[10px] text-slate-400 ${privacyClassLight}`}>vs {formatCurrency(cat.prevValue)}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`font-bold text-slate-800 text-sm transition-all duration-300 ${privacyClass}`}>
                              {formatCurrency(cat.value)}
                           </p>
                        </div>
                     </div>
                     {/* Mini bar chart comparing */}
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center relative">
                        {/* Current Value Bar */}
                        <div className="h-full bg-slate-800 rounded-full z-10" style={{ width: `${Math.min((cat.value / (currentMonthStats.expense || 1)) * 100 * 2, 100)}%` }}></div>
                        {/* Marker for previous value (approximate visual) */}
                        {cat.prevValue > 0 && (
                           <div className="absolute w-0.5 h-3 bg-slate-400 z-20" style={{ left: `${Math.min((cat.prevValue / (currentMonthStats.expense || 1)) * 100 * 2, 100)}%` }}></div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Upcoming / Radar */}
         <div className="flex flex-col gap-6">
            <div className="card-base p-8 flex-1">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <AlertCircle size={20} className="text-brand-lime" />
                  Próximos Vencimentos
               </h3>

               {currentMonthStats.transactions.filter(t => t.isPending && t.type === TransactionType.EXPENSE).length > 0 ? (
                  <div className="space-y-4">
                     {currentMonthStats.transactions
                        .filter(t => t.isPending && t.type === TransactionType.EXPENSE)
                        .sort((a, b) => parseLocalDateString(isoToLocalDateString(a.date)).getTime() - parseLocalDateString(isoToLocalDateString(b.date)).getTime())
                        .slice(0, 5) // Show top 5
                        .map(t => (
                           <div key={t.id} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-3">
                                 <div className="flex flex-col items-center justify-center w-10 h-10 bg-slate-50 rounded-lg text-slate-500 font-bold border border-slate-100">
                                    <span className="text-[8px] uppercase">{parseLocalDateString(isoToLocalDateString(t.date)).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-sm leading-none">{parseLocalDateString(isoToLocalDateString(t.date)).getDate()}</span>
                                 </div>
                                 <div>
                                    <p className="font-semibold text-slate-700 text-sm line-clamp-1">{t.description}</p>
                                    <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                       {categories.find(c => c.id === t.categoryId)?.name}
                                    </span>
                                 </div>
                              </div>
                              <span className={`font-bold text-sm text-slate-700 transition-all duration-300 ${privacyClassLight}`}>
                                 {formatCurrency(t.amount)}
                              </span>
                           </div>
                        ))
                     }
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 min-h-[200px]">
                     <Check size={40} className="mb-2 opacity-50" />
                     <p className="text-sm font-medium">Tudo pago por aqui!</p>
                  </div>
               )}
            </div>

            {/* Quick Insight Text */}
            <div className="bg-brand-deep rounded-3xl p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="relative z-10">
                  <h4 className="font-bold text-brand-lime mb-2 text-sm uppercase tracking-widest">Resumo Inteligente</h4>
                  <p className="text-sm leading-relaxed text-white/80">
                     Sua <strong>Taxa de Economia está em <span className={privacyClass}>{savingsRate.toFixed(1)}%</span></strong>. 
                     {savingsRate < 10 && ' Atenção: Tente reduzir gastos variáveis para atingir pelo menos 20%.'}
                     {savingsRate >= 20 && ' Excelente! Você está construindo patrimônio com solidez.'}
                     {pendingExpenses > 0 && ` Fique atento aos ${isPrivacyMode ? 'valores' : formatCurrency(pendingExpenses)} que ainda vão vencer.`}
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Simple Check Icon for Empty State
const Check = ({ size, className }: { size: number, className?: string }) => (
   <svg 
     xmlns="http://www.w3.org/2000/svg" 
     width={size} height={size} viewBox="0 0 24 24" 
     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
     className={className}
   >
     <polyline points="20 6 9 17 4 12" />
   </svg>
);

export default Analytics;