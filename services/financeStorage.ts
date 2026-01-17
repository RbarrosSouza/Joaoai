import type { UserSettings } from './financeDefaults';

const LEGACY_SETTINGS_KEY = 'finzen_settings';

function settingsKeyForUser(userId: string) {
  return `joaoai:settings:${userId}`;
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeEmail(email?: string | null) {
  return (email ?? '').trim().toLowerCase();
}

export function readUserSettings(params: {
  userId: string;
  userEmail?: string | null;
  fallback: UserSettings;
}): UserSettings {
  const key = settingsKeyForUser(params.userId);
  const saved = safeJsonParse<UserSettings>(localStorage.getItem(key));
  if (saved) return { ...params.fallback, ...saved };

  // Migração segura do legado: só migra se o e-mail bater (evita “vazar” settings entre usuários)
  const legacy = safeJsonParse<UserSettings>(localStorage.getItem(LEGACY_SETTINGS_KEY));
  const legacyEmail = normalizeEmail(legacy?.email);
  const userEmail = normalizeEmail(params.userEmail);
  if (legacy && legacyEmail && userEmail && legacyEmail === userEmail) {
    const migrated = { ...params.fallback, ...legacy };
    writeUserSettings({ userId: params.userId, settings: migrated });
    return migrated;
  }

  return params.fallback;
}

export function writeUserSettings(params: { userId: string; settings: UserSettings }) {
  const key = settingsKeyForUser(params.userId);
  localStorage.setItem(key, JSON.stringify(params.settings));
}


