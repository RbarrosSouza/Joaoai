import React, { useMemo, useState } from 'react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { Bell, User, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, PieChart as PieIcon, BarChart3, Target, Plus, Zap, Wallet, MoreHorizontal, Eye, EyeOff, Sparkles, AlertTriangle, ArrowRight, X, Settings as SettingsIcon, Landmark, CreditCard, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend, YAxis } from 'recharts';
import { getIcon } from '../constants';
import { TransactionType, AccountType } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { accounts, cards, totalBalance, getMonthlyStats, transactions, isPrivacyMode, togglePrivacyMode, userSettings } = useFinance();
  const { income, expenses } = getMonthlyStats();
  const categories = useCategories();
  const navigate = useNavigate();
  
  // Notification Modal State
  const [showNotifications, setShowNotifications] = useState(false);

  // Pure formatter
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- LOGIC: FINANCIAL INTELLIGENCE ---

  // 1. Liquidity Split (Cash vs Investments)
  const liquidityBalance = useMemo(() => {
    return accounts
      .filter(a => a.type === AccountType.CHECKING || a.type === AccountType.WALLET)
      .reduce((acc, curr) => acc + curr.balance, 0);
  }, [accounts]);

  const investmentBalance = totalBalance - liquidityBalance;

  // 2. Real AI Insight Generator (Updated with Pacing Logic)
  const aiInsight = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    // Group current month expenses by category
    const currentMonthExpenses: Record<string, number> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (t.type === TransactionType.EXPENSE && !t.isPending && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentMonthExpenses[t.categoryId] = (currentMonthExpenses[t.categoryId] || 0) + t.amount;
      }
    });

    const totalSpent = Object.values(currentMonthExpenses).reduce((a, b) => a + b, 0);

    // SCENARIO 1: Early Month / No Spend
    if (totalSpent === 0) {
        return {
            title: "Mês começando leve!",
            text: "Nenhum gasto significativo registrado ainda. Que tal revisar suas metas de economia em 'Planejamento'?",
            icon: Sparkles,
            sentiment: 'neutral'
        }
    }

    // SCENARIO 2: Budget Pacing Check (Preventive Alert)
    // We check if any category is being spent too fast based on the day of the month
    for (const [catId, spent] of Object.entries(currentMonthExpenses)) {
        const cat = categories.find(c => c.id === catId);
        if (!cat) continue;

        const budget = cat.monthlyBudgets?.[monthKey] ?? cat.budget ?? 0;
        
        // Only analyze if there is a budget and budget > 0
        if (budget > 0) {
            const idealPace = (budget / daysInMonth) * currentDay;
            // Threshold: If actual spend is > 115% of ideal pace (15% tolerance) AND significant amount (> R$ 50 gap)
            if (spent > idealPace * 1.15 && (spent - idealPace) > 50) {
                const percentUsed = ((spent / budget) * 100).toFixed(0);
                return {
                    title: `Ritmo acelerado em ${cat.name}`,
                    text: `Hoje é dia ${currentDay} e você já usou ${percentUsed}% da meta desta categoria. Tente desacelerar para não estourar no fim do mês.`,
                    icon: TrendingDown, // Using TrendingDown to indicate "Financial Health going down" or caution
                    sentiment: 'warning'
                };
            }
        }
    }

    // SCENARIO 3: Concentration Risk (If no budget alert triggered)
    // Find largest expense category
    let maxCatId = '';
    let maxVal = 0;
    Object.entries(currentMonthExpenses).forEach(([id, val]) => {
      if (val > maxVal) { maxVal = val; maxCatId = id; }
    });
    const categoryName = categories.find(c => c.id === maxCatId)?.name || 'Geral';

    if (maxVal > totalSpent * 0.45) {
         return {
            title: `Atenção com ${categoryName}`,
            text: `Esta categoria concentra ${((maxVal/totalSpent)*100).toFixed(0)}% dos seus gastos totais. Verifique se isso está dentro do esperado.`,
            icon: PieIcon,
            sentiment: 'neutral' // Neutral/Info, not necessarily bad if it's Rent
        }
    }

    // SCENARIO 4: Default Positive
    return {
        title: "Fluxo Equilibrado",
        text: `Você está mantendo seus gastos bem distribuídos. Sua maior despesa (${categoryName}) está sob controle.`,
        icon: TrendingUp,
        sentiment: 'positive'
    };

  }, [transactions, categories]);


  // 3. Logic: Overdue Transactions
  const overdueTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return transactions.filter(t => t.isPending && t.type === TransactionType.EXPENSE && new Date(t.date) < today);
  }, [transactions]);

  const overdueAmount = overdueTransactions.reduce((acc, t) => acc + t.amount, 0);

  // 4. Logic: Credit Card Limit Alerts (> 80%)
  const highLimitCards = useMemo(() => {
    return cards.filter(card => {
        const percent = (card.currentBill / card.limit) * 100;
        return percent >= 80;
    });
  }, [cards]);

  // 5. Logic: Bill Due Soon (within 5 days)
  const billDueCards = useMemo(() => {
      const today = new Date().getDate();
      return cards.filter(card => {
          const diff = card.dueDay - today;
          return diff >= 0 && diff <= 5; 
      });
  }, [cards]);

  // Master Notification Count
  const activeNotificationCount = useMemo(() => {
      if (!userSettings.enableNotifications) return 0;
      let count = 0;
      if (userSettings.notifyOverdue) count += overdueTransactions.length;
      if (userSettings.notifyLimitAlert) count += highLimitCards.length;
      if (userSettings.notifyBillDue) count += billDueCards.length;
      return count;
  }, [userSettings, overdueTransactions, highLimitCards, billDueCards]);

  
  const formatChartCurrency = (value: number) => {
    if (isPrivacyMode) return '••••••';
    return formatCurrency(value);
  };

  const privacyClass = isPrivacyMode ? 'blur-[7px] opacity-60 select-none' : '';
  const privacyClassLight = isPrivacyMode ? 'blur-[5px] opacity-60 select-none' : '';
  
  const formatRawCurrency = (value: number) => {
     return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // --- CHART DATA ---
  const monthlyComparisonData = [
    { name: 'Set', receitas: 4000, despesas: 2400 },
    { name: 'Out', receitas: 3000, despesas: 1398 },
    { name: 'Nov', receitas: 9800, despesas: 2000 },
    { name: 'Dez', receitas: 6500, despesas: 4800 },
    { name: 'Jan', receitas: income, despesas: expenses },
  ];

  const categorySpending = useMemo(() => {
    const stats = categories.map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id && t.type === TransactionType.EXPENSE && !t.isPending)
        .reduce((acc, t) => acc + t.amount, 0);
      return { 
        id: cat.id,
        name: cat.name, 
        value: total, 
        color: cat.color,
        icon: cat.icon
      };
    })
    .filter(stat => stat.value > 0)
    .sort((a, b) => b.value - a.value);

    return stats;
  }, [categories, transactions]);

  const COLORS = ['#133326', '#4F7A28', '#95BD23', '#CBD5E1', '#94A3B8', '#64748B'];

  return (
    <div className="space-y-8 w-full pb-10">
      
      {/* 1. Header (Premium & Calm) */}
      <header className="flex items-center justify-between gap-4 animate-slide-up pt-safe">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar hidden on Mobile, Visible on Desktop (md:block) */}
          <div className="relative group cursor-pointer shrink-0 hidden md:block" onClick={() => navigate('/settings')}>
             {/* Avatar with Glow */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-premium border border-white relative z-10 transition-transform duration-500 group-hover:scale-105">
               <User size={24} strokeWidth={1} />
            </div>
            <div className="absolute inset-0 bg-brand-lime/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-400 font-medium mb-0.5 animate-fade-in flex items-center gap-2 truncate">
              {getGreeting()}, {userSettings.name}
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime shrink-0"></span>
            </p>
            <h1 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight truncate">
              Sua <span className="font-semibold">Visão Geral</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
           {/* Privacy Toggle - Highlighted when Active */}
           <button 
             onClick={togglePrivacyMode}
             className={`relative p-3 rounded-full border shadow-sm transition-all group active:scale-95 ${
                 isPrivacyMode 
                   ? 'bg-brand-deep text-brand-lime border-brand-deep shadow-glow' 
                   : 'bg-white text-slate-400 hover:text-brand-deep border-slate-100 hover:bg-slate-50'
             }`}
             title={isPrivacyMode ? "Mostrar Valores" : "Ocultar Valores"}
           >
            {isPrivacyMode ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
          </button>

           <button 
             onClick={() => setShowNotifications(true)}
             className="relative p-3 bg-white hover:bg-slate-50 rounded-full text-slate-400 hover:text-brand-deep border border-slate-100 shadow-sm transition-all group active:scale-95"
           >
            <Bell size={22} strokeWidth={1.5} className="group-hover:swing" />
            {activeNotificationCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>
      </header>
      
      {/* 1.5 ALERT SECTION */}
      {userSettings.enableNotifications && userSettings.notifyOverdue && overdueTransactions.length > 0 && (
         <div className="animate-slide-up cursor-pointer" onClick={() => navigate('/transactions')}>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between group hover:bg-red-100/50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                     <AlertTriangle size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-red-700">Atenção Necessária</p>
                     <p className="text-xs text-red-600/80 mt-0.5">
                        Você tem <strong>{overdueTransactions.length} contas vencidas</strong> totalizando <span className={`font-bold`}>{formatCurrency(overdueAmount)}</span>.
                     </p>
                  </div>
               </div>
               <div className="pr-2">
                  <ArrowRight size={20} className="text-red-400 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
         </div>
      )}

      {/* 2. Insight Card + Total Balance (The "Concierge" Feel) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
         
         {/* Total Balance Split - Ultra Premium */}
         <div className="lg:col-span-1 card-base p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-lime/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
               <Wallet size={14} strokeWidth={2} /> Disponível (Caixa)
            </p>
            <div className="flex items-baseline gap-1">
               <h2 className={`text-4xl md:text-5xl text-slate-800 tracking-tighter transition-all duration-300 ${privacyClass}`}>
                 {formatCurrency(liquidityBalance)}
               </h2>
            </div>
            
            {/* Liquidity Split Visual */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                    <Lock size={12} className="opacity-50" />
                    <span className="text-xs font-medium">Investido / Reserva</span>
                </div>
                <span className={`text-sm font-bold text-slate-700 ${privacyClassLight}`}>
                    {formatCurrency(investmentBalance)}
                </span>
            </div>
         </div>

         {/* AI Insight Card - Real Data */}
         <div className="lg:col-span-2 card-base p-0 relative overflow-hidden border-0 ring-1 ring-black/5 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep to-[#1a4031]"></div>
            {/* Added Noise Texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 h-full text-white">
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                     <Sparkles size={18} className="text-brand-lime" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-brand-lime">João.ai Insight</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-light leading-tight mb-2">
                     {aiInsight.title}
                  </h3>
                  <p className="text-white/60 text-sm font-medium leading-relaxed max-w-lg">
                     {aiInsight.text}
                  </p>
               </div>
               
               <div className="hidden md:flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                     <aiInsight.icon size={32} className={aiInsight.sentiment === 'warning' ? 'text-amber-400' : 'text-brand-lime'} strokeWidth={1.5} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2.5 Accounts Carousel */}
      <section className="animate-slide-up" style={{ animationDelay: '150ms' }}>
         <div className="flex items-center justify-between px-1 mb-4">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Minhas Contas
             </h3>
         </div>

         <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center px-1">
            {accounts.map(acc => (
               <div 
                  key={acc.id} 
                  className={`min-w-[160px] p-4 rounded-2xl bg-gradient-to-br ${acc.colorFrom} ${acc.colorTo} relative overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-white/10`}
                  onClick={() => navigate('/accounts')}
               >
                  {/* Texture added to accounts too */}
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                  
                  <div className="relative z-10 text-white flex flex-col h-full justify-between gap-6">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/10">
                              {getIcon(acc.icon, 14)}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wide truncate opacity-90">{acc.bankName || 'Conta'}</span>
                      </div>
                      
                      <div>
                          <p className="text-[10px] text-white/70 font-bold mb-0.5 truncate">{acc.name}</p>
                          <p className={`font-semibold text-lg tracking-tight leading-none transition-all duration-300 ${privacyClass}`}>
                                {formatRawCurrency(acc.balance)}
                          </p>
                      </div>
                  </div>
               </div>
            ))}

            <button 
               onClick={() => navigate('/accounts')}
               className="min-w-[80px] h-[100px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-brand-lime hover:text-brand-deep hover:bg-brand-lime/5 transition-all"
            >
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <Plus size={16} />
               </div>
               <span className="text-[10px] font-bold">Gerenciar</span>
            </button>
         </div>
      </section>

      {/* 3. Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
         
         <div className="card-base p-6 flex flex-col justify-between group hover:shadow-float transition-all">
             <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                     <ArrowUpRight size={20} strokeWidth={2} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">REALIZADO</span>
             </div>
             <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Entradas</p>
                 <p className={`text-2xl font-semibold text-slate-800 tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {formatCurrency(income)}
                 </p>
             </div>
         </div>

         <div className="card-base p-6 flex flex-col justify-between group hover:shadow-float transition-all">
             <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                     <ArrowDownRight size={20} strokeWidth={2} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">REALIZADO</span>
             </div>
             <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Saídas</p>
                 <p className={`text-2xl font-semibold text-slate-800 tracking-tight transition-all duration-300 ${privacyClass}`}>
                    {formatCurrency(expenses)}
                 </p>
             </div>
         </div>

         <div className="card-base p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-float transition-all border border-brand-lime/20">
             <div className="absolute inset-0 bg-brand-lime/5 opacity-50"></div>
             <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-full bg-white border border-brand-lime/20 flex items-center justify-center text-brand-deep">
                         <Target size={20} strokeWidth={2} />
                     </div>
                     <span className="text-[10px] font-bold text-brand-deep bg-brand-lime/20 px-2 py-0.5 rounded-full">ATIVO</span>
                 </div>
                 <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Meta Economia</p>
                     <div className="flex items-baseline gap-2">
                        <p className={`text-2xl font-semibold text-brand-deep tracking-tight transition-all duration-300 ${privacyClass}`}>
                            {formatCurrency(450)}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">/ 1k</span>
                     </div>
                     <div className="w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-brand-lime w-[45%] rounded-full"></div>
                     </div>
                 </div>
             </div>
         </div>

      </div>

      {/* 4. CHART SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
        
        {/* Category Breakdown */}
        <section className="xl:col-span-8 flex flex-col gap-6">
           <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                Gastos Realizados
             </h3>
             <button className="text-slate-400 hover:text-brand-deep transition-colors p-2 hover:bg-white rounded-full">
                <MoreHorizontal size={20} />
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut Chart */}
              <div className="card-base p-8 flex flex-col items-center justify-center min-h-[340px] relative">
                  {categorySpending.length > 0 ? (
                    <div className="relative w-full h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySpending}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                          >
                            {categorySpending.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          {/* Premium Tooltip Styling */}
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: 'white', padding: '10px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                             itemStyle={{ color: '#95BD23', fontWeight: 'bold', fontSize: '12px' }}
                             formatter={(value: number) => formatChartCurrency(value)}
                             labelStyle={{ display: 'none' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pago</span>
                         <span className={`text-xl font-bold text-slate-800 transition-all duration-300 ${privacyClassLight}`}>
                            {formatCurrency(expenses)}
                         </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                       <PieIcon size={48} strokeWidth={1} className="mb-4 opacity-50" />
                       <p className="text-sm font-medium">Sem gastos pagos</p>
                    </div>
                  )}
              </div>

              {/* Ranking List */}
              <div className="card-base p-8 flex flex-col">
                  <div className="space-y-6 overflow-y-auto max-h-[300px] no-scrollbar pr-2">
                     {categorySpending.length > 0 ? categorySpending.map((cat, index) => {
                        const percent = ((cat.value / expenses) * 100).toFixed(0);
                        const barColor = COLORS[index % COLORS.length];
                        return (
                          <div key={cat.id} className="group cursor-pointer">
                             <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-brand-deep group-hover:shadow-sm transition-all border border-transparent`}>
                                      {getIcon(cat.icon, 14)}
                                   </div>
                                   <div>
                                      <p className="font-medium text-slate-700 text-sm">{cat.name}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-slate-800 text-sm transition-all duration-300 ${privacyClassLight}`}>
                                        {formatCurrency(cat.value)}
                                    </p>
                                </div>
                             </div>
                             <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden flex gap-2 items-center">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000" 
                                  style={{ width: `${percent}%`, backgroundColor: barColor }}
                                ></div>
                             </div>
                          </div>
                        );
                     }) : (
                        <p className="text-slate-400 text-sm text-center italic mt-10">Nenhum gasto realizado neste mês ainda.</p>
                     )}
                  </div>
              </div>
           </div>
        </section>

        {/* Right: Monthly Comparison */}
        <div className="xl:col-span-4 flex flex-col gap-8">
           <div className="card-base p-8 flex flex-col h-full min-h-[350px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                       Fluxo de Caixa
                    </h4>
                 </div>
              </div>
              
              <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparisonData} margin={{top: 10, right: 0, left: -20, bottom: 0}} barGap={6}>
                    <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                    {/* Premium Tooltip Styling */}
                    <Tooltip 
                      cursor={{fill: '#F8FAFC', radius: 6}}
                      contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', padding: '12px' }}
                      formatter={(value: number) => formatChartCurrency(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: '#64748B' }} />
                    <Bar name="Entradas" dataKey="receitas" fill="#133326" radius={[3, 3, 3, 3]} maxBarSize={6} />
                    <Bar name="Saídas" dataKey="despesas" fill="#E2E8F0" radius={[3, 3, 3, 3]} maxBarSize={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>

      {/* NOTIFICATION CENTER MODAL */}
      {showNotifications && (
         <div className="fixed inset-0 z-[60] flex items-end sm:items-start sm:justify-end bg-slate-900/20 backdrop-blur-sm animate-fade-in sm:p-4">
             <div className="w-full sm:w-[400px] bg-white sm:rounded-2xl shadow-2xl h-[80vh] sm:h-auto sm:max-h-[600px] flex flex-col animate-slide-up sm:mt-16 sm:mr-4 border border-slate-100">
                 <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Bell size={18} className="text-brand-lime" />
                        Notificações
                     </h3>
                     <button onClick={() => setShowNotifications(false)} className="p-1 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                     </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {userSettings.enableNotifications ? (
                        <>
                           {userSettings.notifyOverdue && overdueTransactions.length > 0 && (
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-red-800">Contas Vencidas</p>
                                    <p className="text-xs text-red-600 mt-1">
                                        Você tem {overdueTransactions.length} contas que precisam de atenção urgente.
                                    </p>
                                    <button onClick={() => { setShowNotifications(false); navigate('/transactions'); }} className="text-xs font-bold text-red-700 underline mt-2">
                                        Ver pendências
                                    </button>
                                </div>
                                </div>
                           )}
                           {userSettings.notifyLimitAlert && highLimitCards.map(card => (
                                <div key={`limit_${card.id}`} className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                                    <AlertTriangle size={18} className="text-orange-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-800">Limite Atingido</p>
                                        <p className="text-xs text-orange-600 mt-1">
                                            O cartão <strong>{card.name}</strong> já usou mais de 80% do limite disponível.
                                        </p>
                                        <button onClick={() => { setShowNotifications(false); navigate('/cards'); }} className="text-xs font-bold text-orange-700 underline mt-2">
                                            Gerenciar Cartões
                                        </button>
                                    </div>
                                </div>
                           ))}
                           {userSettings.notifyBillDue && billDueCards.map(card => (
                                <div key={`due_${card.id}`} className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                                    <CreditCard size={18} className="text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-800">Fatura Próxima</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            A fatura do <strong>{card.name}</strong> vence dia {card.dueDay}. Se organize para pagar.
                                        </p>
                                    </div>
                                </div>
                           ))}
                           {activeNotificationCount === 0 && (
                                <div className="text-center py-10 text-slate-400">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Nenhuma notificação nova.</p>
                                </div>
                           )}
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                           <Bell size={32} className="mx-auto mb-2 opacity-20" />
                           <p className="text-sm">Notificações desativadas.</p>
                           <button onClick={() => navigate('/settings')} className="text-xs font-bold text-brand-deep underline mt-2">Ativar nas Configurações</button>
                        </div>
                    )}
                 </div>

                 <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button 
                        onClick={() => { setShowNotifications(false); navigate('/settings'); }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    >
                       <SettingsIcon size={16} />
                       Configurar Alertas
                    </button>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
};

export default Dashboard;