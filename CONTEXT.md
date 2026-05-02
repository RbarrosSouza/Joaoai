# João.ai — Documento de Contexto do Projeto

> **Última atualização:** 2026-02-22

---

## 1. O que é o João.ai?

**João.ai** é um **assistente financeiro pessoal movido por IA** que funciona via **WhatsApp**. O usuário envia um áudio, foto de recibo ou PDF de nota fiscal pelo WhatsApp, e o João registra, categoriza e organiza automaticamente o lançamento financeiro. Todo o histórico, relatórios e análises podem ser consultados em um **painel web** complementar.

### Proposta de Valor

| Canal        | Para que serve                                                             |
|-------------|----------------------------------------------------------------------------|
| **WhatsApp** | Registro rápido de gastos/receitas via áudio, foto ou PDF. Zero atrito.   |
| **Painel Web** | Dashboard completo com análises, categorias, cartões, contas e planejamento. |

**Slogan:** *"Seu concierge financeiro pessoal. Sua tranquilidade financeira em um áudio."*

---

## 2. Público-Alvo

- Autônomos e freelancers
- Profissionais liberais (clínicas, consultórios, escritórios)
- Executivos e pequenos empresários
- Qualquer pessoa que quer controlar finanças sem abrir planilhas

---

## 3. Stack Tecnológica

### Frontend (Painel Web)

| Tecnologia         | Versão     | Uso                                    |
|--------------------|-----------|----------------------------------------|
| **React**          | 19.x      | Framework UI (SPA)                     |
| **TypeScript**     | 5.8       | Tipagem                               |
| **Vite**           | 6.x       | Build tool e dev server               |
| **Tailwind CSS**   | CDN       | Estilização (via script CDN)          |
| **Framer Motion**  | 12.x      | Animações e transições                |
| **Recharts**       | 3.x       | Gráficos e visualizações              |
| **Lucide React**   | 0.562     | Biblioteca de ícones                  |
| **React Router**   | 7.x       | Roteamento (HashRouter)               |

### Backend & Infraestrutura

| Tecnologia        | Uso                                          |
|-------------------|----------------------------------------------|
| **Supabase**      | Auth, Banco de Dados (Postgres), RLS         |
| **N8N**           | Automação de workflows (WhatsApp → Supabase) |
| **Vercel**        | Deploy e hospedagem do frontend              |

### Automação WhatsApp

O fluxo de entrada via WhatsApp é orquestrado pelo **N8N**:
1. Usuário envia mensagem (áudio/foto/PDF/texto) pelo WhatsApp
2. N8N recebe e processa a mensagem com IA
3. IA extrai dados financeiros (valor, descrição, categoria)
4. Lançamento é criado diretamente no Supabase
5. Usuário pode consultar tudo no painel web

---

## 4. Estrutura de Pastas

```
joão.ai/
├── App.tsx                    # Root da aplicação, define rotas
├── index.tsx                  # Entry point React
├── index.html                 # HTML principal (Tailwind config, fonts)
├── types.ts                   # Tipos TypeScript core (Transaction, Account, etc.)
├── constants.tsx              # Categorias padrão, presets de bancos, ícones
├── vite.config.ts             # Configuração do Vite
│
├── pages/
│   ├── Landing.tsx            # Landing page pública
│   ├── Login.tsx              # Página de login
│   ├── Signup.tsx             # Página de cadastro
│   └── AuthShell.tsx          # Layout compartilhado de auth
│
├── components/
│   ├── Dashboard.tsx          # Painel principal (saldos, gráficos, resumo)
│   ├── TransactionList.tsx    # Lista de lançamentos
│   ├── TransactionModal.tsx   # Modal de criação/edição de lançamento
│   ├── Analytics.tsx          # Relatórios e análises financeiras
│   ├── Planning.tsx           # Planejamento orçamentário
│   ├── Accounts.tsx           # Gestão de contas bancárias
│   ├── CreditCards.tsx        # Gestão de cartões de crédito
│   ├── Categories.tsx         # Gestão de categorias
│   ├── Settings.tsx           # Configurações do usuário
│   ├── Layout.tsx             # Layout com navbar e sidebar
│   ├── AppShell.tsx           # Shell autenticado
│   ├── RequireAuth.tsx        # Guard de autenticação
│   ├── Toast.tsx              # Sistema de notificações
│   ├── AccountFormModal.tsx   # Modal de conta bancária
│   ├── CardFormModal.tsx      # Modal de cartão de crédito
│   ├── CategorySettings.tsx   # Config de categorias
│   └── landing/               # Componentes da landing page
│       ├── HeroSection.tsx
│       ├── ProblemComparison.tsx
│       ├── HowItWorks.tsx
│       ├── FeaturesGrid.tsx
│       ├── UseCases.tsx
│       ├── Pricing.tsx
│       ├── FAQ.tsx
│       └── CallToAction.tsx
│
├── services/
│   ├── AuthContext.tsx                   # Context de autenticação (Supabase Auth)
│   ├── FinanceContext.tsx                # Context financeiro principal (estado global)
│   ├── supabaseClient.ts                # Client Supabase com validação de env
│   ├── financeTransactionsSupabase.ts    # CRUD de transações no Supabase
│   ├── financeEntitiesSupabase.ts        # CRUD de contas, cartões, categorias
│   ├── financeDefaults.ts               # Valores default para novo usuário
│   ├── financeStorage.ts                # Persistência local (localStorage)
│   └── N8N/                             # Assets relacionados ao N8N
│
├── utils/
│   ├── dateUtils.ts                     # Funções de data (timezone-safe)
│   ├── financeCategoryUtils.ts          # Resolução de categorias pai/sub
│   └── uuid.ts                          # Geração de UUIDs
│
└── public/
    └── Logos/                           # Assets de marca
```

---

## 5. Rotas da Aplicação

| Rota            | Componente        | Acesso        | Descrição                        |
|-----------------|-------------------|---------------|----------------------------------|
| `/`             | Landing           | Público       | Landing page de conversão        |
| `/login`        | Login             | Público       | Login (Supabase Auth)            |
| `/signup`       | Signup            | Público       | Cadastro de novo usuário         |
| `/dashboard`    | Dashboard         | Autenticado   | Painel principal                 |
| `/analytics`    | Analytics         | Autenticado   | Relatórios e gráficos            |
| `/transactions` | TransactionList   | Autenticado   | Lista de lançamentos             |
| `/cards`        | CreditCards       | Autenticado   | Cartões de crédito               |
| `/accounts`     | Accounts          | Autenticado   | Contas bancárias                 |
| `/categories`   | Categories        | Autenticado   | Categorias de despesa/receita    |
| `/planning`     | Planning          | Autenticado   | Planejamento e orçamento mensal  |
| `/settings`     | Settings          | Autenticado   | Configurações do usuário         |

> Roteamento usa `HashRouter` do react-router-dom.

---

## 6. Modelo de Dados (Supabase)

### Tabelas Principais

#### `organizations`
Entidade raiz multi-tenant. Todo dado financeiro pertence a uma organização.

| Coluna         | Tipo     | Descrição                    |
|---------------|----------|------------------------------|
| id            | uuid (PK)| ID da organização            |
| name          | text     | Nome interno                 |
| display_name  | text?    | Nome de exibição             |
| settings      | jsonb    | Configurações gerais         |

#### `profiles`
Perfil do usuário autenticado. Vincula ao `auth.users`.

| Coluna        | Tipo     | Descrição                    |
|--------------|----------|------------------------------|
| id           | uuid (PK)| FK → auth.users.id           |
| active_org_id| uuid?    | FK → organizations.id        |

#### `organization_members`
Vínculo N:N entre usuários e organizações.

| Coluna    | Tipo    | Descrição                      |
|----------|---------|--------------------------------|
| org_id   | uuid    | FK → organizations.id          |
| user_id  | uuid    | FK → auth.users.id             |
| role     | enum    | OWNER \| MEMBER                |

#### `transactions`
Lançamentos financeiros (receitas, despesas, transferências).

| Coluna          | Tipo     | Descrição                              |
|----------------|----------|----------------------------------------|
| id             | uuid (PK)| ID do lançamento                       |
| org_id         | uuid     | FK → organizations                     |
| description    | text     | Descrição do lançamento                |
| amount         | numeric  | Valor (sempre positivo)                |
| date           | date     | Data de vencimento/competência         |
| competence_date| date?    | Data de competência (DRE)              |
| payment_date   | date?    | Data de pagamento efetivo              |
| type           | enum     | INCOME \| EXPENSE \| TRANSFER          |
| status         | enum     | PENDING \| PAID \| LATE                |
| category_id    | uuid?    | FK → categories                        |
| account_id     | uuid?    | FK → accounts                          |
| credit_card_id | uuid?    | FK → credit_cards                      |
| supplier_id    | uuid?    | FK → suppliers                         |
| cost_center_id | uuid?    | FK → cost_centers                      |
| frequency      | enum     | SINGLE \| RECURRING \| INSTALLMENT     |
| installment_id | text?    | Agrupador de parcelas                  |
| installments   | jsonb?   | { current, total }                     |
| payment_method | enum?    | PIX, BOLETO, CREDIT_CARD, etc.         |

#### `accounts`
Contas bancárias/carteiras do usuário.

| Coluna          | Tipo     | Descrição                     |
|----------------|----------|-------------------------------|
| id             | uuid (PK)| ID da conta                   |
| org_id         | uuid     | FK → organizations            |
| name           | text     | Nome da conta                 |
| bank_name      | text?    | Ex: Nubank, Itaú              |
| type           | enum     | CHECKING \| WALLET \| SAVINGS \| INVESTMENT |
| balance        | numeric  | Saldo atual                   |
| initial_balance| numeric  | Saldo inicial                 |

#### `credit_cards`
Cartões de crédito.

| Coluna       | Tipo     | Descrição                   |
|-------------|----------|-----------------------------|
| id          | uuid (PK)| ID do cartão                |
| org_id      | uuid     | FK → organizations          |
| name        | text     | Nome do cartão              |
| brand       | text?    | Mastercard, Visa, etc.      |
| limit       | numeric  | Limite total                |
| closing_day | int      | Dia de fechamento (1-31)    |
| due_day     | int      | Dia de vencimento (1-31)    |
| current_bill| numeric  | Fatura atual                |

#### `categories`
Categorias financeiras (suporte a hierarquia pai/filho).

| Coluna    | Tipo     | Descrição                       |
|----------|----------|---------------------------------|
| id       | uuid (PK)| ID da categoria                 |
| org_id   | uuid     | FK → organizations              |
| name     | text     | Nome da categoria               |
| type     | enum     | INCOME \| EXPENSE \| TRANSFER   |
| parent_id| uuid?    | FK self → categories (subcategoria) |
| icon     | text?    | Ícone (lucide)                  |
| color    | text?    | Classes CSS de cor              |
| is_group | bool     | Se é agrupador                  |

#### `phone_to_org`
Mapeia telefones WhatsApp para organizações. Gerencia assinatura e trial.

| Coluna              | Tipo     | Descrição                          |
|--------------------|----------|------------------------------------|
| phone_number       | text     | Telefone E.164 (unique)            |
| org_id             | uuid     | FK → organizations                 |
| status             | text     | trial \| active \| inactive \| suspended \| cancelled |
| trial_ends_at      | timestamptz? | Fim do trial                   |
| daily_message_limit| int      | Limite diário de mensagens         |
| messages_used_today| int      | Mensagens usadas hoje              |

#### `whatsapp_identities`
Vincula identidades WhatsApp a usuários autenticados.

#### `n8n_historico_mensagens`
Histórico de mensagens processadas pelo N8N (341 registros).

#### `n8n_ai_audit_logs`
Logs de auditoria das interações com IA (104 registros).

#### `budgets`, `cost_centers`, `suppliers`
Tabelas auxiliares para planejamento orçamentário, centros de custo e fornecedores.

> **RLS habilitado** em todas as tabelas. Dados são isolados por `org_id`.

---

## 7. Arquitetura de Autenticação

- **Supabase Auth** com fluxo **PKCE** (ideal para SPAs)
- Login via telefone (OTP/SMS) ou e-mail  
- `AuthContext` gerencia sessão, loading state e sign-out
- `RequireAuth` protege rotas autenticadas
- `HashRouter` é usado para evitar conflitos com callbacks de auth

---

## 8. Gestão de Estado

O estado financeiro global é gerido pelo `FinanceContext`:

- **Dados carregados do Supabase** ao login: transações, contas, cartões, categorias
- **Multi-tenant**: dados filtrados por `org_id` (organização ativa do usuário)
- **Otimistic updates**: alterações são aplicadas localmente e persistidas assincronamente
- **Fallback**: configurações do usuário persistidas em `localStorage`

---

## 9. Design System

| Propriedade     | Valor                                     |
|----------------|-------------------------------------------|
| **Cor primária**| `#175E40` (Core brand green)              |
| **Cor accent**  | `#8CB82A` (Electric Lime)                 |
| **Dark BG**     | `#051A10` (Ultra dark forest)             |
| **Light BG**    | `#F0FDFA` (Light teal)                    |
| **Fonte body**  | Outfit / Inter (sans-serif)               |
| **Fonte display**| Playfair Display (serif)                 |
| **Estilo**      | Glassmorphism, gradients, micro-animações |
| **Ícones**      | Lucide React                              |

---

## 10. Integrações Externas

| Serviço           | Função                                           |
|-------------------|--------------------------------------------------|
| **Supabase**      | Auth + PostgreSQL + RLS                          |
| **N8N**           | Automação WhatsApp → IA → Supabase               |
| **Vercel**        | Deploy contínuo do frontend                      |
| **WhatsApp API**  | Canal de entrada para usuários registrarem gastos |

---

## 11. Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://hktcosudbmvqjmallyyl.supabase.co
VITE_SUPABASE_ANON_KEY=<jwt_anon_key>  # ver .env.local
```

> O client Supabase valida URL vs. key para evitar mismatch entre projetos. Prefere-se `VITE_SUPABASE_ANON_KEY` (JWT) para acesso completo ao REST API.

---

## 12. Supabase Project Info

| Propriedade    | Valor                                              |
|---------------|----------------------------------------------------|
| **Project ID** | `hktcosudbmvqjmallyyl`                             |
| **URL**        | `https://hktcosudbmvqjmallyyl.supabase.co`         |
| **Postgres**   | 17.x                                               |
| **Status**     | ✅ Reconstruído — todas as 4 migrations aplicadas  |

Migrations aplicadas (via MCP em 2026-04-30):
1. [supabase/migrations/0001_init_multitenant.sql](supabase/migrations/0001_init_multitenant.sql) — orgs, profiles, members, phone_to_org, trigger `handle_new_user`
2. [supabase/migrations/0002_finance_core.sql](supabase/migrations/0002_finance_core.sql) — categories, accounts, credit_cards, transactions + sequence/trigger de `code`
3. [supabase/migrations/0003_n8n_and_rls.sql](supabase/migrations/0003_n8n_and_rls.sql) — filas do n8n, helper de contagem de mensagens, RLS
4. [supabase/migrations/0004_achievements.sql](supabase/migrations/0004_achievements.sql) — 38 badges + RPCs `update_achievements_after_transaction` e `get_accounts_and_cards`

---

## 13. Padrões e Convenções

### Código

- **Frontend**: camelCase (React padrão)
- **Banco de dados**: snake_case (PostgreSQL padrão)
- **Mapeamento**: feito nos arquivos `financeEntitiesSupabase.ts` e `financeTransactionsSupabase.ts`

### Datas

> **REGRA CRÍTICA**: Nunca usar `toISOString().split('T')[0]` para datas de usuário.

Usar sempre as funções de `utils/dateUtils.ts`:
- `getTodayString()` — hoje como "YYYY-MM-DD" local
- `toLocalDateString(date)` — Date → "YYYY-MM-DD" local
- `parseLocalDateString(str)` — "YYYY-MM-DD" → Date local (meio-dia)
- `dateStringToLocalISO(str)` — para salvar no banco
- `isoToLocalDateString(iso)` — para ler do banco

### Categorias

- Categorias suportam hierarquia (pai + subcategorias)
- `financeCategoryUtils.ts` resolve IDs de subcategoria para categoria pai
- Isso é necessário porque o N8N pode enviar subcategory IDs

---

## 14. Funcionalidades Implementadas

- [x] Dashboard com saldos, gráficos e resumo mensal
- [x] CRUD completo de transações (receitas/despesas/transferências)
- [x] Gestão de contas bancárias (múltiplos bancos)
- [x] Gestão de cartões de crédito (com lógica de fechamento/vencimento)
- [x] Categorias com subcategorias e orçamento mensal
- [x] Analytics com gráficos (Recharts)
- [x] Planejamento orçamentário mensal
- [x] Autenticação (login/signup via Supabase Auth)
- [x] Landing page de alta conversão
- [x] Modo de privacidade (ocultar valores)
- [x] Sistema de toasts para feedback
- [x] Integração WhatsApp via N8N (áudio, foto, PDF)
- [x] Multi-tenant (organizações isoladas)
- [x] PWA-ready (manifest, ícones, meta tags)
- [x] Responsivo e mobile-first

---

## 15. Modelo de Negócio

O João.ai opera em modelo **freemium/SaaS**:
- **Trial gratuito** com limite diário de mensagens
- **Planos pagos** com funcionalidades expandidas
- Gerenciamento de status via tabela `phone_to_org` (trial → active → suspended)
