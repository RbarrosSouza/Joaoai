-- =====================================================================
-- 0004_achievements.sql
-- Conquistas (38 badges), streak, RPC de progresso e
-- get_accounts_and_cards. Espelha a especificação em
-- docs/ACHIEVEMENTS-DATABASE.md.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------
CREATE TABLE public.achievement_definitions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  category    text NOT NULL CHECK (category IN ('streak', 'transaction', 'behavior', 'financial')),
  subcategory text,
  name        text NOT NULL,
  description text NOT NULL,
  emoji       text NOT NULL DEFAULT '🏆',
  tier        text CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),
  threshold   numeric NOT NULL DEFAULT 0,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ach_def_category ON public.achievement_definitions(category);

CREATE TABLE public.user_achievements (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  current_value  numeric NOT NULL DEFAULT 0,
  unlocked       boolean NOT NULL DEFAULT false,
  unlocked_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, achievement_id)
);

CREATE INDEX idx_user_ach_org ON public.user_achievements(org_id);

CREATE TRIGGER trg_touch_user_ach
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.user_streaks (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id             uuid NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  current_streak     int NOT NULL DEFAULT 0,
  longest_streak     int NOT NULL DEFAULT 0,
  last_activity_date date,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_touch_user_streaks
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS: usuário lê suas próprias conquistas (write fica para service_role/n8n).
ALTER TABLE public.user_achievements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

-- definitions é catálogo público (qualquer usuário autenticado pode ler)
CREATE POLICY ach_def_read_all ON public.achievement_definitions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY user_ach_org ON public.user_achievements
  FOR SELECT USING (org_id IN (SELECT public.user_orgs()));

CREATE POLICY user_streaks_org ON public.user_streaks
  FOR SELECT USING (org_id IN (SELECT public.user_orgs()));

-- ---------------------------------------------------------------------
-- Seed das 38 conquistas (espelha docs/ACHIEVEMENTS-DATABASE.md)
-- ---------------------------------------------------------------------
INSERT INTO public.achievement_definitions
  (slug, category, subcategory, name, description, emoji, tier, threshold, sort_order)
VALUES
  -- 🔥 Streak (6)
  ('streak_7',   'streak', NULL, 'Primeira Chama', '7 dias seguidos',   '🔥', NULL, 7,   1),
  ('streak_15',  'streak', NULL, 'Consistente',    '15 dias seguidos',  '🔥', NULL, 15,  2),
  ('streak_30',  'streak', NULL, 'Diamante',       '30 dias seguidos',  '💎', NULL, 30,  3),
  ('streak_60',  'streak', NULL, 'Realeza',        '60 dias seguidos',  '👑', NULL, 60,  4),
  ('streak_100', 'streak', NULL, 'Centurião',      '100 dias seguidos', '🏛️', NULL, 100, 5),
  ('streak_365', 'streak', NULL, 'Lendário',       '365 dias seguidos', '🌟', NULL, 365, 6),

  -- 📊 Lançamentos — Total de Transações (4)
  ('tx_count_10',  'transaction', 'total_transactions', 'Iniciante',         '10 transações',        '📝', 'bronze',  10,  10),
  ('tx_count_50',  'transaction', 'total_transactions', 'Praticante',        '50 transações',        '📝', 'silver',  50,  11),
  ('tx_count_200', 'transaction', 'total_transactions', 'Veterano',          '200 transações',       '📝', 'gold',    200, 12),
  ('tx_count_500', 'transaction', 'total_transactions', 'Mestre dos Dados',  '500 transações',       '📝', 'diamond', 500, 13),

  -- 📊 Lançamentos — Valor Total Registrado (4)
  ('tx_value_1k',   'transaction', 'total_value', 'Primeiro Mil',           'R$ 1.000 registrados',   '💰', 'bronze',  1000,    20),
  ('tx_value_10k',  'transaction', 'total_value', 'Controlador',            'R$ 10.000 registrados',  '💰', 'silver',  10000,   21),
  ('tx_value_50k',  'transaction', 'total_value', 'Magnata',                'R$ 50.000 registrados',  '💰', 'gold',    50000,   22),
  ('tx_value_200k', 'transaction', 'total_value', 'Milionário dos Dados',   'R$ 200.000 registrados', '💰', 'diamond', 200000,  23),

  -- 📊 Lançamentos — Categorias Diferentes (4)
  ('cat_used_3',  'transaction', 'categories_used', 'Explorador',    '3 categorias diferentes',   '🗂️', 'bronze',  3,  30),
  ('cat_used_5',  'transaction', 'categories_used', 'Diversificado', '5 categorias diferentes',   '🗂️', 'silver',  5,  31),
  ('cat_used_8',  'transaction', 'categories_used', 'Detalhista',    '8 categorias diferentes',   '🗂️', 'gold',    8,  32),
  ('cat_used_12', 'transaction', 'categories_used', 'Taxonomista',   '12+ categorias diferentes', '🗂️', 'diamond', 12, 33),

  -- 📊 Lançamentos — Dias Ativos no Mês (4)
  ('active_days_15',  'transaction', 'active_days_month', 'Presente',  '15 dias ativos no mês', '📅', 'bronze',  15, 40),
  ('active_days_20',  'transaction', 'active_days_month', 'Frequente', '20 dias ativos no mês', '📅', 'silver',  20, 41),
  ('active_days_25',  'transaction', 'active_days_month', 'Dedicado',  '25 dias ativos no mês', '📅', 'gold',    25, 42),
  ('active_days_all', 'transaction', 'active_days_month', 'Perfeição', 'Mês inteiro ativo',     '📅', 'diamond', 28, 43),

  -- 🧠 Comportamento (8) — atualizadas manualmente pelo n8n
  ('behavior_photo',   'behavior', NULL, 'Fotógrafo',  '10 registros por foto',          '📸', NULL, 10, 50),
  ('behavior_audio',   'behavior', NULL, 'Locutor',    '10 registros por áudio',         '🎙️', NULL, 10, 51),
  ('behavior_night',   'behavior', NULL, 'Noturno',    '20 registros após 22h',          '🌙', NULL, 20, 52),
  ('behavior_morning', 'behavior', NULL, 'Madrugador', '20 registros antes das 8h',      '🌅', NULL, 20, 53),
  ('behavior_fast',    'behavior', NULL, 'Raio',       'Registrou em menos de 10s',      '⚡', NULL, 1,  54),
  ('behavior_pdf',     'behavior', NULL, 'Burocrata',  '5 registros por PDF',            '📄', NULL, 5,  55),
  ('behavior_multi',   'behavior', NULL, 'Multimídia', 'Áudio + foto + texto no dia',    '🎭', NULL, 1,  56),
  ('behavior_sameday', 'behavior', NULL, 'Pontual',    '30 registros no mesmo dia',      '🎯', NULL, 30, 57),

  -- 💰 Financeiro (8) — atualizadas manualmente pelo n8n
  ('fin_economist',    'financial', NULL, 'Economista',         'Gastou menos que mês anterior',     '📉', NULL, 1,  60),
  ('fin_focused',      'financial', NULL, 'Focado',             '3 metas de categoria batidas',      '🎯', NULL, 3,  61),
  ('fin_saver',        'financial', NULL, 'Poupador',           'Poupou 20%+ da receita',            '🐷', NULL, 1,  62),
  ('fin_organized',    'financial', NULL, 'Organizado',         'Todas categorias preenchidas',      '📋', NULL, 1,  63),
  ('fin_needs_first',  'financial', NULL, 'Necessidades First', '50%+ em necessidades',              '🍞', NULL, 1,  64),
  ('fin_freefall',     'financial', NULL, 'Em Queda Livre',     '3 meses gastando menos',            '📉', NULL, 3,  65),
  ('fin_grade_a',      'financial', NULL, 'Nota A',             'Nota A no relatório mensal',        '🅰️', NULL, 1,  66),
  ('fin_golden_year',  'financial', NULL, 'Ano de Ouro',        '12 meses usando o João.ai',         '🏆', NULL, 12, 67);

-- ---------------------------------------------------------------------
-- get_accounts_and_cards(p_org_id)
-- Retorna { accounts: [...], cards: [...] } pra ferramenta do agente.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_accounts_and_cards(p_org_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
  SELECT jsonb_build_object(
    'accounts', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'bank_name', a.bank_name,
                'type', a.type,
                'balance', a.balance
              ) ORDER BY a.name)
       FROM public.accounts a
       WHERE a.org_id = p_org_id AND a.is_active),
      '[]'::jsonb
    ),
    'cards', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'brand', c.brand,
                'limit', c."limit",
                'closing_day', c.closing_day,
                'due_day', c.due_day
              ) ORDER BY c.name)
       FROM public.credit_cards c
       WHERE c.org_id = p_org_id AND c.is_active),
      '[]'::jsonb
    )
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_accounts_and_cards(uuid) TO service_role, authenticated;

-- ---------------------------------------------------------------------
-- update_achievements_after_transaction(p_org_id)
-- Chamada pelo n8n APÓS inserir transação.
-- Atualiza streak + métricas de transações + retorna JSON usado pelo
-- node "Montar Mensagens Conquista".
--
-- Shape de retorno (consumido em services/N8N/N8N - Atual.md):
-- {
--   "streak": int,
--   "longest_streak": int,
--   "transactions_count": int,
--   "total_value": numeric,
--   "categories_count": int,
--   "active_days": int,
--   "newly_unlocked": [{"emoji":"...","name":"...","description":"..."}],
--   "next_badges":    [{"emoji":"...","name":"...","pct":int,"current_value":num,"threshold":num}]
-- }
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_achievements_after_transaction(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_today          date := current_date;
  v_streak         public.user_streaks%ROWTYPE;
  v_tx_count       int;
  v_total_value    numeric;
  v_categories     int;
  v_active_days    int;
  v_newly_unlocked jsonb;
  v_next_badges    jsonb;
BEGIN
  -- =========================
  -- 1. Atualiza streak
  -- =========================
  SELECT * INTO v_streak FROM public.user_streaks WHERE org_id = p_org_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_streaks(org_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_org_id, 1, 1, v_today)
    RETURNING * INTO v_streak;
  ELSE
    IF v_streak.last_activity_date IS NULL THEN
      v_streak.current_streak := 1;
    ELSIF v_streak.last_activity_date = v_today THEN
      -- mesmo dia, mantém
      NULL;
    ELSIF v_streak.last_activity_date = v_today - 1 THEN
      v_streak.current_streak := v_streak.current_streak + 1;
    ELSE
      v_streak.current_streak := 1;
    END IF;

    v_streak.longest_streak := GREATEST(v_streak.longest_streak, v_streak.current_streak);
    v_streak.last_activity_date := v_today;

    UPDATE public.user_streaks
    SET current_streak = v_streak.current_streak,
        longest_streak = v_streak.longest_streak,
        last_activity_date = v_streak.last_activity_date,
        updated_at = now()
    WHERE org_id = p_org_id;
  END IF;

  -- =========================
  -- 2. Métricas
  -- =========================
  SELECT count(*),
         COALESCE(sum(amount), 0),
         count(DISTINCT category_id) FILTER (WHERE category_id IS NOT NULL)
    INTO v_tx_count, v_total_value, v_categories
  FROM public.transactions
  WHERE org_id = p_org_id;

  SELECT count(DISTINCT date)
    INTO v_active_days
  FROM public.transactions
  WHERE org_id = p_org_id
    AND date >= date_trunc('month', v_today)::date
    AND date <  (date_trunc('month', v_today) + interval '1 month')::date;

  -- =========================
  -- 3. Atualiza progresso das conquistas automáticas.
  --    Coleta as que viraram unlocked nesta execução em v_newly_unlocked.
  -- =========================
  WITH targets AS (
    -- streak: usa current_streak
    SELECT d.id, d.slug, d.name, d.emoji, d.description, d.threshold,
           v_streak.current_streak::numeric AS new_value
    FROM public.achievement_definitions d
    WHERE d.category = 'streak'

    UNION ALL
    SELECT d.id, d.slug, d.name, d.emoji, d.description, d.threshold,
           v_tx_count::numeric AS new_value
    FROM public.achievement_definitions d
    WHERE d.category = 'transaction' AND d.subcategory = 'total_transactions'

    UNION ALL
    SELECT d.id, d.slug, d.name, d.emoji, d.description, d.threshold,
           v_total_value AS new_value
    FROM public.achievement_definitions d
    WHERE d.category = 'transaction' AND d.subcategory = 'total_value'

    UNION ALL
    SELECT d.id, d.slug, d.name, d.emoji, d.description, d.threshold,
           v_categories::numeric AS new_value
    FROM public.achievement_definitions d
    WHERE d.category = 'transaction' AND d.subcategory = 'categories_used'

    UNION ALL
    SELECT d.id, d.slug, d.name, d.emoji, d.description, d.threshold,
           v_active_days::numeric AS new_value
    FROM public.achievement_definitions d
    WHERE d.category = 'transaction' AND d.subcategory = 'active_days_month'
  ),
  upserted AS (
    INSERT INTO public.user_achievements (org_id, achievement_id, current_value, unlocked, unlocked_at)
    SELECT p_org_id, t.id, t.new_value,
           (t.new_value >= t.threshold),
           CASE WHEN t.new_value >= t.threshold THEN now() ELSE NULL END
    FROM targets t
    ON CONFLICT (org_id, achievement_id) DO UPDATE
      SET current_value = EXCLUDED.current_value,
          -- mantém unlocked = true se já estava, mesmo que a métrica caia
          unlocked = (user_achievements.unlocked OR EXCLUDED.unlocked),
          unlocked_at = COALESCE(user_achievements.unlocked_at, EXCLUDED.unlocked_at),
          updated_at = now()
    RETURNING user_achievements.achievement_id,
              user_achievements.unlocked,
              -- foi desbloqueada NESTA execução?
              (xmax::text::int <> 0
                 AND user_achievements.unlocked
                 AND user_achievements.unlocked_at >= now() - interval '5 seconds') AS was_just_unlocked
  )
  SELECT jsonb_agg(jsonb_build_object(
           'emoji', d.emoji,
           'name', d.name,
           'description', d.description
         ))
    INTO v_newly_unlocked
  FROM upserted u
  JOIN public.achievement_definitions d ON d.id = u.achievement_id
  WHERE u.was_just_unlocked;

  -- Fallback simples: se a heurística do xmax falhou, busca por unlocked_at recente
  IF v_newly_unlocked IS NULL THEN
    SELECT jsonb_agg(jsonb_build_object(
             'emoji', d.emoji,
             'name', d.name,
             'description', d.description
           ))
      INTO v_newly_unlocked
    FROM public.user_achievements ua
    JOIN public.achievement_definitions d ON d.id = ua.achievement_id
    WHERE ua.org_id = p_org_id
      AND ua.unlocked
      AND ua.unlocked_at >= now() - interval '5 seconds';
  END IF;

  v_newly_unlocked := COALESCE(v_newly_unlocked, '[]'::jsonb);

  -- =========================
  -- 4. Top 3 próximos badges (locked, automáticos, ordenados por % progresso)
  -- =========================
  SELECT jsonb_agg(row_obj ORDER BY pct DESC)
    INTO v_next_badges
  FROM (
    SELECT jsonb_build_object(
             'emoji', d.emoji,
             'name', d.name,
             'pct', LEAST(100, ROUND((ua.current_value / NULLIF(d.threshold, 0)) * 100))::int,
             'current_value', ua.current_value,
             'threshold', d.threshold
           ) AS row_obj,
           LEAST(100, ROUND((ua.current_value / NULLIF(d.threshold, 0)) * 100))::int AS pct
    FROM public.user_achievements ua
    JOIN public.achievement_definitions d ON d.id = ua.achievement_id
    WHERE ua.org_id = p_org_id
      AND NOT ua.unlocked
      AND d.category IN ('streak', 'transaction')
    ORDER BY pct DESC, d.sort_order ASC
    LIMIT 3
  ) t;

  v_next_badges := COALESCE(v_next_badges, '[]'::jsonb);

  -- =========================
  -- 5. Retorno
  -- =========================
  RETURN jsonb_build_object(
    'streak', v_streak.current_streak,
    'longest_streak', v_streak.longest_streak,
    'transactions_count', v_tx_count,
    'total_value', v_total_value,
    'categories_count', v_categories,
    'active_days', v_active_days,
    'newly_unlocked', v_newly_unlocked,
    'next_badges', v_next_badges
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_achievements_after_transaction(uuid) TO service_role;

COMMIT;
