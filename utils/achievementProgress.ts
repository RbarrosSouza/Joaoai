export interface AchievementProgressDefinition {
  slug: string;
  category: string;
  subcategory: string | null;
  threshold: number;
}

export interface AchievementProgressValue {
  current_value: number;
  unlocked: boolean;
  updated_at?: string | null;
}

const LEVELS = [
  { min: 0, title: 'Novato', icon: '🌱', color: '#94A3B8' },
  { min: 3, title: 'Aprendiz', icon: '📘', color: '#3B82F6' },
  { min: 8, title: 'Praticante', icon: '⚡', color: '#8B5CF6' },
  { min: 15, title: 'Estrategista', icon: '🎯', color: '#EF4444' },
  { min: 25, title: 'Mestre', icon: '👑', color: '#F59E0B' },
  { min: 35, title: 'Lendário', icon: '🏆', color: '#8CB82A' },
];

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
});
const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const nonnegative = (value: number) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;

export function getAchievementDateKey(now = new Date()): string {
  const parts = dateFormatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function getEffectiveStreak(current: number, lastActivity: string | null, now = new Date()): number {
  if (!lastActivity) return 0;
  const today = getAchievementDateKey(now);
  const [year, month, day] = today.split('-').map(Number);
  const yesterday = new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
  return lastActivity === today || lastActivity === yesterday ? nonnegative(current) : 0;
}

export function getAchievementThreshold(definition: AchievementProgressDefinition, now = new Date()): number {
  if (definition.slug !== 'active_days_all') return nonnegative(definition.threshold);
  const [year, month] = getAchievementDateKey(now).split('-').map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getAchievementLevel(totalUnlocked: number) {
  const total = Math.floor(nonnegative(totalUnlocked));
  let index = LEVELS.length - 1;
  while (index > 0 && total < LEVELS[index].min) index -= 1;
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const remaining = next ? next.min - total : 0;
  return {
    ...current,
    level: index + 1,
    pct: next ? ((total - current.min) / (next.min - current.min)) * 100 : 100,
    unlockedMessage: `Você desbloqueou ${total} ${total === 1 ? 'conquista' : 'conquistas'}.`,
    nextMessage: next
      ? `${remaining === 1 ? 'Falta' : 'Faltam'} ${remaining} ${remaining === 1 ? 'conquista' : 'conquistas'} para chegar a ${next.title}.`
      : 'Você chegou ao último nível desta jornada.',
  };
}

export function isAutomaticallyMeasuredAchievement(definition: AchievementProgressDefinition): boolean {
  return definition.category === 'streak' || (
    definition.category === 'transaction' &&
    ['total_transactions', 'total_value', 'categories_used', 'active_days_month'].includes(definition.subcategory ?? '')
  );
}

export function getAchievementProgress(
  definition: AchievementProgressDefinition,
  progress: AchievementProgressValue | undefined,
  effectiveStreak: number,
  now = new Date(),
) {
  const threshold = getAchievementThreshold(definition, now);
  let current = definition.category === 'streak' && !progress?.unlocked
    ? nonnegative(effectiveStreak)
    : nonnegative(progress?.current_value ?? 0);
  if (definition.subcategory === 'active_days_month' && !progress?.unlocked && progress?.updated_at) {
    const updatedAt = new Date(progress.updated_at);
    if (Number.isFinite(updatedAt.getTime()) && getAchievementDateKey(updatedAt).slice(0, 7) < getAchievementDateKey(now).slice(0, 7)) {
      current = 0;
    }
  }
  let label = `${numberFormatter.format(current)} de ${numberFormatter.format(threshold)}`;
  if (definition.subcategory === 'total_value') {
    label = `${currencyFormatter.format(current)} de ${currencyFormatter.format(threshold)}`;
  } else if (definition.category === 'streak') {
    label += ' dias seguidos';
  } else if (definition.subcategory === 'active_days_month') {
    label += ' dias no mês';
  } else if (definition.subcategory === 'total_transactions') {
    label += ' lançamentos';
  } else if (definition.subcategory === 'categories_used') {
    label += ' categorias';
  }
  return { current, threshold, label, pct: progress?.unlocked ? 100 : threshold > 0 ? Math.min(100, current / threshold * 100) : 0 };
}
