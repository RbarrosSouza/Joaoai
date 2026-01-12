
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum AccountType {
  CHECKING = 'CHECKING', // Conta Corrente
  WALLET = 'WALLET',     // Carteira Física
  SAVINGS = 'SAVINGS',   // Poupança
  INVESTMENT = 'INVESTMENT', // Investimentos
}

export type TransactionFrequency = 'SINGLE' | 'RECURRING' | 'INSTALLMENT';

export interface CreditCard {
  id: string;
  name: string;
  brand: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  currentBill: number;
  colorFrom: string;
  colorTo: string;
}

export interface Account {
  id: string;
  name: string;
  bankName?: string; // Ex: Nubank, Itaú
  type: AccountType;
  balance: number;
  icon: string;
  // Visual props
  colorFrom: string;
  colorTo: string;
  textColor?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind classes like 'bg-red-100 text-red-600'
  budget?: number; // Deprecated in favor of monthlyBudgets, kept for fallback
  monthlyBudgets?: Record<string, number>; // Key format: 'YYYY-MM' (ex: '2026-01')
  subcategories: SubCategory[];
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO Date string (Used as Due Date/Competence)
  paymentDate?: string; // ISO Date string (Used for Cash Flow if paid)
  type: TransactionType;
  categoryId: string;
  subCategoryId?: string; // Optional subcategory
  accountId?: string; // If paid with account
  cardId?: string; // If paid with credit card
  
  // New fields for logic
  frequency: TransactionFrequency;
  installmentId?: string; // To group installments of the same purchase
  installments?: {
    current: number;
    total: number;
  };
  isPending: boolean;
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  balance: number;
}
