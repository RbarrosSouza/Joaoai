# Supabase — João.ai

Migrations versionadas para reconstruir o backend do zero.

## Ordem de execução

As migrations são numeradas e **dependem da ordem**. Rode em sequência:

| # | Arquivo | O que cria |
|---|---|---|
| 0001 | `migrations/0001_init_multitenant.sql` | `organizations`, `profiles`, `organization_members`, `phone_to_org`, trigger `handle_new_user` (auto-provisão de org no signup), helper `user_orgs()` |
| 0002 | `migrations/0002_finance_core.sql` | `categories`, `accounts`, `credit_cards`, `transactions` + sequence + trigger pra gerar `code` (#0001) |
| 0003 | `migrations/0003_n8n_and_rls.sql` | `n8n_fila_mensagens`, `n8n_historico_mensagens`, `n8n_ai_audit_logs`, helper `increment_phone_message_count`, **RLS policies** |
| 0004 | `migrations/0004_achievements.sql` | `achievement_definitions` (com seed das 38 badges), `user_achievements`, `user_streaks`, RPCs `update_achievements_after_transaction` e `get_accounts_and_cards` |

## Como aplicar (caminho 1 — SQL Editor do dashboard)

1. Abrir [supabase.com/dashboard](https://supabase.com/dashboard) → projeto → **SQL Editor**.
2. Para cada arquivo, em ordem:
   - Copiar o conteúdo inteiro.
   - Colar no editor.
   - Rodar (`Cmd+Enter`).
   - Confirmar que voltou `Success. No rows returned`.
3. Habilitar extensões antes do 0001 se necessário (a migration já tenta criar `pgcrypto` e `uuid-ossp`, mas se faltar permissão use **Database → Extensions** na UI).

## Como aplicar (caminho 2 — Supabase CLI)

```bash
# Pré-requisitos: brew install supabase/tap/supabase
cd /caminho/do/projeto
supabase login
supabase link --project-ref <NEW_PROJECT_REF>
supabase db push    # aplica migrations na ordem
```

## Validação pós-migração

Rodar no SQL Editor:

```sql
-- 1. Tabelas criadas?
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Esperado: 14 tabelas (organizations, profiles, organization_members,
-- phone_to_org, categories, accounts, credit_cards, transactions,
-- n8n_fila_mensagens, n8n_historico_mensagens, n8n_ai_audit_logs,
-- achievement_definitions, user_achievements, user_streaks)

-- 2. Conquistas seedadas?
SELECT count(*) FROM achievement_definitions;
-- Esperado: 38

-- 3. Trigger handle_new_user funcionando?
-- Crie um user pelo dashboard (Auth → Users → Add user) com:
--   email: teste@example.com
--   user_metadata: { "name": "Teste", "phone": "5511999999999" }
-- Em seguida:
SELECT o.name, p.full_name, m.role, pho.status
FROM organizations o
JOIN profiles p ON p.active_org_id = o.id
JOIN organization_members m ON m.org_id = o.id
LEFT JOIN phone_to_org pho ON pho.org_id = o.id
WHERE p.full_name = 'Teste';
-- Deve retornar 1 linha com role=OWNER e status=trial.

-- 4. Trigger de code em transactions?
INSERT INTO transactions (org_id, description, amount, date, type)
VALUES ('<UUID-DA-ORG>', 'Teste', 10, current_date, 'EXPENSE')
RETURNING code;
-- Deve voltar '0001' (ou próximo da sequence).

-- 5. RPC de conquistas?
SELECT public.update_achievements_after_transaction('<UUID-DA-ORG>'::uuid);
-- Deve retornar JSON com streak, transactions_count, newly_unlocked, etc.
```

## Reset / dev local

Se algo der errado e quiser refazer do zero (⚠️ apaga TUDO):

```bash
supabase db reset
```

Ou via SQL:

```sql
-- Cuidado: derruba o schema inteiro
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;
-- depois reaplique todas as migrations
```

## Onde os segredos vão (importante)

| Var / segredo | Onde mora | Onde NÃO mora |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel envs (Production+Preview) e `.env.local` | OK no front |
| `VITE_SUPABASE_ANON_KEY` (JWT) | Vercel envs e `.env.local` | OK no front |
| `service_role` JWT | N8N → Settings → Variables (`SUPABASE_SERVICE_ROLE_KEY`) | **NUNCA** no front, nunca commitado |
| Senha do Postgres | N8N → Credentials (`Postgres João.ai`) | **NUNCA** no repo |

A chave antiga (do projeto deletado `mnraheergwwivdadynfi`) ainda aparece em texto puro no histórico de commits de `services/N8N/N8N - Atual.md`. Como o projeto foi deletado, o JWT ficou inerte — mas higiene exige reescrever esse arquivo na Fase 8 (rever plano em `~/.claude/plans/estamos-com-um-problema-moonlit-sedgewick.md`).
