import type { Category } from '../types';

/**
 * Defaults de um usuário novo devem ser "vazios" (sem orçamentos pré-preenchidos).
 * Mantemos apenas a estrutura base de categorias/subcategorias para o app continuar funcional.
 */
export function buildDefaultCategories(base: Category[]): Category[] {
  return base.map((c) => ({
    ...c,
    // Remove qualquer orçamento default (critério: novo usuário começa sem orçamento)
    budget: undefined,
    monthlyBudgets: undefined,
    // Sanitiza subcategorias
    subcategories: (c.subcategories ?? []).map((s) => ({ ...s, isActive: s.isActive ?? true })),
    isActive: c.isActive ?? true,
  }));
}

export type UserSettings = {
  name: string;
  email: string;
  enableNotifications: boolean;
  notifyBillDue: boolean;
  notifyLimitAlert: boolean;
  notifyOverdue: boolean;
};

export function buildDefaultUserSettings(params: { name?: string; email?: string }): UserSettings {
  return {
    name: (params.name ?? '').trim(),
    email: (params.email ?? '').trim(),
    enableNotifications: true,
    notifyBillDue: true,
    notifyLimitAlert: true,
    notifyOverdue: true,
  };
}


