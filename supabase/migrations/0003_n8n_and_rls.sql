-- =====================================================================
-- 0003_n8n_and_rls.sql
-- Tabelas exclusivas do n8n (fila, histórico, audit), helper de
-- contagem diária de mensagens e Row Level Security para todas as
-- tabelas que o front toca.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. n8n_fila_mensagens
--    Fila curta para tratar mensagens encavaladas.
-- ---------------------------------------------------------------------
CREATE TABLE public.n8n_fila_mensagens (
  id            bigserial PRIMARY KEY,
  id_mensagem   text NOT NULL,
  telefone      text NOT NULL,
  mensagem      text NOT NULL DEFAULT '',
  "timestamp"   timestamptz NOT NULL,
  status        text NOT NULL DEFAULT 'queued',
  processing_at timestamptz,
  id_conta      text,
  id_conversa   text,
  url_chatwoot  text
);

CREATE INDEX idx_fila_telefone     ON public.n8n_fila_mensagens(telefone, "timestamp");
CREATE INDEX idx_fila_id_mensagem  ON public.n8n_fila_mensagens(id_mensagem);

-- ---------------------------------------------------------------------
-- 2. n8n_historico_mensagens
--    Memória persistida para LangChain Memory (consumida por
--    @n8n/n8n-nodes-langchain.memoryPostgresChat).
-- ---------------------------------------------------------------------
CREATE TABLE public.n8n_historico_mensagens (
  id         bigserial PRIMARY KEY,
  session_id text NOT NULL,
  message    jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_hist_session
  ON public.n8n_historico_mensagens(session_id, created_at DESC);

-- ---------------------------------------------------------------------
-- 3. n8n_ai_audit_logs
--    Auditoria de cada interação (input do usuário + output do agente).
-- ---------------------------------------------------------------------
CREATE TABLE public.n8n_ai_audit_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  telefone       text,
  input_usuario  text,
  output_agente  text,
  metadata       jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_org_created  ON public.n8n_ai_audit_logs(org_id, created_at DESC);
CREATE INDEX idx_audit_phone_created ON public.n8n_ai_audit_logs(telefone, created_at DESC);

-- ---------------------------------------------------------------------
-- 4. increment_phone_message_count
--    Helper chamado pelo n8n no `Enfileirar mensagem.` para incrementar
--    o contador diário (ou resetar se virou o dia).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_phone_message_count(p_phone text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE public.phone_to_org
  SET messages_used_today = CASE
        WHEN updated_at::date = current_date THEN messages_used_today + 1
        ELSE 1
      END,
      updated_at = now()
  WHERE phone_number = regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_phone_message_count(text) TO service_role;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

-- Habilita RLS em todas as tabelas que o front (anon/authenticated) toca.
ALTER TABLE public.organizations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories            ENABLE ROW LEVEL SECURITY;

-- phone_to_org e n8n_* NÃO têm RLS — só service_role (n8n) bate nelas.
-- Como as policies abaixo só liberam acesso via JWT do usuário logado,
-- service_role bypassa tudo (comportamento padrão do Supabase).

-- ---------------------------------------------------------------------
-- profiles: dono lê e edita o próprio
-- ---------------------------------------------------------------------
CREATE POLICY profiles_select_self ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- INSERT em profiles é feito pelo trigger handle_new_user (SECURITY DEFINER),
-- então não precisa de policy de INSERT pro usuário comum.

-- ---------------------------------------------------------------------
-- organization_members: usuário enxerga só os próprios vínculos
-- ---------------------------------------------------------------------
CREATE POLICY members_select_self ON public.organization_members
  FOR SELECT USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- organizations: usuário enxerga as orgs que é membro
-- ---------------------------------------------------------------------
CREATE POLICY orgs_member_read ON public.organizations
  FOR SELECT USING (id IN (SELECT public.user_orgs()));

CREATE POLICY orgs_member_update ON public.organizations
  FOR UPDATE USING (id IN (SELECT public.user_orgs()))
  WITH CHECK (id IN (SELECT public.user_orgs()));

-- ---------------------------------------------------------------------
-- transactions / accounts / credit_cards / categories
-- Padrão: full CRUD se a org pertence ao usuário.
-- ---------------------------------------------------------------------
CREATE POLICY tx_org ON public.transactions
  FOR ALL USING (org_id IN (SELECT public.user_orgs()))
  WITH CHECK (org_id IN (SELECT public.user_orgs()));

CREATE POLICY acc_org ON public.accounts
  FOR ALL USING (org_id IN (SELECT public.user_orgs()))
  WITH CHECK (org_id IN (SELECT public.user_orgs()));

CREATE POLICY cc_org ON public.credit_cards
  FOR ALL USING (org_id IN (SELECT public.user_orgs()))
  WITH CHECK (org_id IN (SELECT public.user_orgs()));

CREATE POLICY cat_org ON public.categories
  FOR ALL USING (org_id IN (SELECT public.user_orgs()))
  WITH CHECK (org_id IN (SELECT public.user_orgs()));

COMMIT;
