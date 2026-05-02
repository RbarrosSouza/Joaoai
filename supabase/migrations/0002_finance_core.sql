-- =====================================================================
-- 0002_finance_core.sql
-- Categorias, contas bancárias, cartões e transações.
-- Inclui sequence + trigger para gerar `code` (#0001) compatível com os
-- agentes do n8n (Joaoai Inteligencia, Editar/Excluir/Buscar Lancamento).
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
CREATE TYPE public.transaction_type      AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
CREATE TYPE public.transaction_status    AS ENUM ('PENDING', 'PAID', 'LATE');
CREATE TYPE public.transaction_frequency AS ENUM ('SINGLE', 'RECURRING', 'INSTALLMENT');
CREATE TYPE public.account_type          AS ENUM ('CHECKING', 'WALLET', 'SAVINGS', 'INVESTMENT');
CREATE TYPE public.payment_method        AS ENUM ('PIX', 'BOLETO', 'CREDIT_CARD', 'DEBIT', 'CASH', 'TRANSFER', 'OTHER');

-- ---------------------------------------------------------------------
-- Categorias (hierarquia self-FK via parent_id)
-- ---------------------------------------------------------------------
CREATE TABLE public.categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name       text NOT NULL,
  type       public.transaction_type NOT NULL DEFAULT 'EXPENSE',
  parent_id  uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  icon       text,
  color      text,
  is_group   boolean NOT NULL DEFAULT false,
  is_active  boolean NOT NULL DEFAULT true,
  sort_order int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_org_active ON public.categories(org_id, is_active);
CREATE INDEX idx_categories_parent     ON public.categories(parent_id);

CREATE TRIGGER trg_touch_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Contas bancárias
-- ---------------------------------------------------------------------
CREATE TABLE public.accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  bank_name       text,
  type            public.account_type NOT NULL DEFAULT 'CHECKING',
  balance         numeric(15, 2) NOT NULL DEFAULT 0,
  initial_balance numeric(15, 2) NOT NULL DEFAULT 0,
  icon            text DEFAULT 'landmark',
  color_from      text DEFAULT 'from-slate-500',
  color_to        text DEFAULT 'to-slate-700',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_org_active ON public.accounts(org_id, is_active);

CREATE TRIGGER trg_touch_accounts
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Cartões de crédito
-- ---------------------------------------------------------------------
CREATE TABLE public.credit_cards (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name         text NOT NULL,
  brand        text,
  "limit"      numeric(15, 2) NOT NULL DEFAULT 0,
  closing_day  int NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
  due_day      int NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  current_bill numeric(15, 2) NOT NULL DEFAULT 0,
  color_from   text DEFAULT 'from-slate-700',
  color_to     text DEFAULT 'to-slate-900',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cards_org_active ON public.credit_cards(org_id, is_active);

CREATE TRIGGER trg_touch_cards
  BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Transações (com geração automática de `code` 4 dígitos)
-- ---------------------------------------------------------------------
CREATE SEQUENCE public.seq_transaction_codes START 1;

CREATE TABLE public.transactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code            text UNIQUE,
  description     text NOT NULL,
  amount          numeric(15, 2) NOT NULL,
  date            date NOT NULL,
  competence_date date,
  payment_date    date,
  type            public.transaction_type NOT NULL,
  status          public.transaction_status NOT NULL DEFAULT 'PENDING',
  category_id     uuid REFERENCES public.categories(id)   ON DELETE SET NULL,
  subcategory_id  uuid REFERENCES public.categories(id)   ON DELETE SET NULL,
  account_id      uuid REFERENCES public.accounts(id)     ON DELETE SET NULL,
  credit_card_id  uuid REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  frequency       public.transaction_frequency NOT NULL DEFAULT 'SINGLE',
  installment_id  text,
  installments    jsonb,
  payment_method  public.payment_method,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tx_org_date     ON public.transactions(org_id, date DESC);
CREATE INDEX idx_tx_org_category ON public.transactions(org_id, category_id);
CREATE INDEX idx_tx_org_account  ON public.transactions(org_id, account_id);
CREATE INDEX idx_tx_org_card     ON public.transactions(org_id, credit_card_id);
CREATE INDEX idx_tx_org_status   ON public.transactions(org_id, status);

-- gera code zero-padded ('0001', '0042', '1048', ...) ao inserir.
CREATE OR REPLACE FUNCTION public.set_transaction_code()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND (NEW.code IS NULL OR NEW.code = '') THEN
    NEW.code := lpad(nextval('public.seq_transaction_codes')::text, 4, '0');
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tx_code
  BEFORE INSERT OR UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_transaction_code();

COMMIT;
