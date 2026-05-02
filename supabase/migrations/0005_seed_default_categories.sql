-- Função reutilizável que popula categorias padrão para um org
CREATE OR REPLACE FUNCTION public.seed_default_categories(p_org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_alimentacao   uuid;
  v_transporte    uuid;
  v_moradia       uuid;
BEGIN
  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Alimentação', 'EXPENSE', true, NULL) RETURNING id INTO v_alimentacao;
  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Transporte', 'EXPENSE', true, NULL) RETURNING id INTO v_transporte;
  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Moradia', 'EXPENSE', true, NULL) RETURNING id INTO v_moradia;

  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Saúde', 'EXPENSE', true, NULL),
    (p_org_id, 'Lazer', 'EXPENSE', true, NULL),
    (p_org_id, 'Educação', 'EXPENSE', true, NULL),
    (p_org_id, 'Vestuário', 'EXPENSE', true, NULL),
    (p_org_id, 'Cuidados Pessoais', 'EXPENSE', true, NULL),
    (p_org_id, 'Serviços', 'EXPENSE', true, NULL),
    (p_org_id, 'Outros', 'EXPENSE', true, NULL),
    (p_org_id, 'Salário', 'INCOME', true, NULL),
    (p_org_id, 'Freelance', 'INCOME', true, NULL),
    (p_org_id, 'Investimentos', 'INCOME', true, NULL),
    (p_org_id, 'Outros Rendimentos', 'INCOME', true, NULL);

  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Aluguel', 'EXPENSE', true, v_moradia),
    (p_org_id, 'Contas (luz/água/gás)', 'EXPENSE', true, v_moradia),
    (p_org_id, 'Manutenção/Reparos', 'EXPENSE', true, v_moradia),
    (p_org_id, 'Internet/TV', 'EXPENSE', true, v_moradia);

  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Supermercado', 'EXPENSE', true, v_alimentacao),
    (p_org_id, 'Restaurante', 'EXPENSE', true, v_alimentacao),
    (p_org_id, 'Delivery', 'EXPENSE', true, v_alimentacao);

  INSERT INTO public.categories (org_id, name, type, is_active, parent_id) VALUES
    (p_org_id, 'Combustível', 'EXPENSE', true, v_transporte),
    (p_org_id, 'Uber/Táxi', 'EXPENSE', true, v_transporte);
END;
$$;

-- Atualiza handle_new_user para popular categorias padrão no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
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
  INSERT INTO public.organizations(name, display_name)
  VALUES (v_name, v_name)
  RETURNING id INTO v_org_id;

  INSERT INTO public.profiles(id, active_org_id, full_name, phone_e164)
  VALUES (NEW.id, v_org_id, v_name, v_phone);

  INSERT INTO public.organization_members(org_id, user_id, role)
  VALUES (v_org_id, NEW.id, 'OWNER');

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

  PERFORM public.seed_default_categories(v_org_id);

  RETURN NEW;
END;
$function$;
