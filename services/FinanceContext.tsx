import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Account, AccountType, CreditCard, Transaction, MonthlyStats, TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants';
import { useToast } from '../components/Toast';
import { useAuth } from './AuthContext';
import { buildDefaultCategories, buildDefaultUserSettings, type UserSettings } from './financeDefaults';
import { readUserSettings, writeUserSettings } from './financeStorage';
import { getSupabaseClient } from './supabaseClient';
import { changeTransactionType, createTransactions, deleteTransaction as deleteTransactionRemote, fetchActiveOrgId, fetchTransactions, upsertTransactions } from './financeTransactionsSupabase';
import { useAccess } from './AccessContext';
import { deleteAccount as deleteAccountRemote, deleteCard as deleteCardRemote, fetchAccounts, fetchCards, fetchCategories, upsertAccount, upsertCard, upsertCategory, archiveCategory, upsertSubCategory, deleteSubCategory as deleteSubCategoryRemote } from './financeEntitiesSupabase';
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
  addTransaction: (transaction: Transaction) => Promise<void>;
  addMultipleTransactions: (transactions: Transaction[], eventKey?: string) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  toggleTransactionStatus: (id: string) => Promise<void>;

  // Accounts CRUD
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Cards CRUD
  addCard: (card: CreditCard) => Promise<void>;
  updateCard: (id: string, updates: Partial<CreditCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;

  // Category Actions
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void; // Soft delete
  addSubCategory: (categoryId: string, name: string) => void;
  updateSubCategory: (categoryId: string, subId: string, updates: Partial<{ name: string; isActive: boolean }>) => void;
  deleteSubCategory: (categoryId: string, subId: string) => void;

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
  const { refreshAccess } = useAccess();
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

  // Lançamentos também podem chegar por canais externos (WhatsApp/n8n).
  // Mantém os saldos e a lista do site sincronizados sem exigir recarregar a página.
  useEffect(() => {
    if (!supabase || !user?.id || !activeOrgId) return;

    let cancelled = false;
    let refreshing = false;

    const refreshExternalChanges = async () => {
      if (cancelled || refreshing || document.visibilityState === 'hidden') return;
      refreshing = true;
      try {
        const [txs, accs] = await Promise.all([
          fetchTransactions({ supabase, orgId: activeOrgId }),
          fetchAccounts({ supabase, orgId: activeOrgId }),
        ]);
        if (!cancelled) {
          setTransactions(txs);
          setAccounts(accs);
        }
      } catch {
        // A carga inicial continua sendo responsável por exibir erros.
        // Uma falha transitória de sincronização não deve interromper a navegação.
      } finally {
        refreshing = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshExternalChanges();
    };

    const handleFocus = () => void refreshExternalChanges();
    const intervalId = window.setInterval(() => void refreshExternalChanges(), 10_000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeOrgId, supabase, user?.id]);

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

  // Helper: retorna a conta principal; preserva o fallback legado para bases ainda não migradas.
  const getDefaultAccountId = (): string | undefined => {
    const configured = accounts.find(account => account.isDefault === true);
    if (configured) return configured.id;
    const wallet = accounts.find(a => a.type === AccountType.WALLET);
    if (wallet) return wallet.id;
    return accounts.length > 0 ? accounts[0].id : undefined;
  };

  // Helper to process balance impacts
  const applyTransactionImpact = (t: Transaction, reverse: boolean = false) => {
    if (t.isPending) return; // Pending transactions don't affect balance yet

    const multiplier = reverse ? -1 : 1;

    // 1. Account Balance Impact
    // Se não tem accountId E não é transação de cartão, debita da conta padrão (WALLET)
    const effectiveAccountId = t.accountId || (!t.cardId ? getDefaultAccountId() : undefined);

    if (effectiveAccountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === effectiveAccountId) {
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

  const addTransaction = async (newTransaction: Transaction) => {
    await addMultipleTransactions([newTransaction]);
  };

  const addMultipleTransactions = async (newTransactions: Transaction[], eventKey?: string) => {
    const defaultAccId = getDefaultAccountId();

    const processedTransactions = newTransactions.map(t => {
      // Se não tem accountId nem cardId, atribui conta padrão (WALLET)
      const withDefault = (!t.accountId && !t.cardId && defaultAccId)
        ? { ...t, accountId: defaultAccId }
        : t;

      // Advanced Credit Card Logic: Calculate Payment Date based on Closing Day
      if (withDefault.cardId && withDefault.type === TransactionType.EXPENSE) {
        const card = cards.find(c => c.id === withDefault.cardId);
        if (card) {
          const transDate = parseLocalDateString(isoToLocalDateString(withDefault.date));
          const closingDay = card.closingDay;

          // If transaction happened AFTER or ON closing day, it goes to next month
          let billDate = new Date(transDate);
          if (transDate.getDate() >= closingDay) {
            billDate.setMonth(billDate.getMonth() + 1);
          }

          // Set the payment date to the Due Day of the calculated bill month
          billDate.setDate(card.dueDay);

          return {
            ...withDefault,
            paymentDate: dateStringToLocalISO(toLocalDateString(billDate))
          };
        }
      }
      return withDefault;
    });

    if (!supabase || !user?.id || !activeOrgId) {
      const message = user?.id
        ? 'Seu espaço ainda não está pronto para salvar lançamentos.'
        : 'Faça login para salvar seus lançamentos.';
      addToast(message, 'ERROR');
      throw new Error(message);
    }

    try {
      const result = await createTransactions({ supabase, orgId: activeOrgId, transactions: processedTransactions, eventKey });
      if (!result.ok || result.failed_count > 0) throw new Error(result.failed[0]?.error || 'Falha ao salvar lançamento.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não consegui salvar seus lançamentos.';
      addToast(message, 'ERROR');
      throw err;
    }

    setTransactions(prev => [...processedTransactions, ...prev]);
    processedTransactions.forEach(t => applyTransactionImpact(t));
    void refreshAccess();

    if (newTransactions.length === 1) {
      addToast('Lançamento adicionado com sucesso!');
    } else {
      addToast(`${newTransactions.length} lançamentos adicionados!`);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const oldTransaction = transactions.find(t => t.id === id);
    if (!oldTransaction) return;
    if (!supabase || !user?.id || !activeOrgId) throw new Error('Seu espaço ainda não está pronto.');
    const updatedTransaction = { ...oldTransaction, ...updates };
    try {
      if (oldTransaction.type !== updatedTransaction.type) {
        const displayId = Number((oldTransaction as any).displayId ?? (oldTransaction as any).display_id);
        if (!Number.isInteger(displayId) || displayId < 1) {
          throw new Error('Este lançamento não possui um código exibido válido para alteração.');
        }
        await changeTransactionType({
          supabase,
          orgId: activeOrgId,
          displayId,
          type: updatedTransaction.type,
          categoryId: updatedTransaction.categoryId,
          subCategoryId: updatedTransaction.subCategoryId,
          accountId: updatedTransaction.accountId,
          cardId: updatedTransaction.cardId,
          expectedUpdatedAt: (oldTransaction as any).updatedAt,
        });
      } else {
        await upsertTransactions({ supabase, orgId: activeOrgId, userId: user.id, transactions: [updatedTransaction] });
      }
      applyTransactionImpact(oldTransaction, true);
      applyTransactionImpact(updatedTransaction, false);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      addToast('Lançamento atualizado.');
    } catch (err) {
      addToast('Não consegui salvar a atualização no Supabase.', 'ERROR');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    if (!supabase || !user?.id || !activeOrgId) throw new Error('Seu espaço ainda não está pronto.');
    try {
      await deleteTransactionRemote({ supabase, orgId: activeOrgId, id });
      applyTransactionImpact(transactionToDelete, true);
      setTransactions(prev => prev.filter(t => t.id !== id));
      addToast('Lançamento excluído.', 'INFO');
    } catch (err) {
      addToast('Não consegui excluir o lançamento no Supabase.', 'ERROR');
      throw err;
    }
  };

  const toggleTransactionStatus = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // We are essentially updating the isPending status
    // The logic inside updateTransaction handles the balance reversal/apply
    const newStatus = !transaction.isPending;

    await updateTransaction(id, {
      isPending: newStatus,
      paymentDate: !newStatus ? (transaction.paymentDate || dateStringToLocalISO(getTodayString())) : undefined
    });

    if (!newStatus) addToast('Transação marcada como paga!');
    else addToast('Transação marcada como pendente.', 'INFO');
  };

  // --- Accounts CRUD ---
  const addAccount = (account: Account) => {
    const accountToSave = { ...account, isDefault: account.isDefault === true || accounts.length === 0 };
    setAccounts(prev => accountToSave.isDefault
      ? [...prev.map(item => ({ ...item, isDefault: false })), accountToSave]
      : [...prev, accountToSave]);
    addToast('Conta bancária adicionada!');

    if (supabase && user?.id && activeOrgId) {
      void upsertAccount({ supabase, orgId: activeOrgId, account: accountToSave }).catch(() => {
        addToast('Não consegui salvar a conta no Supabase.', 'ERROR');
        setAccounts((prev) => prev.filter((a) => a.id !== accountToSave.id));
      });
    }
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const current = accounts.find(account => account.id === id);
    if (!current) return;
    const updatedForRemote = { ...current, ...updates };
    setAccounts(prev => prev.map(account => {
      if (updates.isDefault === true && account.id !== id) return { ...account, isDefault: false };
      return account.id === id ? updatedForRemote : account;
    }));
    addToast('Conta atualizada com sucesso!');

    if (supabase && user?.id && activeOrgId) {
      void upsertAccount({ supabase, orgId: activeOrgId, account: updatedForRemote, preserveBalance: true }).catch(() => {
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
  const addCard = async (card: CreditCard) => {
    if (!supabase || !user?.id || !activeOrgId) throw new Error('Seu espaço ainda não está pronto.');
    try {
      await upsertCard({ supabase, orgId: activeOrgId, card });
      setCards(prev => [...prev, card]);
      addToast('Cartão adicionado com sucesso!');
      void refreshAccess();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Não consegui salvar o cartão.', 'ERROR');
      throw err;
    }
  };

  const updateCard = async (id: string, updates: Partial<CreditCard>) => {
    const current = cards.find(c => c.id === id);
    if (!current) return;
    if (!supabase || !user?.id || !activeOrgId) throw new Error('Seu espaço ainda não está pronto.');
    const next = { ...current, ...updates };
    try {
      await upsertCard({ supabase, orgId: activeOrgId, card: next });
      setCards(prev => prev.map(c => c.id === id ? next : c));
      addToast('Cartão atualizado!');
    } catch (err) {
      addToast('Não consegui salvar a atualização do cartão no Supabase.', 'ERROR');
      throw err;
    }
  };

  const deleteCard = async (id: string) => {
    if (!supabase || !user?.id || !activeOrgId) throw new Error('Seu espaço ainda não está pronto.');
    try {
      await deleteCardRemote({ supabase, orgId: activeOrgId, id });
      setCards(prev => prev.filter(c => c.id !== id));
      addToast('Cartão removido.', 'INFO');
      void refreshAccess();
    } catch (err) {
      addToast('Não consegui excluir o cartão no Supabase.', 'ERROR');
      throw err;
    }
  };

  // --- Category Actions ---
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
    addToast('Categoria criada!');

    if (supabase && user?.id && activeOrgId) {
      void upsertCategory({ supabase, orgId: activeOrgId, category }).catch(() => {
        addToast('Não consegui salvar a categoria no Supabase.', 'ERROR');
        setCategories(prev => prev.filter(c => c.id !== category.id));
      });
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    let updatedCategory: Category | undefined;

    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        updatedCategory = { ...cat, ...updates };
        return updatedCategory;
      }
      return cat;
    }));
    addToast('Categoria atualizada!');

    if (supabase && user?.id && activeOrgId && updatedCategory) {
      const cat = updatedCategory;
      void upsertCategory({ supabase, orgId: activeOrgId, category: cat }).catch(() => {
        addToast('Não consegui salvar a atualização da categoria.', 'ERROR');
      });
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, isActive: false } : cat
    ));
    addToast('Categoria arquivada.', 'INFO');

    if (supabase && user?.id && activeOrgId) {
      void archiveCategory({ supabase, orgId: activeOrgId, id }).catch(() => {
        addToast('Não consegui arquivar a categoria no Supabase.', 'ERROR');
        setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, isActive: true } : cat));
      });
    }
  };

  const addSubCategory = (categoryId: string, name: string) => {
    const newSub = { id: crypto.randomUUID(), name, isActive: true };
    let parentCategory: Category | undefined;

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        parentCategory = cat;
        return { ...cat, subcategories: [...cat.subcategories, newSub] };
      }
      return cat;
    }));
    addToast('Subcategoria adicionada.');

    if (supabase && user?.id && activeOrgId && parentCategory) {
      const parent = parentCategory;
      void upsertSubCategory({
        supabase,
        orgId: activeOrgId,
        parentId: categoryId,
        subCategory: newSub,
        parentIcon: parent.icon,
        parentColor: parent.color,
      }).catch(() => {
        addToast('Não consegui salvar a subcategoria no Supabase.', 'ERROR');
        setCategories(p => p.map(cat =>
          cat.id === categoryId
            ? { ...cat, subcategories: cat.subcategories.filter(s => s.id !== newSub.id) }
            : cat
        ));
      });
    }
  };

  const updateSubCategory = (categoryId: string, subId: string, updates: Partial<{ name: string; isActive: boolean }>) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, subcategories: cat.subcategories.map(s => s.id === subId ? { ...s, ...updates } : s) }
        : cat
    ));
  };

  const deleteSubCategory = (categoryId: string, subId: string) => {
    let removedSub: { id: string; name: string; isActive?: boolean } | undefined;

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        removedSub = cat.subcategories.find(s => s.id === subId);
        return { ...cat, subcategories: cat.subcategories.filter(s => s.id !== subId) };
      }
      return cat;
    }));

    if (supabase && user?.id && activeOrgId && removedSub) {
      const sub = removedSub;
      void deleteSubCategoryRemote({ supabase, orgId: activeOrgId, id: subId }).catch(() => {
        addToast('Não consegui remover a subcategoria no Supabase.', 'ERROR');
        if (sub) {
          setCategories(prev => prev.map(cat =>
            cat.id === categoryId
              ? { ...cat, subcategories: [...cat.subcategories, sub] }
              : cat
          ));
        }
      });
    }
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
    updateSubCategory,
    deleteSubCategory,
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
