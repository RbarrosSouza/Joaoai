import React, { useState, useMemo, useRef } from 'react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { getIcon } from '../constants';
import { TransactionType, Transaction } from '../types';
import { Search, Filter, CalendarClock, CheckCircle2, AlertCircle, Clock, Check, Calendar, ChevronRight, Trash2, RotateCcw } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { parseLocalDateString, isoToLocalDateString } from '../utils/dateUtils';
import { resolveCategory } from '../utils/financeCategoryUtils';

// --- HELPER: Formatting & Date Logic ---

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getRelativeDateLabel = (dateStr: string) => {
    // Usar parseLocalDateString para evitar problemas de timezone
    const target = parseLocalDateString(isoToLocalDateString(dateStr));
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Venceu há ${Math.abs(diffDays)} dias`;
    if (diffDays === 0) return 'Vence Hoje';
    if (diffDays === 1) return 'Vence Amanhã';
    if (diffDays < 7) return `Vence ${target.toLocaleDateString('pt-BR', { weekday: 'long' })}`;
    return target.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
};

// --- COMPONENT: Transaction Item (With Swipe) ---

interface TransactionItemProps {
    t: Transaction;
    statusStyle: 'OVERDUE' | 'URGENT' | 'FUTURE' | 'HISTORY';
    viewMode: 'HISTORY' | 'SCHEDULE';
    onClick: (t: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ t, statusStyle, viewMode, onClick }) => {
    const { toggleTransactionStatus, deleteTransaction } = useFinance();
    const categories = useCategories();

    // Swipe Logic State
    const [swipeOffset, setSwipeOffset] = useState(0);
    const startX = useRef(0);
    const isSwiping = useRef(false);

    const THRESHOLD = 80; // Distance to trigger action

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        isSwiping.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping.current) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;

        // Limit swipe range
        if (viewMode === 'SCHEDULE') {
            // Allow Swipe Left (Complete) and Swipe Right (Delete)
            if (Math.abs(diff) < 150) setSwipeOffset(diff);
        } else {
            // History: Only allow Swipe Right (Delete/Refund)
            if (diff < 0 && diff > -150) setSwipeOffset(diff);
        }
    };

    const handleTouchEnd = () => {
        isSwiping.current = false;

        if (viewMode === 'SCHEDULE') {
            if (swipeOffset > THRESHOLD) {
                // Swiped Right -> Delete
                triggerHaptic();
                deleteTransaction(t.id);
            } else if (swipeOffset < -THRESHOLD) {
                // Swiped Left -> Complete
                triggerHaptic();
                toggleTransactionStatus(t.id);
            }
        } else {
            if (swipeOffset < -THRESHOLD) {
                // Swiped Left in History -> Undo/Delete
                triggerHaptic();
                deleteTransaction(t.id);
            }
        }
        setSwipeOffset(0);
    };

    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const { category: cat, subCategory: resolvedSubCat } = resolveCategory(t.categoryId, categories);
    const subCat = resolvedSubCat || cat?.subcategories?.find(sub => sub.id === t.subCategoryId);
    const isIncome = t.type === TransactionType.INCOME;

    // Styles configuration based on hierarchy
    const styles = {
        OVERDUE: {
            border: 'border-l-4 border-l-red-500 bg-red-50/20',
            dateColor: 'text-red-600 font-bold',
            iconBg: 'bg-red-50 text-red-500',
            amountColor: 'text-red-600'
        },
        URGENT: {
            border: 'border-l-4 border-l-amber-400 bg-amber-50/10',
            dateColor: 'text-amber-600 font-bold',
            iconBg: 'bg-amber-50 text-amber-500',
            amountColor: 'text-slate-700'
        },
        FUTURE: {
            border: 'border-l-4 border-l-transparent hover:border-l-slate-200',
            dateColor: 'text-slate-400 font-medium',
            iconBg: 'bg-slate-50 text-slate-400',
            amountColor: 'text-slate-700'
        },
        HISTORY: {
            border: 'border-l-4 border-l-transparent',
            dateColor: 'text-slate-400',
            iconBg: 'bg-slate-50 text-slate-400',
            amountColor: isIncome ? 'text-brand-green' : 'text-slate-700'
        }
    }[statusStyle];

    return (
        <div className="relative overflow-hidden border-b border-slate-50 last:border-0 bg-slate-100">
            {/* Background Actions */}
            <div className="absolute inset-0 flex justify-between items-center px-6">
                {viewMode === 'SCHEDULE' && (
                    <div className={`flex items-center gap-2 font-bold text-red-500 transition-opacity ${swipeOffset > 30 ? 'opacity-100' : 'opacity-0'}`}>
                        <Trash2 size={20} /> Excluir
                    </div>
                )}
                <div className={`flex items-center gap-2 font-bold transition-opacity ml-auto ${swipeOffset < -30 ? 'opacity-100' : 'opacity-0'} ${viewMode === 'SCHEDULE' ? 'text-brand-green' : 'text-red-500'}`}>
                    {viewMode === 'SCHEDULE' ? (
                        <>Pago <CheckCircle2 size={20} /></>
                    ) : (
                        <>Excluir <Trash2 size={20} /></>
                    )}
                </div>
            </div>

            {/* Foreground Content */}
            <div
                onClick={() => onClick(t)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ transform: `translateX(${swipeOffset}px)` }}
                className={`group relative p-5 transition-transform duration-200 ease-out bg-white hover:bg-slate-50 cursor-pointer ${styles.border}`}
            >
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Icon & Info */}
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg} border border-slate-100/50`}>
                            {getIcon(cat?.icon || 'briefcase', 18)}
                        </div>

                        <div className="flex flex-col min-w-0">
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm text-slate-700 truncate">{t.description}</span>
                                <span className="text-[10px] text-slate-400 truncate hidden sm:inline-block">
                                    {cat?.name} {subCat && `/ ${subCat.name}`}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5">
                                {statusStyle === 'OVERDUE' && <AlertCircle size={10} className="text-red-500" />}
                                {statusStyle === 'URGENT' && <Clock size={10} className="text-amber-500" />}
                                <span className={`text-xs ${styles.dateColor} capitalize`}>
                                    {statusStyle === 'HISTORY'
                                        ? parseLocalDateString(isoToLocalDateString(t.paymentDate || t.date)).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                                        : getRelativeDateLabel(t.date)
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Amount & Action */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                            <span className={`font-bold text-base block ${styles.amountColor}`}>
                                {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                            </span>
                            {t.installments && (
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mt-1">
                                    {t.installments.current}/{t.installments.total}
                                </span>
                            )}
                        </div>

                        {viewMode === 'SCHEDULE' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleTransactionStatus(t.id); }}
                                className="w-9 h-9 rounded-full border border-slate-200 text-slate-300 hover:bg-brand-green hover:border-brand-green hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 hidden sm:flex"
                                title="Marcar como Pago"
                            >
                                <Check size={16} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const TransactionList: React.FC = () => {
    const { transactions } = useFinance();

    // Tab State: 'HISTORY' (Paid) vs 'SCHEDULE' (Pending/Overdue)
    const [viewMode, setViewMode] = useState<'HISTORY' | 'SCHEDULE'>('HISTORY');

    // Modal for Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleEditClick = (t: Transaction) => {
        setEditingTransaction(t);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingTransaction(null);
    };

    // --- DATA GROUPING STRATEGY ---

    const { historyList, scheduleGroups } = useMemo(() => {
        // Helper para comparar datas de forma segura
        const getDateValue = (dateStr: string) => parseLocalDateString(isoToLocalDateString(dateStr)).getTime();

        // 1. Paid History (Flat List)
        const history = transactions
            .filter(t => !t.isPending)
            .sort((a, b) => getDateValue(b.paymentDate || b.date) - getDateValue(a.paymentDate || a.date));

        // 2. Schedule Groups (The new UX)
        const pending = transactions.filter(t => t.isPending);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const overdue: Transaction[] = [];
        const thisWeek: Transaction[] = [];
        const future: Record<string, Transaction[]> = {}; // Grouped by Month Key "YYYY-MM"

        pending.forEach(t => {
            const tDate = parseLocalDateString(isoToLocalDateString(t.date));
            tDate.setHours(0, 0, 0, 0);

            if (t.type === TransactionType.EXPENSE && tDate < today) {
                overdue.push(t);
            } else if (tDate >= today && tDate <= nextWeek) {
                thisWeek.push(t);
            } else {
                // Future Grouping
                const key = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
                if (!future[key]) future[key] = [];
                future[key].push(t);
            }
        });

        // Sort internal lists
        overdue.sort((a, b) => getDateValue(a.date) - getDateValue(b.date)); // Oldest overdue first
        thisWeek.sort((a, b) => getDateValue(a.date) - getDateValue(b.date)); // Soonest first

        // Sort future months keys
        const futureKeys = Object.keys(future).sort();

        return {
            historyList: history,
            scheduleGroups: { overdue, thisWeek, future, futureKeys }
        };
    }, [transactions]);


    return (
        <div className="space-y-6 w-full text-slate-800 pb-20">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">Movimentações</h1>
                    <p className="text-base text-slate-500 font-medium">
                        {viewMode === 'HISTORY' ? 'Histórico definitivo.' : 'Seu fluxo de caixa previsto.'}
                    </p>
                </div>

                {/* Toggle Switch (Segmented Control) */}
                <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex self-start md:self-auto w-full md:w-auto">
                    <button
                        onClick={() => setViewMode('HISTORY')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'HISTORY' ? 'bg-brand-deep text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    >
                        <CheckCircle2 size={16} />
                        <span>Efetivados</span>
                    </button>
                    <button
                        onClick={() => setViewMode('SCHEDULE')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'SCHEDULE' ? 'bg-brand-deep text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    >
                        <div className="relative">
                            <CalendarClock size={16} />
                            {scheduleGroups.overdue.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-brand-deep"></span>}
                        </div>
                        <span>Agendamentos</span>
                    </button>
                </div>
            </div>

            {viewMode === 'SCHEDULE' ? (
                <div className="space-y-8 animate-slide-up">

                    {/* SECTION: OVERDUE (The Fire Extinguisher) */}
                    {scheduleGroups.overdue.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-2 text-red-600 animate-pulse-slow">
                                <AlertCircle size={18} />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Atrasados</h3>
                            </div>
                            <div className="card-base overflow-hidden border-red-100 shadow-float">
                                {scheduleGroups.overdue.map(t => <TransactionItem key={t.id} t={t} statusStyle="OVERDUE" viewMode={viewMode} onClick={handleEditClick} />)}
                            </div>
                        </div>
                    )}

                    {/* SECTION: NEXT 7 DAYS (The Radar) */}
                    {scheduleGroups.thisWeek.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-2 text-amber-600">
                                <Clock size={18} />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Próximos 7 Dias</h3>
                            </div>
                            <div className="card-base overflow-hidden border-amber-100/50">
                                {scheduleGroups.thisWeek.map(t => <TransactionItem key={t.id} t={t} statusStyle="URGENT" viewMode={viewMode} onClick={handleEditClick} />)}
                            </div>
                        </div>
                    )}

                    {/* SECTION: FUTURE (The Horizon) */}
                    <div className="space-y-6">
                        {scheduleGroups.futureKeys.length > 0 ? (
                            scheduleGroups.futureKeys.map(key => {
                                const [year, month] = key.split('-');
                                const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
                                const monthName = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

                                return (
                                    <div key={key} className="space-y-3">
                                        <div className="flex items-center gap-2 px-2 text-slate-400">
                                            <Calendar size={16} />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{monthName}</h3>
                                        </div>
                                        <div className="card-base overflow-hidden">
                                            {scheduleGroups.future[key].map(t => (
                                                <TransactionItem key={t.id} t={t} statusStyle="FUTURE" viewMode={viewMode} onClick={handleEditClick} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            // Empty state only if NO future, NO urgent, NO overdue
                            scheduleGroups.overdue.length === 0 && scheduleGroups.thisWeek.length === 0 && (
                                <div className="text-center py-20 text-slate-400">
                                    <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">Nada pendente no horizonte.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                /* HISTORY MODE (Simple Flat List) */
                <div className="card-base overflow-hidden animate-slide-up min-h-[500px] flex flex-col">
                    {/* Search Header for History */}
                    <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                        <Search size={18} className="text-slate-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Buscar no histórico..."
                            className="flex-1 bg-transparent py-2 text-sm font-medium focus:outline-none placeholder:text-slate-300 text-slate-700"
                        />
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>

                    {historyList.length > 0 ? (
                        <div className="flex-1">
                            {historyList.map(t => <TransactionItem key={t.id} t={t} statusStyle="HISTORY" viewMode={viewMode} onClick={handleEditClick} />)}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-20">
                            <Search size={32} className="mb-3 opacity-50" />
                            <p className="text-sm">Nenhum histórico encontrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal Instance */}
            {isEditModalOpen && editingTransaction && (
                <TransactionModal onClose={handleCloseModal} editingTransaction={editingTransaction} />
            )}

        </div>
    );
};

export default TransactionList;