-- Backfill icon/color em categorias existentes do Rodrigo + INSERT pais e
-- subcategorias faltantes da lista comprehensive (definida no 0006).
-- Idempotente: UPDATEs por nome são no-op se já estiverem aplicados;
-- INSERTs usam WHERE NOT EXISTS.

DO $$
DECLARE
  v_org uuid := '26e921ad-67c7-47ff-b283-6066ba49951a';
BEGIN

  -- =================================================================
  -- 2.1 — UPDATE categorias pai existentes (preserva IDs e transações)
  -- =================================================================

  -- Despesas
  UPDATE public.categories SET icon='coffee',       color='bg-orange-100 text-orange-600'   WHERE org_id=v_org AND parent_id IS NULL AND name='Alimentação';
  UPDATE public.categories SET icon='home',         color='bg-blue-100 text-blue-600'       WHERE org_id=v_org AND parent_id IS NULL AND name='Moradia';
  UPDATE public.categories SET icon='car',          color='bg-green-100 text-green-600'     WHERE org_id=v_org AND parent_id IS NULL AND name='Transporte';
  UPDATE public.categories SET icon='heart',        color='bg-red-100 text-red-600'         WHERE org_id=v_org AND parent_id IS NULL AND name='Saúde';
  UPDATE public.categories SET icon='grad',         color='bg-yellow-100 text-yellow-600'   WHERE org_id=v_org AND parent_id IS NULL AND name='Educação';
  UPDATE public.categories SET icon='music',        color='bg-purple-100 text-purple-600'   WHERE org_id=v_org AND parent_id IS NULL AND name='Lazer';
  UPDATE public.categories SET icon='shirt',        color='bg-pink-100 text-pink-600'       WHERE org_id=v_org AND parent_id IS NULL AND name='Vestuário';
  UPDATE public.categories SET icon='shopping-bag', color='bg-rose-100 text-rose-600'       WHERE org_id=v_org AND parent_id IS NULL AND name='Cuidados Pessoais';
  UPDATE public.categories SET name='Serviços & Taxas', icon='wrench', color='bg-slate-100 text-slate-600' WHERE org_id=v_org AND parent_id IS NULL AND name='Serviços';
  UPDATE public.categories SET icon='briefcase',    color='bg-gray-100 text-gray-600'       WHERE org_id=v_org AND parent_id IS NULL AND name='Outros';

  -- Receitas (renomear + icon/color)
  UPDATE public.categories SET name='Salário & CLT',                icon='briefcase', color='bg-green-100 text-green-700'   WHERE org_id=v_org AND parent_id IS NULL AND name='Salário';
  UPDATE public.categories SET name='Freelance & Autônomo',         icon='zap',       color='bg-blue-100 text-blue-700'     WHERE org_id=v_org AND parent_id IS NULL AND name='Freelance';
  UPDATE public.categories SET name='Investimentos & Rendimentos',  icon='piggy',     color='bg-violet-100 text-violet-700' WHERE org_id=v_org AND parent_id IS NULL AND name='Investimentos';
  UPDATE public.categories SET icon='landmark',                     color='bg-amber-100 text-amber-700' WHERE org_id=v_org AND parent_id IS NULL AND name='Outros Rendimentos';

  -- =================================================================
  -- 2.2 — UPDATE subcategorias existentes (herdam visual do pai)
  -- =================================================================

  -- Subcats de Alimentação
  UPDATE public.categories SET icon='coffee', color='bg-orange-100 text-orange-600'
    WHERE org_id=v_org AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Alimentação' AND parent_id IS NULL);

  -- Subcats de Moradia
  UPDATE public.categories SET icon='home', color='bg-blue-100 text-blue-600'
    WHERE org_id=v_org AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Moradia' AND parent_id IS NULL);
  -- Renomear "Aluguel" → "Aluguel/Prestação", "Manutenção/Reparos" → "Manutenção"
  UPDATE public.categories SET name='Aluguel/Prestação' WHERE org_id=v_org AND name='Aluguel'
    AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Moradia' AND parent_id IS NULL);
  UPDATE public.categories SET name='Manutenção' WHERE org_id=v_org AND name='Manutenção/Reparos'
    AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Moradia' AND parent_id IS NULL);

  -- Subcats de Transporte
  UPDATE public.categories SET icon='car', color='bg-green-100 text-green-600'
    WHERE org_id=v_org AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Transporte' AND parent_id IS NULL);
  -- Renomear "Uber/Táxi" → "Uber/Táxi/99"
  UPDATE public.categories SET name='Uber/Táxi/99' WHERE org_id=v_org AND name='Uber/Táxi'
    AND parent_id IN (SELECT id FROM public.categories WHERE org_id=v_org AND name='Transporte' AND parent_id IS NULL);

  -- =================================================================
  -- 2.3 — INSERT pais faltantes (4 despesas + 1 receita)
  -- =================================================================

  INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
  SELECT v_org, x.name, x.type::public.transaction_type, x.icon, x.color, true, NULL
  FROM (VALUES
    ('Compras & Tecnologia', 'EXPENSE', 'smartphone', 'bg-indigo-100 text-indigo-600'),
    ('Pets',                 'EXPENSE', 'dog',        'bg-amber-100 text-amber-600'),
    ('Família e Filhos',     'EXPENSE', 'baby',       'bg-teal-100 text-teal-600'),
    ('Doações',              'EXPENSE', 'gift',       'bg-emerald-100 text-emerald-600'),
    ('Benefícios',           'INCOME',  'gift',       'bg-teal-100 text-teal-700')
  ) AS x(name, type, icon, color)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.categories
    WHERE org_id=v_org AND name=x.name AND parent_id IS NULL
  );

END $$;

-- =================================================================
-- 2.4 — INSERT subcategorias faltantes (idempotente via NOT EXISTS)
-- =================================================================

-- Helper recurring pattern: para cada pai, inserir subcategorias que ainda não existem.
-- Usa CTE para resolver pai dinamicamente.

-- Alimentação
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'coffee', 'bg-orange-100 text-orange-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Alimentação' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Padaria/Café'), ('Feira/Hortifruti')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Moradia
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'home', 'bg-blue-100 text-blue-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Moradia' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Condomínio'), ('Energia Elétrica'), ('Água/Esgoto'), ('Gás')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Transporte
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'car', 'bg-green-100 text-green-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Transporte' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Transporte Público'), ('Estacionamento'), ('Manutenção do Carro'), ('Seguro/IPVA')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Saúde
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'heart', 'bg-red-100 text-red-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Saúde' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Plano de Saúde'), ('Consultas/Exames'), ('Farmácia'), ('Academia/Esportes'), ('Dentista'), ('Psicólogo/Terapia')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Educação
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'grad', 'bg-yellow-100 text-yellow-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Educação' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Escola/Faculdade'), ('Cursos/Especializações'), ('Livros/Material'), ('Idiomas')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Lazer
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'music', 'bg-purple-100 text-purple-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Lazer' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Streaming'), ('Cinema/Teatro'), ('Viagens/Hospedagem'), ('Bares/Festas'), ('Hobbies')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Vestuário
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'shirt', 'bg-pink-100 text-pink-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Vestuário' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Roupas'), ('Calçados'), ('Acessórios')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Compras & Tecnologia
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'smartphone', 'bg-indigo-100 text-indigo-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Compras & Tecnologia' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Eletrônicos'), ('Casa/Decoração'), ('Assinaturas Online'), ('Presentes')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Cuidados Pessoais
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'shopping-bag', 'bg-rose-100 text-rose-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Cuidados Pessoais' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Salão/Barbearia'), ('Cosméticos/Higiene'), ('Estética/Bem-estar')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Pets
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'dog', 'bg-amber-100 text-amber-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Pets' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Ração/Petisco'), ('Veterinário'), ('Banho/Tosa')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Família e Filhos
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'baby', 'bg-teal-100 text-teal-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Família e Filhos' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Escola dos Filhos'), ('Atividades Infantis'), ('Babá/Cuidados')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Serviços & Taxas
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'wrench', 'bg-slate-100 text-slate-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Serviços & Taxas' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Seguros'), ('Tarifas Bancárias'), ('Documentos/Cartório')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Doações
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'EXPENSE'::public.transaction_type, 'gift', 'bg-emerald-100 text-emerald-600', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Doações' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Igreja/Dízimo'), ('ONGs/Caridade'), ('Ajuda Familiar')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Salário & CLT
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'INCOME'::public.transaction_type, 'briefcase', 'bg-green-100 text-green-700', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Salário & CLT' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Salário Mensal'), ('13º Salário'), ('Bônus/PLR')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Freelance & Autônomo
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'INCOME'::public.transaction_type, 'zap', 'bg-blue-100 text-blue-700', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Freelance & Autônomo' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Projetos'), ('Consultoria'), ('Vendas Online')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Investimentos & Rendimentos
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'INCOME'::public.transaction_type, 'piggy', 'bg-violet-100 text-violet-700', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Investimentos & Rendimentos' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Dividendos'), ('Renda Fixa/CDB'), ('FIIs')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Benefícios
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'INCOME'::public.transaction_type, 'gift', 'bg-teal-100 text-teal-700', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Benefícios' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Vale Refeição/VA'), ('Auxílios do Governo'), ('FGTS')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);

-- Outros Rendimentos
INSERT INTO public.categories (org_id, name, type, icon, color, is_active, parent_id)
SELECT p.org_id, x.name, 'INCOME'::public.transaction_type, 'landmark', 'bg-amber-100 text-amber-700', true, p.id
FROM (SELECT id, org_id FROM public.categories WHERE org_id='26e921ad-67c7-47ff-b283-6066ba49951a' AND name='Outros Rendimentos' AND parent_id IS NULL) p
CROSS JOIN (VALUES ('Cashback/Reembolso'), ('Venda de Bens'), ('Aluguel de Imóvel')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.org_id=p.org_id AND c.name=x.name AND c.parent_id=p.id);
