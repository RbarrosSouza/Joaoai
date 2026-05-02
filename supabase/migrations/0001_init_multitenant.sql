-- =====================================================================
-- 0001_init_multitenant.sql
-- Multi-tenant base: organizations, profiles, organization_members,
-- phone_to_org, and the handle_new_user() trigger that auto-provisions
-- everything when a user is created (signup web ou admin/users do n8n).
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Extensions (safe if already present)
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. organizations
-- ---------------------------------------------------------------------
CREATE TABLE public.organizations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  display_name text,
  settings     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. profiles (1:1 com auth.users)
-- ---------------------------------------------------------------------
CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  full_name     text,
  phone_e164    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_active_org ON public.profiles(active_org_id);

-- ---------------------------------------------------------------------
-- 3. organization_members
-- ---------------------------------------------------------------------
CREATE TYPE public.org_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

CREATE TABLE public.organization_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.org_role NOT NULL DEFAULT 'OWNER',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org  ON public.organization_members(org_id);

-- ---------------------------------------------------------------------
-- 4. phone_to_org (gating do WhatsApp)
-- ---------------------------------------------------------------------
CREATE TYPE public.subscription_status AS ENUM (
  'new_lead', 'trial', 'active', 'inactive', 'suspended', 'expired', 'cancelled'
);

CREATE TABLE public.phone_to_org (
  phone_number         text PRIMARY KEY,
  org_id               uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  org_name             text,
  status               public.subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at        timestamptz,
  daily_message_limit  int NOT NULL DEFAULT 50,
  messages_used_today  int NOT NULL DEFAULT 0,
  features_enabled     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_phone_to_org_status ON public.phone_to_org(status);
CREATE INDEX idx_phone_to_org_org    ON public.phone_to_org(org_id);

-- ---------------------------------------------------------------------
-- 5. updated_at touch trigger (compartilhado pelas tabelas mutáveis)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_orgs
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_touch_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_touch_phone_to_org
  BEFORE UPDATE ON public.phone_to_org
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 6. handle_new_user — provisiona org + member + profile + phone_to_org
--    Disparado em INSERT em auth.users (signup web ou /auth/v1/admin/users).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_org_id        uuid;
  v_phone         text := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.phone, '')
  );
  v_phone_digits  text := regexp_replace(COALESCE(v_phone, ''), '\D', '', 'g');
  v_name          text := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'name', ''),
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    split_part(COALESCE(NEW.email, ''), '@', 1),
    'Usuário'
  );
  v_status        public.subscription_status := 'trial';
BEGIN
  -- 1. cria a organização (1 user = 1 org no signup)
  INSERT INTO public.organizations(name, display_name)
  VALUES (v_name, v_name)
  RETURNING id INTO v_org_id;

  -- 2. profile vinculado já com active_org_id
  INSERT INTO public.profiles(id, active_org_id, full_name, phone_e164)
  VALUES (NEW.id, v_org_id, v_name, v_phone);

  -- 3. membership (OWNER por default)
  INSERT INTO public.organization_members(org_id, user_id, role)
  VALUES (v_org_id, NEW.id, 'OWNER');

  -- 4. phone_to_org só se houver telefone (signup web pode não ter)
  IF v_phone_digits <> '' THEN
    INSERT INTO public.phone_to_org(phone_number, org_id, org_name, status, trial_ends_at)
    VALUES (v_phone_digits, v_org_id, v_name, v_status, now() + interval '7 days')
    ON CONFLICT (phone_number) DO UPDATE
      SET org_id        = EXCLUDED.org_id,
          org_name      = EXCLUDED.org_name,
          status        = EXCLUDED.status,
          trial_ends_at = EXCLUDED.trial_ends_at,
          updated_at    = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------
-- 7. Helper de RLS — orgs do usuário logado.
--    Definido aqui porque é usado pelas policies das migrations seguintes.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.user_orgs()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT org_id
  FROM public.organization_members
  WHERE user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.user_orgs() TO authenticated, anon;

COMMIT;
