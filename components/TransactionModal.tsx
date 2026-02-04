import React, { useState, useEffect } from 'react';
import { X, Tag, ChevronDown, Calendar, Repeat, CreditCard, Landmark, Wallet, Layers, CheckCircle2, Circle, Clock, CalendarDays, Trash2 } from 'lucide-react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { TransactionType, TransactionFrequency, Transaction } from '../types';
import { getIcon } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { uuidv4 } from '../utils/uuid';
import { getTodayString, toLocalDateString, isoToLocalDateString, dateStringToLocalISO, parseLocalDateString } from '../utils/dateUtils';

interface TransactionModalProps {
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ onClose, editingTransaction }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addMultipleTransactions, updateTransaction, deleteTransaction, accounts, cards } = useFinance();
  const allCategories = useCategories();

  const activeCategories = allCategories.filter(c => c.isActive !== false);

  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [dueDate, setDueDate] = useState(getTodayString());
  const [paymentDate, setPaymentDate] = useState(getTodayString());
  const [isPaid, setIsPaid] = useState(false);

  const [frequency, setFrequency] = useState<TransactionFrequency>('SINGLE');
  const [totalInstallments, setTotalInstallments] = useState(2);
  const [recurringMonths, setRecurringMonths] = useState(12);

  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id || '');
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined);

  const [selectedSourceType, setSelectedSourceType] = useState<'ACCOUNT' | 'CARD'>('ACCOUNT');
  const [selectedSourceId, setSelectedSourceId] = useState(accounts[0]?.id || '');

  const selectedCategory = activeCategories.find(c => c.id === categoryId);

  // Se o usuário está começando do zero: ajusta origem automaticamente para evitar estados inválidos.
  useEffect(() => {
    if (editingTransaction) return;
    if (selectedSourceType === 'ACCOUNT' && accounts.length === 0) {
      if (type === TransactionType.EXPENSE && cards.length > 0) {
        setSelectedSourceType('CARD');
        setSelectedSourceId(cards[0]?.id || '');
      } else {
        setSelectedSourceId('');
      }
    }
    if (selectedSourceType === 'CARD' && cards.length === 0) {
      setSelectedSourceType('ACCOUNT');
      setSelectedSourceId(accounts[0]?.id || '');
    }
  }, [accounts, cards, editingTransaction, selectedSourceType, type]);

  // Load Editing Data
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);

      const safeDate = editingTransaction.date ? isoToLocalDateString(editingTransaction.date) : getTodayString();
      setDueDate(safeDate);

      const safePayment = editingTransaction.paymentDate ? isoToLocalDateString(editingTransaction.paymentDate) : safeDate;
      setPaymentDate(safePayment);

      setIsPaid(!editingTransaction.isPending);
      setFrequency(editingTransaction.frequency);

      setCategoryId(editingTransaction.categoryId);
      setSubCategoryId(editingTransaction.subCategoryId);

      if (editingTransaction.cardId) {
        setSelectedSourceType('CARD');
        setSelectedSourceId(editingTransaction.cardId);
      } else if (editingTransaction.accountId) {
        setSelectedSourceType('ACCOUNT');
        setSelectedSourceId(editingTransaction.accountId);
      }
    }
  }, [editingTransaction]);

  // SMART DATE LOGIC for Credit Cards
  useEffect(() => {
    // Only run auto-logic for NEW transactions when switching to a card
    if (!editingTransaction && selectedSourceType === 'CARD') {
      const card = cards.find(c => c.id === selectedSourceId);
      if (card) {
        const today = new Date();
        const closingDay = card.closingDay;

        // If today is AFTER closing day, it goes to next month
        let targetDate = new Date();
        if (today.getDate() >= closingDay) {
          targetDate.setMonth(targetDate.getMonth() + 1);
        }
        // Set to Due Day
        targetDate.setDate(card.dueDay);

        setDueDate(toLocalDateString(targetDate));
        // Also update payment date to match, assuming future payment
        setPaymentDate(toLocalDateString(targetDate));
        // Credit card purchases are usually "Pending" payment until bill is paid
        setIsPaid(false);
      }
    }
  }, [selectedSourceType, selectedSourceId, cards, editingTransaction]);

  useEffect(() => {
    if (!editingTransaction) {
      setSubCategoryId(undefined);
    }
  }, [categoryId, editingTransaction]);

  useEffect(() => {
    if (!editingTransaction) {
      if (selectedSourceType === 'ACCOUNT') {
        if (!accounts.find(a => a.id === selectedSourceId)) setSelectedSourceId(accounts[0]?.id || '');
      } else {
        if (!cards.find(c => c.id === selectedSourceId)) setSelectedSourceId(cards[0]?.id || '');
      }
    }
  }, [selectedSourceType, accounts, cards, selectedSourceId, editingTransaction]);

  // HAPTIC FEEDBACK HELPER
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // Short 50ms vibration
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) return;

    // Novo usuário pode ainda não ter conta/cartão configurado.
    if (!editingTransaction) {
      if (selectedSourceType === 'ACCOUNT' && (!selectedSourceId || accounts.length === 0)) {
        addToast('Antes de lançar, cadastre uma conta ou carteira em "Contas".', 'INFO');
        return;
      }
      if (selectedSourceType === 'CARD' && (!selectedSourceId || cards.length === 0)) {
        addToast('Antes de lançar no cartão, cadastre um cartão em "Cartões".', 'INFO');
        return;
      }
    }

    triggerHaptic(); // Vibrate on submit

    const baseAmount = parseFloat(amount);

    // IF EDITING
    if (editingTransaction) {
      const updates: Partial<Transaction> = {
        amount: baseAmount,
        description,
        date: dateStringToLocalISO(isPaid ? paymentDate : dueDate),
        paymentDate: isPaid ? dateStringToLocalISO(paymentDate) : undefined,
        type,
        categoryId,
        subCategoryId,
        accountId: selectedSourceType === 'ACCOUNT' ? selectedSourceId : undefined,
        cardId: selectedSourceType === 'CARD' ? selectedSourceId : undefined,
        isPending: !isPaid
      };
      updateTransaction(editingTransaction.id, updates);
      onClose();
      return;
    }

    // IF CREATING NEW
    const transactionsToCreate: Transaction[] = [];
    const groupId = uuidv4();

    if (frequency === 'SINGLE') {
      transactionsToCreate.push({
        id: uuidv4(),
        amount: baseAmount,
        description,
        date: dateStringToLocalISO(isPaid ? paymentDate : dueDate),
        paymentDate: isPaid ? dateStringToLocalISO(paymentDate) : undefined,
        type,
        categoryId,
        subCategoryId,
        accountId: selectedSourceType === 'ACCOUNT' ? selectedSourceId : undefined,
        cardId: selectedSourceType === 'CARD' ? selectedSourceId : undefined,
        frequency: 'SINGLE',
        isPending: !isPaid
      });
    }
    else if (frequency === 'INSTALLMENT') {
      const installmentValue = baseAmount / totalInstallments;
      for (let i = 0; i < totalInstallments; i++) {
        const installmentDueDate = parseLocalDateString(dueDate);
        installmentDueDate.setMonth(installmentDueDate.getMonth() + i);

        transactionsToCreate.push({
          id: uuidv4(),
          amount: parseFloat(installmentValue.toFixed(2)),
          description: `${description} (${i + 1}/${totalInstallments})`,
          date: dateStringToLocalISO(toLocalDateString(installmentDueDate)),
          type,
          categoryId,
          subCategoryId,
          accountId: selectedSourceType === 'ACCOUNT' ? selectedSourceId : undefined,
          cardId: selectedSourceType === 'CARD' ? selectedSourceId : undefined,
          frequency: 'INSTALLMENT',
          installmentId: groupId,
          installments: {
            current: i + 1,
            total: totalInstallments
          },
          isPending: !isPaid
        });
      }
    }
    else if (frequency === 'RECURRING') {
      for (let i = 0; i < recurringMonths; i++) {
        const recurringDate = parseLocalDateString(dueDate);
        recurringDate.setMonth(recurringDate.getMonth() + i);

        transactionsToCreate.push({
          id: uuidv4(),
          amount: baseAmount,
          description: i === 0 ? description : `${description} (Recorrente)`,
          date: dateStringToLocalISO(toLocalDateString(recurringDate)),
          type,
          categoryId,
          subCategoryId,
          accountId: selectedSourceType === 'ACCOUNT' ? selectedSourceId : undefined,
          cardId: selectedSourceType === 'CARD' ? selectedSourceId : undefined,
          frequency: 'RECURRING',
          isPending: !isPaid
        });
      }
    }

    addMultipleTransactions(transactionsToCreate);
    onClose();
  };

  const handleDelete = () => {
    triggerHaptic();
    if (editingTransaction) {
      deleteTransaction(editingTransaction.id);
      onClose();
    }
  };

  const showPicker = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // Try/Catch to safely handle browser variance on showPicker support
    try {
      if (e.currentTarget && 'showPicker' in e.currentTarget) {
        (e.currentTarget as any).showPicker();
      }
    } catch (error) { }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-0 sm:p-4">

      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        /* Custom calendar indicator fix if needed, but showPicker is preferred */
      `}</style>

      {/* Mobile-Safe Layout */}
      <div className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl animate-slide-up flex flex-col max-h-[100dvh] sm:max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{editingTransaction ? 'Atualize os detalhes' : 'Registre suas movimentações'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-8 flex-1 no-scrollbar pb-32 sm:pb-6">

          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${type === TransactionType.EXPENSE ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Saída
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${type === TransactionType.INCOME ? 'bg-white text-brand-green shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Entrada
            </button>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col items-center justify-center py-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Valor do Lançamento</label>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-slate-300 pb-2">R$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-48 text-5xl font-bold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200 text-center tracking-tight"
                step="0.01"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block ml-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === TransactionType.EXPENSE ? "Ex: Mercado, Aluguel..." : "Ex: Salário, Freelance..."}
              className="w-full bg-slate-50 p-4 rounded-xl text-slate-700 font-medium border border-transparent focus:bg-white focus:border-brand-lime focus:ring-4 focus:ring-brand-lime/10 focus:outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* === STATUS & DATES SECTION === */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">

            {/* Status Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                {isPaid ? (
                  <CheckCircle2 size={20} className="text-brand-green" />
                ) : (
                  <Clock size={20} className="text-slate-400" />
                )}
                <span className="text-sm font-bold text-slate-700">
                  {isPaid ? (type === TransactionType.EXPENSE ? 'Pago' : 'Recebido') : (type === TransactionType.EXPENSE ? 'Pendente' : 'A receber')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPaid(!isPaid)}
                className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center p-1 ${isPaid ? 'bg-brand-green' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isPaid ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Date Inputs Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">
                  {type === TransactionType.EXPENSE ? 'Vencimento' : 'Previsão'}
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onClick={showPicker}
                    onFocus={showPicker}
                    className="w-full bg-white p-3 pr-8 rounded-xl text-sm font-medium text-slate-700 border border-slate-200 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/10 cursor-pointer appearance-none relative z-10"
                  />
                  <CalendarDays size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none z-20 group-hover:text-brand-deep transition-colors" />
                </div>
              </div>

              {isPaid ? (
                <div className="col-span-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-brand-green uppercase tracking-wide mb-1.5 block">
                    {type === TransactionType.EXPENSE ? 'Data Pagamento' : 'Data Recebimento'}
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      onClick={showPicker}
                      onFocus={showPicker}
                      className="w-full bg-green-50 p-3 pr-8 rounded-xl text-sm font-bold text-green-700 border border-green-200 focus:outline-none focus:border-green-400 cursor-pointer appearance-none relative z-10"
                    />
                    <CalendarDays size={18} className="absolute right-3 top-3 text-green-500 pointer-events-none z-20" />
                  </div>
                </div>
              ) : (
                <div className="col-span-1 flex items-center justify-center text-slate-300 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  Aguardando...
                </div>
              )}
            </div>
          </div>

          {/* Source Selector */}
          <div className="pb-4">
            <div className="flex gap-6 border-b border-slate-100 mb-4 px-1">
              <button
                type="button"
                onClick={() => setSelectedSourceType('ACCOUNT')}
                className={`text-xs font-bold pb-2 transition-colors ${selectedSourceType === 'ACCOUNT' ? 'text-brand-deep border-b-2 border-brand-lime' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Conta / Carteira
              </button>
              {type === TransactionType.EXPENSE && (
                <button
                  type="button"
                  onClick={() => setSelectedSourceType('CARD')}
                  className={`text-xs font-bold pb-2 transition-colors ${selectedSourceType === 'CARD' ? 'text-brand-deep border-b-2 border-brand-lime' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Cartão de Crédito
                </button>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {selectedSourceType === 'ACCOUNT' ? (
                accounts.length === 0 ? (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 flex items-center justify-between gap-4">
                    <span className="font-medium">
                      Você ainda não tem contas. Cadastre uma para registrar lançamentos.
                    </span>
                    <button
                      type="button"
                      onClick={() => { onClose(); navigate('/accounts'); }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-brand-deep hover:border-brand-lime transition-colors"
                    >
                      Cadastrar conta
                    </button>
                  </div>
                ) : (
                  accounts.map(acc => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedSourceId(acc.id)}
                      className={`flex-shrink-0 relative w-32 p-3 rounded-xl border transition-all text-left ${selectedSourceId === acc.id ? 'border-brand-lime bg-brand-lime/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-slate-400 scale-75 origin-left">{getIcon(acc.icon, 16)}</div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{acc.type === 'WALLET' ? 'Carteira' : 'Banco'}</span>
                      </div>
                      <p className="font-bold text-slate-700 text-xs truncate">{acc.name}</p>
                      {selectedSourceId === acc.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-lime"></div>}
                    </button>
                  ))
                )
              ) : (
                cards.length === 0 ? (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 flex items-center justify-between gap-4">
                    <span className="font-medium">
                      Você ainda não tem cartões. Cadastre um para registrar compras no crédito.
                    </span>
                    <button
                      type="button"
                      onClick={() => { onClose(); navigate('/cards'); }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-brand-deep hover:border-brand-lime transition-colors"
                    >
                      Cadastrar cartão
                    </button>
                  </div>
                ) : (
                  cards.map(card => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedSourceId(card.id)}
                      className={`flex-shrink-0 relative w-36 p-3 rounded-xl border transition-all text-left overflow-hidden ${selectedSourceId === card.id ? 'border-brand-lime ring-1 ring-brand-lime/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${card.colorFrom} ${card.colorTo}`}></div>
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <CreditCard size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{card.brand}</span>
                      </div>
                      <p className="font-bold text-slate-700 text-xs truncate relative z-10">{card.name}</p>
                      {selectedSourceId === card.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-lime z-10"></div>}
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Category & Frequency Below Source (Visual preference) */}
          {/* Category Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block ml-1">Categoria</label>
            <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {activeCategories.length > 0 ? activeCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl border transition-all ${categoryId === cat.id ? 'bg-slate-50 border-slate-200' : 'border-transparent hover:bg-slate-50'}`}
                  >
                    <div className={`p-2 rounded-full ${cat.color} bg-opacity-10 text-opacity-80`}>
                      {getIcon(cat.icon, 18)}
                    </div>
                    <span className={`text-[10px] font-semibold truncate w-full text-center ${categoryId === cat.id ? 'text-slate-800' : 'text-slate-400'}`}>{cat.name}</span>
                  </button>
                )) : (
                  <p className="text-sm text-slate-400 p-4">Nenhuma categoria ativa.</p>
                )}
              </div>

              {selectedCategory && selectedCategory.subcategories.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-50 flex flex-wrap gap-2 px-1">
                  {selectedCategory.subcategories.filter(s => s.isActive !== false).map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubCategoryId(subCategoryId === sub.id ? undefined : sub.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border ${subCategoryId === sub.id
                          ? 'bg-brand-deep text-white border-brand-deep shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Frequency Control */}
          <div className={editingTransaction && editingTransaction.frequency !== 'SINGLE' ? 'opacity-50 pointer-events-none' : ''}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 block ml-1">Frequência</label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setFrequency('SINGLE')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${frequency === 'SINGLE' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                Única
              </button>
              <button
                type="button"
                onClick={() => setFrequency('INSTALLMENT')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${frequency === 'INSTALLMENT' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                Parcelada
              </button>
              <button
                type="button"
                onClick={() => setFrequency('RECURRING')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${frequency === 'RECURRING' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                Recorrente
              </button>
            </div>

            {/* Frequency Settings */}
            <div className="mt-3">
              {frequency === 'INSTALLMENT' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between animate-slide-up">
                  <span className="text-sm font-medium text-slate-600">Número de parcelas:</span>
                  <div className="relative w-24">
                    <select
                      value={totalInstallments}
                      onChange={(e) => setTotalInstallments(Number(e.target.value))}
                      className="w-full bg-white p-2 rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:outline-none appearance-none text-center"
                    >
                      {[2, 3, 4, 5, 6, 9, 10, 12, 18, 24, 36, 48].map(n => <option key={n} value={n}>{n}x</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-3 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              )}
              {frequency === 'RECURRING' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3 animate-slide-up">
                  <Repeat size={18} className="text-slate-400" />
                  <span className="text-xs text-slate-500 leading-tight">
                    Esta transação se repetirá mensalmente por <strong>12 meses</strong> (padrão). Você pode editar ou parar a recorrência depois.
                  </span>
                </div>
              )}
            </div>
          </div>

        </form>

        {/* Footer - Fixed at bottom for Mobile Safety */}
        <div className="p-6 bg-white border-t border-slate-50 shrink-0 safe-area-bottom flex gap-3">
          {editingTransaction && (
            <button
              onClick={handleDelete}
              className="p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors"
              title="Excluir Lançamento"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!amount || !description}
            className="flex-1 bg-brand-deep text-brand-lime py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-brand-deep/95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingTransaction ? 'Salvar Alterações' : 'Confirmar'}
            {frequency === 'INSTALLMENT' && !editingTransaction && <span className="text-brand-lime/60 font-medium">({totalInstallments}x)</span>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionModal;