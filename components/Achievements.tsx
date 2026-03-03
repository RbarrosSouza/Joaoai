import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../services/AuthContext';
import { useFinance } from '../services/FinanceContext';
import { getSupabaseClient } from '../services/supabaseClient';
import { fetchActiveOrgId } from '../services/financeTransactionsSupabase';
import { Trophy, Flame, Sparkles, Lock } from 'lucide-react';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface AchievementDef {
    id: string; slug: string; category: string; subcategory: string | null;
    name: string; description: string; emoji: string; tier: string | null;
    threshold: number; sort_order: number;
}
interface UserAchievement {
    achievement_id: string; current_value: number; unlocked: boolean; unlocked_at: string | null;
}
interface UserStreak {
    current_streak: number; longest_streak: number; last_activity_date: string | null;
}
type TabFilter = 'all' | 'streak' | 'transaction' | 'behavior' | 'financial';

// ─────────────────────────────────────────
// Constants
// ─────────────────────────────────────────
const TIER_STYLES: Record<string, { border: string; glow: string; label: string; labelBg: string; labelColor: string }> = {
    bronze: { border: 'border-amber-300/60', glow: 'shadow-[0_0_15px_rgba(217,170,75,0.15)]', label: 'BRONZE', labelBg: 'bg-amber-100', labelColor: 'text-amber-700' },
    silver: { border: 'border-slate-300/60', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.2)]', label: 'PRATA', labelBg: 'bg-slate-100', labelColor: 'text-slate-600' },
    gold: { border: 'border-yellow-400/60', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', label: 'OURO', labelBg: 'bg-yellow-100', labelColor: 'text-yellow-700' },
    diamond: { border: 'border-cyan-300/60', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]', label: 'DIAMANTE', labelBg: 'bg-cyan-50', labelColor: 'text-cyan-700' },
};

const CATEGORY_INFO: Record<string, { label: string; emoji: string }> = {
    streak: { label: 'Streaks', emoji: '🔥' }, transaction: { label: 'Lançamentos', emoji: '📊' },
    behavior: { label: 'Comportamento', emoji: '🧠' }, financial: { label: 'Financeiro', emoji: '💰' },
};

const TAB_OPTIONS: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'Todos' }, { key: 'streak', label: '🔥 Streaks' },
    { key: 'transaction', label: '📊 Lançamentos' }, { key: 'behavior', label: '🧠 Comportamento' },
    { key: 'financial', label: '💰 Financeiro' },
];

const LEVELS = [
    { min: 0, title: 'Novato', icon: '🌱', color: '#94A3B8' },
    { min: 3, title: 'Aprendiz', icon: '📘', color: '#3B82F6' },
    { min: 8, title: 'Praticante', icon: '⚡', color: '#8B5CF6' },
    { min: 15, title: 'Estrategista', icon: '🎯', color: '#EF4444' },
    { min: 25, title: 'Mestre', icon: '👑', color: '#F59E0B' },
    { min: 35, title: 'Lendário', icon: '🏆', color: '#8CB82A' },
];

function computeLevel(total: number) {
    let idx = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) { if (total >= LEVELS[i].min) { idx = i; break; } }
    const cur = LEVELS[idx], next = LEVELS[idx + 1] ?? cur;
    const inLevel = total - cur.min, needed = Math.max(1, next.min - cur.min);
    return { level: idx + 1, title: cur.title, icon: cur.icon, color: cur.color, xp: total, nextXp: next.min, pct: Math.min(100, (inLevel / needed) * 100) };
}

// ─────────────────────────────────────────
// SVG Progress Ring
// ─────────────────────────────────────────
const ProgressRing: React.FC<{ pct: number; color: string; size?: number; stroke?: number }> =
    ({ pct, color, size = 120, stroke = 6 }) => {
        const r = (size - stroke) / 2, c = 2 * Math.PI * r;
        return (
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} strokeLinecap="round"
                    className="transition-all duration-[1500ms] ease-out" />
            </svg>
        );
    };

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
const Achievements: React.FC = () => {
    const { user } = useAuth();
    const { transactions } = useFinance();
    const supabase = getSupabaseClient();
    const [definitions, setDefinitions] = useState<AchievementDef[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [streak, setStreak] = useState<UserStreak | null>(null);
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let x = false;
        (async () => {
            if (!supabase || !user?.id) { setLoading(false); return; }
            try {
                const orgId = await fetchActiveOrgId({ supabase, userId: user.id });
                const { data: defs } = await supabase.from('achievement_definitions').select('*').order('sort_order');
                if (x) return; setDefinitions((defs ?? []) as AchievementDef[]);
                if (!orgId) { setLoading(false); return; }
                const [{ data: p }, { data: s }] = await Promise.all([
                    supabase.from('user_achievements').select('achievement_id,current_value,unlocked,unlocked_at').eq('org_id', orgId),
                    supabase.from('user_streaks').select('current_streak,longest_streak,last_activity_date').eq('org_id', orgId).maybeSingle(),
                ]);
                if (x) return;
                setUserAchievements((p ?? []) as UserAchievement[]);
                setStreak((s as UserStreak) ?? null);
            } catch (e) { console.error(e); }
            finally { if (!x) setLoading(false); }
        })();
        return () => { x = true; };
    }, [supabase, user?.id]);

    const pMap = useMemo(() => { const m = new Map<string, UserAchievement>(); userAchievements.forEach(u => m.set(u.achievement_id, u)); return m; }, [userAchievements]);
    const totalUnlocked = userAchievements.filter(u => u.unlocked).length;
    const totalBadges = definitions.length;
    const lv = computeLevel(totalUnlocked);

    const filtered = useMemo(() => {
        const d = activeTab === 'all' ? definitions : definitions.filter(x => x.category === activeTab);
        const g = new Map<string, AchievementDef[]>();
        d.forEach(x => { if (!g.has(x.category)) g.set(x.category, []); g.get(x.category)!.push(x); });
        return g;
    }, [definitions, activeTab]);

    const nextUp = useMemo(() => {
        return definitions.filter(d => !pMap.get(d.id)?.unlocked)
            .sort((a, b) => {
                const pa = a.threshold > 0 ? (pMap.get(a.id)?.current_value ?? 0) / a.threshold : 0;
                const pb = b.threshold > 0 ? (pMap.get(b.id)?.current_value ?? 0) / b.threshold : 0;
                return pb - pa;
            }).slice(0, 3).map(d => {
                const p = pMap.get(d.id);
                return { ...d, pct: d.threshold > 0 ? Math.min(100, ((p?.current_value ?? 0) / d.threshold) * 100) : 0, cur: p?.current_value ?? 0 };
            });
    }, [definitions, pMap]);

    // ── Loading ──
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-brand-deep flex items-center justify-center mb-4 shadow-premium ach-pulse">
                <Trophy size={32} strokeWidth={1.5} className="text-brand-lime" />
            </div>
            <p className="text-sm font-medium text-slate-400">Carregando conquistas...</p>
        </div>
    );

    return (
        <>
            {/* Scoped styles for gamification effects */}
            <style>{`
        @keyframes ach-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ach-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes ach-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes ach-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ach-fire {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          25% { transform: scale(1.1) rotate(2deg); }
          50% { transform: scale(1.05) rotate(-1deg); }
          75% { transform: scale(1.12) rotate(1deg); }
        }
        @keyframes ach-entrance {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ach-pulse { animation: ach-pulse 3s ease-in-out infinite; }
        .ach-fire { animation: ach-fire 1.5s ease-in-out infinite; }
        .ach-float { animation: ach-float 4s ease-in-out infinite; }
        .ach-entrance { animation: ach-entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .ach-badge-card {
          position: relative;
          overflow: hidden;
        }
        .ach-badge-card.unlocked::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: ach-shimmer 3s ease-in-out infinite;
          animation-delay: var(--shimmer-delay, 0s);
          pointer-events: none;
        }
        .ach-badge-card.unlocked:hover::after {
          animation-duration: 1s;
        }
        .ach-ring-glow {
          animation: ach-glow 3s ease-in-out infinite;
        }
      `}</style>

            <div className="space-y-8 w-full pb-10">

                {/* ═══════════ HEADER ═══════════ */}
                <header className="ach-entrance">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                        <Sparkles size={14} className="text-brand-lime" /> Gamificação
                    </p>
                    <h1 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight">
                        Minhas <span className="font-bold">Conquistas</span>
                    </h1>
                </header>

                {/* ═══════════ HERO: LEVEL CARD ═══════════ */}
                <section className="ach-entrance" style={{ animationDelay: '80ms' }}>
                    <div className="card-base p-0 overflow-hidden relative">
                        {/* Dark banner */}
                        <div className="bg-brand-deep relative overflow-hidden">
                            {/* Texture */}
                            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            {/* Ambient glow */}
                            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none" style={{ background: lv.color, opacity: 0.08 }}></div>

                            <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
                                {/* Ring + Icon */}
                                <div className="relative shrink-0">
                                    <ProgressRing pct={lv.pct} color={lv.color} size={110} stroke={5} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl ach-float drop-shadow-lg">{lv.icon}</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center gap-2.5 justify-center sm:justify-start mb-1">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold text-white border border-white/20"
                                            style={{ background: lv.color }}>
                                            {lv.level}
                                        </span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{lv.title}</h2>
                                    </div>
                                    <p className="text-white/50 text-sm font-medium mb-4">
                                        {totalUnlocked} de {totalBadges} conquistas desbloqueadas
                                    </p>

                                    {/* XP Bar */}
                                    <div>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{lv.xp} XP</span>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{lv.nextXp} XP</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden relative">
                                            <div className="h-full rounded-full transition-all duration-[1500ms] ease-out relative"
                                                style={{ width: `${lv.pct}%`, background: `linear-gradient(90deg, ${lv.color}, ${lv.color}dd)` }}>
                                                {/* Shimmer on XP bar */}
                                                <div className="absolute inset-0 overflow-hidden rounded-full">
                                                    <div className="absolute inset-0 -translate-x-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'ach-shimmer 2.5s ease-in-out infinite' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats (desktop) */}
                                <div className="hidden md:flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-white tracking-tight">{totalUnlocked}</p>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Conquistas</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10"></div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-white/30 tracking-tight">{totalBadges}</p>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Total</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════ STREAK ═══════════ */}
                <section className="ach-entrance" style={{ animationDelay: '150ms' }}>
                    <div className="card-base p-5 md:p-6 border border-orange-100 relative overflow-hidden">
                        {/* Warm ambient */}
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
                                    <Flame size={26} strokeWidth={2} className="text-white ach-fire" />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold text-slate-800 tracking-tight">{streak?.current_streak ?? 0}</span>
                                        <span className="text-sm font-medium text-slate-400">dias</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">Streak de atividade</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-orange-500">{streak?.longest_streak ?? 0}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Recorde</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-slate-600">{transactions.length}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Total TXs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════ TABS ═══════════ */}
                <section className="ach-entrance" style={{ animationDelay: '200ms' }}>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                        {TAB_OPTIONS.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 ${activeTab === tab.key
                                    ? 'bg-brand-deep text-white border-brand-deep shadow-sm scale-[1.02]'
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-brand-lime/30 hover:text-slate-700 hover:shadow-sm'
                                    }`}>{tab.label}</button>
                        ))}
                    </div>
                </section>

                {/* ═══════════ BADGE GRID ═══════════ */}
                {Array.from(filtered.entries()).map(([cat, defs], si) => {
                    const ci = CATEGORY_INFO[cat] ?? { label: cat, emoji: '🏷️' };
                    const unlocked = defs.filter(d => pMap.get(d.id)?.unlocked).length;
                    return (
                        <section key={cat} className="ach-entrance" style={{ animationDelay: `${250 + si * 80}ms` }}>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                                    <span className="text-xl">{ci.emoji}</span> {ci.label}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-brand-deep">{unlocked}</span>
                                    <span className="text-xs text-slate-300">/</span>
                                    <span className="text-xs font-bold text-slate-400">{defs.length}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {defs.map((def, di) => {
                                    const prog = pMap.get(def.id);
                                    const isUn = !!prog?.unlocked;
                                    const pct = def.threshold > 0 ? Math.min(100, ((prog?.current_value ?? 0) / def.threshold) * 100) : 0;
                                    const tier = def.tier ? TIER_STYLES[def.tier] : null;

                                    return (
                                        <div
                                            key={def.id}
                                            className={`ach-badge-card card-base p-4 transition-all duration-300 group
                        ${isUn ? 'unlocked hover:-translate-y-1.5' : ''}
                        ${isUn && tier ? `${tier.border} ${tier.glow}` : ''}
                        ${isUn && !tier ? 'border-brand-lime/20 shadow-[0_0_12px_rgba(140,184,42,0.1)]' : ''}
                        ${!isUn ? 'border-slate-100' : ''}
                      `}
                                            style={{ '--shimmer-delay': `${di * 0.6}s` } as React.CSSProperties}
                                        >
                                            {/* Tier label */}
                                            {tier && isUn && (
                                                <span className={`absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.labelBg} ${tier.labelColor}`}>
                                                    {tier.label}
                                                </span>
                                            )}

                                            {/* Emoji container */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300
                        ${isUn
                                                    ? 'bg-brand-lime/10 group-hover:scale-110 group-hover:rotate-3'
                                                    : 'bg-slate-50'
                                                }`}>
                                                <span className={`text-2xl transition-all duration-300 ${!isUn ? 'grayscale opacity-40' : ''}`}>{def.emoji}</span>
                                            </div>

                                            {/* Text */}
                                            <p className={`text-[13px] font-semibold leading-tight mb-0.5 ${isUn ? 'text-slate-800' : 'text-slate-400'}`}>{def.name}</p>
                                            <p className="text-[11px] text-slate-400 leading-snug mb-3 line-clamp-2">{def.description}</p>

                                            {/* Status */}
                                            {isUn ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-4 h-4 rounded-full bg-brand-lime flex items-center justify-center">
                                                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep">Conquistado</span>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${pct}%`, background: pct > 60 ? 'linear-gradient(90deg, #8CB82A, #A5D63A)' : '#CBD5E1' }} />
                                                    </div>
                                                    <div className="flex justify-between mt-1.5">
                                                        <span className="text-[10px] text-slate-400 font-semibold">{prog?.current_value ?? 0}/{def.threshold}</span>
                                                        {pct > 0 && <span className="text-[10px] font-bold text-brand-deep">{Math.round(pct)}%</span>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}

                {/* ═══════════ NEXT UP ═══════════ */}
                {nextUp.length > 0 && (
                    <section className="ach-entrance" style={{ animationDelay: '500ms' }}>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-7 h-7 rounded-lg bg-brand-lime/10 flex items-center justify-center">
                                <Sparkles size={14} strokeWidth={2.5} className="text-brand-deep" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Próximas Conquistas</h3>
                        </div>

                        <div className="space-y-3">
                            {nextUp.map((item, i) => (
                                <div key={item.id}
                                    className="card-base p-4 md:p-5 flex items-center gap-4 group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Progress fill background */}
                                    <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
                                        style={{ width: `${item.pct}%`, background: 'linear-gradient(90deg, rgba(140,184,42,0.04), rgba(140,184,42,0.08))' }} />

                                    <div className="relative z-10 w-11 h-11 rounded-xl bg-brand-lime/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="text-xl">{item.emoji}</span>
                                    </div>
                                    <div className="relative z-10 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate mb-1">{item.name}</p>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${item.pct}%`, background: 'linear-gradient(90deg, #8CB82A, #A5D63A)' }} />
                                        </div>
                                    </div>
                                    <span className="relative z-10 text-sm font-bold text-brand-deep shrink-0 tabular-nums">{Math.round(item.pct)}%</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default Achievements;
