import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Account, CreditCard, Transaction, MonthlyStats, TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants';
import { useToast } from '../components/Toast';
import { useAuth } from './AuthContext';
import { buildDefaultCategories, buildDefaultUserSettings, type UserSettings } from './financeDefaults';
import { readUserSettings, writeUserSettings } from './financeStorage';
import { getSupabaseClient } from './supabaseClient';
import { deleteTransaction as deleteTransactionRemote, fetchActiveOrgId, fetchTransactions, upsertTransactions } from './financeTransactionsSupabase';
import { deleteAccount as deleteAccountRemote, deleteCard as deleteCardRemote, fetchAccounts, fetchCards, fetchCategories, upsertAccount, upsertCard } from './financeEntitiesSupabase';
import { parseLocalDateString, isoToLocalDateString, toLocalDateString, dateStringToLocalISO, getTodayString } from '../utils/dateUtils';

function getAuthDisplayName(user: any): string {
  const md = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const candidates = [
    md.name,
    md.display_name,
    md.full_name,
    md.first_name,
  ];
  const name = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
  // IMPORTANT: não inventar nome genérico. Se não houver, deixa vazio e a UI não mostra “, João”.
  return typeof name === 'string' ? name.trim() : '';
}

interface FinanceContextType {
  accounts: Account[];
  cards: CreditCard[];
  transactions: Transaction[];
  categories: Category[];
  userSettings: UserSettings;

  // Transactions
  addTransaction: (transaction: Transaction) => void;
  addMultipleTransactions: (transactions: Transaction[]) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleTransactionStatus: (id: string) => void;

  // Accounts CRUD
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Cards CRUD
  addCard: (card: CreditCard) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  deleteCard: (id: string) => void;

  // Category Actions
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void; // Soft delete
  addSubCategory: (categoryId: string, name: string) => void;

  // Budget Planning Logic
  setCategoryBudget: (categoryId: string, amount: number, month: Date, applyToFuture: boolean) => void;

  // User Settings
  updateUserSettings: (updates: Partial<UserSettings>) => void;

  getMonthlyStats: () => MonthlyStats & { expectedIncome: number, expectedExpenses: number };
  totalBalance: number;

  // UX State
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const userId = user?.id ?? 'anonymous';
  const supabase = getSupabaseClient();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  // Novo usuário deve iniciar sempre vazio.
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(() => buildDefaultCategories(CATEGORIES));

  // User Profile & Settings State (with Persistence)
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const fallback = buildDefaultUserSettings({
      name: getAuthDisplayName(user),
      email: user?.email ?? '',
    });
    return readUserSettings({ userId, userEmail: user?.email, fallback });
  });

  // Persist Settings Effect
  useEffect(() => {
    writeUserSettings({ userId, settings: userSettings });
  }, [userId, userSettings]);

  useEffect(() => {
    let cancelled = false;
    async function loadFromSupabase() {
      if (!supabase || !user?.id) {
        setActiveOrgId(null);
        setAccounts([]);
        setCards([]);
        setTransactions([]);
        return;
      }
      try {
        const orgId = await fetchActiveOrgId({ supabase, userId: user.id });
        if (cancelled) return;
        setActiveOrgId(orgId);
        if (!orgId) {
          setAccounts([]);
          setCards([]);
          setTransactions([]);
          return;
        }
        const [txs, accs, cds, cats] = await Promise.all([
          fetchTransactions({ supabase, orgId }),
          fetchAccounts({ supabase, orgId }),
          fetchCards({ supabase, orgId }),
          fetchCategories({ supabase, orgId }),
        ]);
        if (cancelled) return;
        setTransactions(txs);
        setAccounts(accs);
        setCards(cds);
        if (cats.length > 0) {
          setCategories(cats);
        }
      } catch (err) {
        if (!cancelled) addToast('Não consegui carregar seus lançamentos do Supabase.', 'ERROR');
      }
    }
    void loadFromSupabase();
    return () => {
      cancelled = true;
    };
  }, [addToast, supabase, user?.id]);

  // Mantém nome/e-mail coerentes com o cadastro (sem sobrescrever se o usuário personalizou depois).
  useEffect(() => {
    if (!user) return;
    const authName = getAuthDisplayName(user);
    const authEmail = user.email ?? '';
    setUserSettings((prev) => {
      const next = { ...prev };
      if (!next.name?.trim() && authName) next.name = authName;
      if (!next.email?.trim() && authEmail) next.email = authEmail;
      return next;
    });
  }, [user]);

  // Privacy Mode State (Default false for Visibility First)
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => !prev);
  };

  const updateUserSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...updates }));
    // Toast removed here to avoid spamming when toggling switches quickly
    // addToast('Configurações atualizadas', 'INFO'); 
  };

  // --- Transactions Logic ---

  // Helper to process balance impacts
  const applyTransactionImpact = (t: Transaction, reverse: boolean = false) => {
    if (t.isPending) return; // Pending transactions don't affect balance yet

    const multiplier = reverse ? -1 : 1;

    // 1. Account Balance Impact
    if (t.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === t.accountId) {
          // If Income: Add. If Expense: Subtract.
          // Reverse logic handles the undoing.
          const amountChange = (t.type === TransactionType.INCOME ? t.amount : -t.amount) * multiplier;
          return { ...acc, balance: acc.balance + amountChange };
        }
        return acc;
      }));
    }

    // 2. Credit Card Bill Impact (Only Expenses increase bill)
    if (t.cardId && t.type === TransactionType.EXPENSE) {
      setCards(prev => prev.map(card => {
        if (card.id === t.cardId) {
          const amountChange = t.amount * multiplier;
          return { ...card, currentBill: card.currentBill + amountChange };
        }
        return card;
      }));
    }
  };

  const addTransaction = (newTransaction: Transaction) => {
    addMultipleTransactions([newTransaction]);
  };

  const addMultipleTransactions = (newTransactions: Transaction[]) => {
    const processedTransactions = newTransactions.map(t => {
      // Advanced Credit Card Logic: Calculate Payment Date based on Closing Day
      if (t.cardId && t.type === TransactionType.EXPENSE) {
        const card = cards.find(c => c.id === t.cardId);
        if (card) {
          const transDate = parseLocalDateString(isoToLocalDateString(t.date));
          const closingDay = card.closingDay;

          // If transaction happened AFTER or ON closing day, it goes to next month
          let billDate = new Date(transDate);
          if (transDate.getDate() >= closingDay) {
            billDate.setMonth(billDate.getMonth() + 1);
          }

          // Set the payment date to the Due Day of the calculated bill month
          billDate.setDate(card.dueDay);

          return {
            ...t,
            paymentDate: dateStringToLocalISO(toLocalDateString(billDate))
          };
        }
      }
      return t;
    });

    setTransactions(prev => [...processedTransactions, ...prev]);

    // Apply impact for each new transaction
    processedTransactions.forEach(t => applyTransactionImpact(t));

    // Persistência via Supabase
    if (supabase && user?.id && activeOrgId) {
      void upsertTransactions({ supabase, orgId: activeOrgId, userId: user.id, transactions: processedTransactions }).catch(() => {
        addToast('Não consegui salvar seus lançamentos no Supabase. Tente novamente.', 'ERROR');
      });
    } else if (user?.id) {
      addToast('Supabase não configurado para salvar lançamentos. Verifique a conexão.', 'ERROR');
    } else {
      addToast('Faça login para salvar seus lançamentos definitivamente.', 'INFO');
    }

    if (newTransactions.length === 1) {
      addToast('Lançamento adicionado com sucesso!');
    } else {
      addToast(`${newTransactions.length} lançamentos adicionados!`);
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    let updatedForRemote: Transaction | null = null;
    setTransactions(prev => {
      const oldTransaction = prev.find(t => t.id === id);
      if (!oldTransaction) return prev;

      // 1. Revert impact of old transaction
      applyTransactionImpact(oldTransaction, true); // Reverse = true

      // 2. Create new transaction object
      const newTransaction = { ...oldTransaction, ...updates };
      updatedForRemote = newTransaction;

      // 3. Apply impact of new transaction
      applyTransactionImpact(newTransaction, false);

      return prev.map(t => t.id === id ? newTransaction : t);
    });
    addToast('Lançamento atualizado.');

    if (supabase && user?.id && activeOrgId) {
      if (updatedForRemote) {
        void upsertTransactions({ supabase, orgId: activeOrgId, userId: user.id, transactions: [updatedForRemote] }).catch(() => {
          addToast('Não consegui salvar a atualização no Supabase.', 'ERROR');
        });
      }
    }
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      // Revert impact before deleting
      applyTransactionImpact(transactionToDelete, true);

      setTransactions(prev => prev.filter(t => t.id !== id));
      addToast('Lançamento excluído.', 'INFO');
    }

    if (supabase && user?.id && activeOrgId) {
      void deleteTransactionRemote({ supabase, orgId: activeOrgId, id }).catch(() => {
        addToast('Não consegui excluir o lançamento no Supabase.', 'ERROR');
      });
    }
  };

  const toggleTransactionStatus = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // We are essentially updating the isPending status
    // The logic inside updateTransaction handles the balance reversal/apply
    const newStatus = !transaction.isPending;

    updateTransaction(id, {
      isPending: newStatus,
      paymentDate: !newStatus ? (transaction.paymentDate || dateStringToLocalISO(getTodayString())) : undefined
    });

    if (!newStatus) addToast('Transação marcada como paga!');
    else addToast('Transação marcada como pendente.', 'INFO');
  };

  // --- Accounts CRUD ---
  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);
    addToast('Conta bancária adicionada!');

    if (supabase && user?.id && activeOrgId) {
      void upsertAccount({ supabase, orgId: activeOrgId, account }).catch(() => {
        addToast('Não consegui salvar a conta no Supabase.', 'ERROR');
        setAccounts((prev) => prev.filter((a) => a.id !== account.id));
      });
    }
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    let updatedForRemote: Account | null = null;
    setAccounts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next = { ...a, ...updates };
      updatedForRemote = next;
      return next;
    }));
    addToast('Conta atualizada com sucesso!');

    if (supabase && user?.id && activeOrgId && updatedForRemote) {
      void upsertAccount({ supabase, orgId: activeOrgId, account: updatedForRemote }).catch(() => {
        addToast('Não consegui salvar a atualização da conta no Supabase.', 'ERROR');
      });
    }
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    addToast('Conta removida.', 'INFO');

    if (supabase && user?.id && activeOrgId) {
      void deleteAccountRemote({ supabase, orgId: activeOrgId, id }).catch(() => {
        addToast('Não consegui excluir a conta no Supabase.', 'ERROR');
      });
    }
  };

  // --- Cards CRUD ---
  const addCard = (card: CreditCard) => {
    setCards(prev => [...prev, card]);
    addToast('Cartão adicionado com sucesso!');

    if (supabase && user?.id && activeOrgId) {
      void upsertCard({ supabase, orgId: activeOrgId, card }).catch(() => {
        addToast('Não consegui salvar o cartão no Supabase.', 'ERROR');
        setCards((prev) => prev.filter((c) => c.id !== card.id));
      });
    }
  };

  const updateCard = (id: string, updates: Partial<CreditCard>) => {
    let updatedForRemote: CreditCard | null = null;
    setCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = { ...c, ...updates };
      updatedForRemote = next;
      return next;
    }));
    addToast('Cartão atualizado!');

    if (supabase && user?.id && activeOrgId && updatedForRemote) {
      void upsertCard({ supabase, orgId: activeOrgId, card: updatedForRemote }).catch(() => {
        addToast('Não consegui salvar a atualização do cartão no Supabase.', 'ERROR');
      });
    }
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    addToast('Cartão removido.', 'INFO');

    if (supabase && user?.id && activeOrgId) {
      void deleteCardRemote({ supabase, orgId: activeOrgId, id }).catch(() => {
        addToast('Não consegui excluir o cartão no Supabase.', 'ERROR');
      });
    }
  };

  // --- Category Actions ---
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
    addToast('Categoria criada!');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    ));
    addToast('Categoria atualizada!');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, isActive: false } : cat
    ));
    addToast('Categoria arquivada.', 'INFO');
  };

  const addSubCategory = (categoryId: string, name: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newSub = {
          id: `sub_${Date.now()}`,
          name,
          isActive: true
        };
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSub]
        };
      }
      return cat;
    }));
    addToast('Subcategoria adicionada.');
  };

  // --- Budget Logic ---
  const setCategoryBudget = (categoryId: string, amount: number, targetDate: Date, applyToFuture: boolean) => {
    const key = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;

      const updatedMonthlyBudgets = { ...(cat.monthlyBudgets || {}) };
      updatedMonthlyBudgets[key] = amount;

      let newDefaultBudget = cat.budget;

      if (applyToFuture) {
        newDefaultBudget = amount;
      }

      return {
        ...cat,
        budget: newDefaultBudget,
        monthlyBudgets: updatedMonthlyBudgets
      };
    }));

    addToast('Orçamento definido com sucesso!');
  };

  // ------------------------

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = parseLocalDateString(isoToLocalDateString(t.date));
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME && !t.isPending)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE && !t.isPending)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expectedIncome = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expectedExpenses = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      income,
      expenses,
      expectedIncome,
      expectedExpenses,
      balance: income - expenses
    };
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Performance Optimization: Memoize the context value
  const contextValue = useMemo(() => ({
    accounts,
    cards,
    transactions,
    categories,
    userSettings,
    addTransaction,
    addMultipleTransactions,
    updateTransaction,
    deleteTransaction,
    toggleTransactionStatus,
    addAccount,
    updateAccount,
    deleteAccount,
    addCard,
    updateCard,
    deleteCard,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    setCategoryBudget,
    updateUserSettings,
    getMonthlyStats,
    totalBalance,
    isPrivacyMode,
    togglePrivacyMode
  }), [accounts, cards, transactions, categories, userSettings, isPrivacyMode]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const useCategories = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a FinanceProvider');
  }
  return context.categories;
};