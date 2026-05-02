-- Expande seed_default_categories com lista completa: 14 despesas + 5 receitas
-- com subcategorias, icon e color. Afeta apenas novos usuários (trigger handle_new_user).
CREATE OR REPLACE FUNCTION public.seed_default_categories(p_org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_alimentacao   uuid;
  v_moradia       uuid;
  v_transporte    uuid;
  v_saude         uuid;
  v_educacao      uuid;
  v_lazer         uuid;
  v_vestuario     uuid;
  v_compras       uuid;
  v_cuidados      uuid;
  v_pets          uuid;
  v_familia       uuid;
  v_servicos      uuid;
  v_doacoes       uuid;
  v_salario       uuid;
  v_freelance     uuid;
  v_investimentos uuid;
  v_beneficios    uuid;
  v_outros_rec    uuid;
BEGIN

  -- ----------------------------------------------------------------
  -- DESPESAS — categorias pai com subcategorias
  -- ----------------------------------------------------------------

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Alimentação', 'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, NULL)
  RETURNING id INTO v_alimentacao;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Moradia', 'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, NULL)
  RETURNING id INTO v_moradia;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Transporte', 'EXPENSE', 'car', 'bg-green-100 text-green-600', true, NULL)
  RETURNING id INTO v_transporte;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Saúde', 'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, NULL)
  RETURNING id INTO v_saude;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Educação', 'EXPENSE', 'grad', 'bg-yellow-100 text-yellow-600', true, NULL)
  RETURNING id INTO v_educacao;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Lazer', 'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, NULL)
  RETURNING id INTO v_lazer;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Vestuário', 'EXPENSE', 'shirt', 'bg-pink-100 text-pink-600', true, NULL)
  RETURNING id INTO v_vestuario;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Compras & Tecnologia', 'EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600', true, NULL)
  RETURNING id INTO v_compras;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Cuidados Pessoais', 'EXPENSE', 'shopping-bag', 'bg-rose-100 text-rose-600', true, NULL)
  RETURNING id INTO v_cuidados;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Pets', 'EXPENSE', 'dog', 'bg-amber-100 text-amber-600', true, NULL)
  RETURNING id INTO v_pets;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Família e Filhos', 'EXPENSE', 'baby', 'bg-teal-100 text-teal-600', true, NULL)
  RETURNING id INTO v_familia;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Serviços & Taxas', 'EXPENSE', 'wrench', 'bg-slate-100 text-slate-600', true, NULL)
  RETURNING id INTO v_servicos;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Doações', 'EXPENSE', 'gift', 'bg-emerald-100 text-emerald-600', true, NULL)
  RETURNING id INTO v_doacoes;

  -- Sem subcategorias
  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Outros', 'EXPENSE', 'briefcase', 'bg-gray-100 text-gray-600', true, NULL);

  -- ----------------------------------------------------------------
  -- RECEITAS — categorias pai com subcategorias
  -- ----------------------------------------------------------------

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Salário & CLT', 'INCOME', 'briefcase', 'bg-green-100 text-green-700', true, NULL)
  RETURNING id INTO v_salario;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Freelance & Autônomo', 'INCOME', 'zap', 'bg-blue-100 text-blue-700', true, NULL)
  RETURNING id INTO v_freelance;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Investimentos & Rendimentos', 'INCOME', 'piggy', 'bg-violet-100 text-violet-700', true, NULL)
  RETURNING id INTO v_investimentos;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Benefícios', 'INCOME', 'gift', 'bg-teal-100 text-teal-700', true, NULL)
  RETURNING id INTO v_beneficios;

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  VALUES (p_org_id, 'Outros Rendimentos', 'INCOME', 'landmark', 'bg-amber-100 text-amber-700', true, NULL)
  RETURNING id INTO v_outros_rec;

  -- ----------------------------------------------------------------
  -- SUBCATEGORIAS — Despesas
  -- ----------------------------------------------------------------

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Supermercado',     'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, v_alimentacao),
    (p_org_id, 'Restaurante',      'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, v_alimentacao),
    (p_org_id, 'Delivery',         'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, v_alimentacao),
    (p_org_id, 'Padaria/Café',     'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, v_alimentacao),
    (p_org_id, 'Feira/Hortifruti', 'EXPENSE', 'coffee', 'bg-orange-100 text-orange-600', true, v_alimentacao);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Aluguel/Prestação', 'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Condomínio',        'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Energia Elétrica',  'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Água/Esgoto',       'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Gás',               'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Internet/TV',       'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia),
    (p_org_id, 'Manutenção',        'EXPENSE', 'home', 'bg-blue-100 text-blue-600', true, v_moradia);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Combustível',        'EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte),
    (p_org_id, 'Uber/Táxi/99',       'EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte),
    (p_org_id, 'Transporte Público', 'EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte),
    (p_org_id, 'Estacionamento',     'EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte),
    (p_org_id, 'Manutenção do Carro','EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte),
    (p_org_id, 'Seguro/IPVA',        'EXPENSE', 'car', 'bg-green-100 text-green-600', true, v_transporte);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Plano de Saúde',    'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude),
    (p_org_id, 'Consultas/Exames',  'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude),
    (p_org_id, 'Farmácia',          'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude),
    (p_org_id, 'Academia/Esportes', 'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude),
    (p_org_id, 'Dentista',          'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude),
    (p_org_id, 'Psicólogo/Terapia', 'EXPENSE', 'heart', 'bg-red-100 text-red-600', true, v_saude);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Escola/Faculdade',       'EXPENSE', 'grad', 'bg-yellow-100 text-yellow-600', true, v_educacao),
    (p_org_id, 'Cursos/Especializações', 'EXPENSE', 'grad', 'bg-yellow-100 text-yellow-600', true, v_educacao),
    (p_org_id, 'Livros/Material',        'EXPENSE', 'grad', 'bg-yellow-100 text-yellow-600', true, v_educacao),
    (p_org_id, 'Idiomas',                'EXPENSE', 'grad', 'bg-yellow-100 text-yellow-600', true, v_educacao);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Streaming',          'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, v_lazer),
    (p_org_id, 'Cinema/Teatro',      'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, v_lazer),
    (p_org_id, 'Viagens/Hospedagem', 'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, v_lazer),
    (p_org_id, 'Bares/Festas',       'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, v_lazer),
    (p_org_id, 'Hobbies',            'EXPENSE', 'music', 'bg-purple-100 text-purple-600', true, v_lazer);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Roupas',     'EXPENSE', 'shirt', 'bg-pink-100 text-pink-600', true, v_vestuario),
    (p_org_id, 'Calçados',   'EXPENSE', 'shirt', 'bg-pink-100 text-pink-600', true, v_vestuario),
    (p_org_id, 'Acessórios', 'EXPENSE', 'shirt', 'bg-pink-100 text-pink-600', true, v_vestuario);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Eletrônicos',      'EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600', true, v_compras),
    (p_org_id, 'Casa/Decoração',   'EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600', true, v_compras),
    (p_org_id, 'Assinaturas Online','EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600', true, v_compras),
    (p_org_id, 'Presentes',        'EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600', true, v_compras);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Salão/Barbearia',    'EXPENSE', 'shopping-bag', 'bg-rose-100 text-rose-600', true, v_cuidados),
    (p_org_id, 'Cosméticos/Higiene', 'EXPENSE', 'shopping-bag', 'bg-rose-100 text-rose-600', true, v_cuidados),
    (p_org_id, 'Estética/Bem-estar', 'EXPENSE', 'shopping-bag', 'bg-rose-100 text-rose-600', true, v_cuidados);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Ração/Petisco', 'EXPENSE', 'dog', 'bg-amber-100 text-amber-600', true, v_pets),
    (p_org_id, 'Veterinário',   'EXPENSE', 'dog', 'bg-amber-100 text-amber-600', true, v_pets),
    (p_org_id, 'Banho/Tosa',   'EXPENSE', 'dog', 'bg-amber-100 text-amber-600', true, v_pets);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Escola dos Filhos',  'EXPENSE', 'baby', 'bg-teal-100 text-teal-600', true, v_familia),
    (p_org_id, 'Atividades Infantis','EXPENSE', 'baby', 'bg-teal-100 text-teal-600', true, v_familia),
    (p_org_id, 'Babá/Cuidados',      'EXPENSE', 'baby', 'bg-teal-100 text-teal-600', true, v_familia);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Seguros',              'EXPENSE', 'wrench', 'bg-slate-100 text-slate-600', true, v_servicos),
    (p_org_id, 'Tarifas Bancárias',    'EXPENSE', 'wrench', 'bg-slate-100 text-slate-600', true, v_servicos),
    (p_org_id, 'Documentos/Cartório',  'EXPENSE', 'wrench', 'bg-slate-100 text-slate-600', true, v_servicos);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Igreja/Dízimo',  'EXPENSE', 'gift', 'bg-emerald-100 text-emerald-600', true, v_doacoes),
    (p_org_id, 'ONGs/Caridade',  'EXPENSE', 'gift', 'bg-emerald-100 text-emerald-600', true, v_doacoes),
    (p_org_id, 'Ajuda Familiar', 'EXPENSE', 'gift', 'bg-emerald-100 text-emerald-600', true, v_doacoes);

  -- ----------------------------------------------------------------
  -- SUBCATEGORIAS — Receitas
  -- ----------------------------------------------------------------

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Salário Mensal', 'INCOME', 'briefcase', 'bg-green-100 text-green-700', true, v_salario),
    (p_org_id, '13º Salário',    'INCOME', 'briefcase', 'bg-green-100 text-green-700', true, v_salario),
    (p_org_id, 'Bônus/PLR',      'INCOME', 'briefcase', 'bg-green-100 text-green-700', true, v_salario);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Projetos',     'INCOME', 'zap', 'bg-blue-100 text-blue-700', true, v_freelance),
    (p_org_id, 'Consultoria',  'INCOME', 'zap', 'bg-blue-100 text-blue-700', true, v_freelance),
    (p_org_id, 'Vendas Online','INCOME', 'zap', 'bg-blue-100 text-blue-700', true, v_freelance);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Dividendos',   'INCOME', 'piggy', 'bg-violet-100 text-violet-700', true, v_investimentos),
    (p_org_id, 'Renda Fixa/CDB','INCOME','piggy', 'bg-violet-100 text-violet-700', true, v_investimentos),
    (p_org_id, 'FIIs',         'INCOME', 'piggy', 'bg-violet-100 text-violet-700', true, v_investimentos);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Vale Refeição/VA',   'INCOME', 'gift', 'bg-teal-100 text-teal-700', true, v_beneficios),
    (p_org_id, 'Auxílios do Governo','INCOME', 'gift', 'bg-teal-100 text-teal-700', true, v_beneficios),
    (p_org_id, 'FGTS',               'INCOME', 'gift', 'bg-teal-100 text-teal-700', true, v_beneficios);

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id) VALUES
    (p_org_id, 'Cashback/Reembolso', 'INCOME', 'landmark', 'bg-amber-100 text-amber-700', true, v_outros_rec),
    (p_org_id, 'Venda de Bens',      'INCOME', 'landmark', 'bg-amber-100 text-amber-700', true, v_outros_rec),
    (p_org_id, 'Aluguel de Imóvel',  'INCOME', 'landmark', 'bg-amber-100 text-amber-700', true, v_outros_rec);

END;
$$;
