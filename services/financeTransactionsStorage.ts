import type { Transaction } from '../types';

function transactionsKeyForUser(userId: string) {
  return `joaoai:transactions:${userId}`;
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readUserTransactions(params: { userId: string; fallback?: Transaction[] }): Transaction[] {
  const key = transactionsKeyForUser(params.userId);
  const saved = safeJsonParse<Transaction[]>(localStorage.getItem(key));
  return saved ?? params.fallback ?? [];
}

export function writeUserTransactions(params: { userId: string; transactions: Transaction[] }) {
  const key = transactionsKeyForUser(params.userId);
  localStorage.setItem(key, JSON.stringify(params.transactions));
}


