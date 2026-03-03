# 🏆 Sistema de Conquistas — Referência para N8N

> Documento de referência com as tabelas, função RPC e instruções de integração para o agente N8N.

---

## Tabelas

### `achievement_definitions` — Catálogo de conquistas

Tabela **read-only** com todas as conquistas possíveis (já seedada com 38 registros).

| Coluna | Tipo | Obrigatório | Default | Descrição |
|:-------|:-----|:------------|:--------|:----------|
| `id` | uuid | ✅ | `gen_random_uuid()` | PK |
| `slug` | text | ✅ | — | Identificador único (ex: `streak_7`, `tx_count_50`) |
| `category` | text | ✅ | — | `streak`, `transaction`, `behavior` ou `financial` |
| `subcategory` | text | ❌ | — | Subcategoria (ex: `total_transactions`, `total_value`) |
| `name` | text | ✅ | — | Nome do badge (ex: "Primeira Chama") |
| `description` | text | ✅ | — | Descrição curta (ex: "7 dias seguidos") |
| `emoji` | text | ✅ | 🏆 | Emoji do badge |
| `tier` | text | ❌ | — | `bronze`, `silver`, `gold` ou `diamond` (null = sem tier) |
| `threshold` | numeric | ✅ | 0 | Meta numérica para desbloquear |
| `sort_order` | int | ✅ | 0 | Ordem de exibição |

---

### `user_achievements` — Progresso do usuário

Armazena o progresso de cada organização em cada conquista.

| Coluna | Tipo | Obrigatório | Default | Descrição |
|:-------|:-----|:------------|:--------|:----------|
| `id` | uuid | ✅ | `gen_random_uuid()` | PK |
| `org_id` | uuid | ✅ | — | FK → `organizations(id)` |
| `achievement_id` | uuid | ✅ | — | FK → `achievement_definitions(id)` |
| `current_value` | numeric | ✅ | 0 | Progresso atual (ex: 42 transações) |
| `unlocked` | boolean | ✅ | false | Se a conquista foi desbloqueada |
| `unlocked_at` | timestamptz | ❌ | — | Data/hora do desbloqueio |
| `created_at` | timestamptz | ✅ | `now()` | — |
| `updated_at` | timestamptz | ✅ | `now()` | — |

**Constraint:** `UNIQUE(org_id, achievement_id)`

---

### `user_streaks` — Streak de atividade

Rastreia dias consecutivos de atividade por organização.

| Coluna | Tipo | Obrigatório | Default | Descrição |
|:-------|:-----|:------------|:--------|:----------|
| `id` | uuid | ✅ | `gen_random_uuid()` | PK |
| `org_id` | uuid | ✅ | — | FK → `organizations(id)`, UNIQUE |
| `current_streak` | int | ✅ | 0 | Streak atual em dias |
| `longest_streak` | int | ✅ | 0 | Maior streak já alcançado |
| `last_activity_date` | date | ❌ | — | Último dia em que houve atividade |
| `updated_at` | timestamptz | ✅ | `now()` | — |

---

## Função RPC: `update_achievements_after_transaction`

Função que **deve ser chamada pelo N8N** após cada transação ser inserida com sucesso.

### Como chamar

```
POST https://mnraheergwwivdadynfi.supabase.co/rest/v1/rpc/update_achievements_after_transaction

Headers:
  apikey: <SUPABASE_ANON_KEY ou SERVICE_ROLE_KEY>
  Authorization: Bearer <SERVICE_ROLE_KEY>
  Content-Type: application/json

Body:
{
  "p_org_id": "<uuid da organização>"
}
```

### O que a função faz automaticamente

1. **Atualiza o streak** — verifica `last_activity_date`:
   - Mesmo dia → sem mudança
   - Dia anterior → incrementa streak
   - Outro dia → reseta para 1

2. **Calcula métricas** da organização:
   - Total de transações (`COUNT(*)`)
   - Valor total registrado (`SUM(amount)`)
   - Categorias distintas usadas (`COUNT(DISTINCT category_id)`)
   - Dias ativos no mês atual

3. **Atualiza progresso** em todas as conquistas automáticas (streak, total_transactions, total_value, categories_used, active_days_month)

4. **Retorna JSON** com resumo:

```json
{
  "streak": 12,
  "longest_streak": 30,
  "transactions_count": 142,
  "total_value": 15420.50,
  "categories_count": 8,
  "active_days": 18,
  "newly_unlocked": ["Veterano", "Detalhista"]
}
```

### Quando chamar no workflow N8N

Adicionar um nó **HTTP Request** logo após o nó que insere a transação no banco (após o "Lançar"):

```
Método: POST
URL: https://mnraheergwwivdadynfi.supabase.co/rest/v1/rpc/update_achievements_after_transaction
Headers:
  apikey: {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
  Authorization: Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
  Content-Type: application/json
Body:
  { "p_org_id": "{{ $json.org_id }}" }
```

---

## Conquistas que NÃO são atualizadas automaticamente

As seguintes categorias precisam de lógica **customizada no N8N** para serem atualizadas:

### Comportamento (`behavior`)

| Slug | Nome | Como detectar no N8N |
|:-----|:-----|:---------------------|
| `behavior_photo` | Fotógrafo | Contar mensagens com `tipo_midia = 'image'` |
| `behavior_audio` | Locutor | Contar mensagens com `tipo_midia = 'audio'` |
| `behavior_night` | Noturno | `hora >= 22` no momento do registro |
| `behavior_morning` | Madrugador | `hora < 8` no momento do registro |
| `behavior_fast` | Raio | Tempo entre mensagem e lançamento < 10s |
| `behavior_pdf` | Burocrata | Contar mensagens com `tipo_midia = 'document'` |
| `behavior_multi` | Multimídia | Verificar se usou áudio, foto e texto no mesmo dia |
| `behavior_sameday` | Pontual | Data da transação = data da mensagem |

### Financeiro (`financial`)

| Slug | Nome | Como detectar no N8N |
|:-----|:-----|:---------------------|
| `fin_economist` | Economista | Comparar gastos do mês atual vs anterior |
| `fin_focused` | Focado | Verificar categorias dentro do orçamento |
| `fin_saver` | Poupador | Calcular `receitas - despesas >= 20%` |
| `fin_organized` | Organizado | Verificar cobertura de todas as categorias |
| `fin_needs_first` | Necessidades First | `gastos necessidades / total >= 50%` |
| `fin_freefall` | Em Queda Livre | 3 meses consecutivos com gastos menores |
| `fin_grade_a` | Nota A | Nota A no relatório mensal |
| `fin_golden_year` | Ano de Ouro | 12 meses usando o João.ai |

### Como atualizar conquistas manuais no N8N

```sql
-- Atualizar progresso de uma conquista específica
INSERT INTO user_achievements (org_id, achievement_id, current_value, unlocked, unlocked_at)
SELECT
  '<org_id>',
  id,
  <novo_valor>,
  (<novo_valor> >= threshold),
  CASE WHEN <novo_valor> >= threshold THEN now() ELSE NULL END
FROM achievement_definitions
WHERE slug = '<slug_da_conquista>'
ON CONFLICT (org_id, achievement_id) DO UPDATE SET
  current_value = EXCLUDED.current_value,
  unlocked = CASE WHEN user_achievements.unlocked THEN true ELSE EXCLUDED.unlocked END,
  unlocked_at = CASE WHEN user_achievements.unlocked THEN user_achievements.unlocked_at ELSE EXCLUDED.unlocked_at END,
  updated_at = now();
```

---

## Catálogo completo de conquistas (38 badges)

### 🔥 Streak (6)

| Slug | Nome | Meta |
|:-----|:-----|:-----|
| `streak_7` | Primeira Chama | 7 dias seguidos |
| `streak_15` | Consistente | 15 dias seguidos |
| `streak_30` | Diamante | 30 dias seguidos |
| `streak_60` | Realeza | 60 dias seguidos |
| `streak_100` | Centurião | 100 dias seguidos |
| `streak_365` | Lendário | 365 dias seguidos |

### 📊 Lançamentos — Total de Transações (4 tiers)

| Slug | Nome | Tier | Meta |
|:-----|:-----|:-----|:-----|
| `tx_count_10` | Iniciante | 🥉 Bronze | 10 transações |
| `tx_count_50` | Praticante | 🥈 Silver | 50 transações |
| `tx_count_200` | Veterano | 🥇 Gold | 200 transações |
| `tx_count_500` | Mestre dos Dados | 💎 Diamond | 500 transações |

### 📊 Lançamentos — Valor Total Registrado (4 tiers)

| Slug | Nome | Tier | Meta |
|:-----|:-----|:-----|:-----|
| `tx_value_1k` | Primeiro Mil | 🥉 Bronze | R$ 1.000 |
| `tx_value_10k` | Controlador | 🥈 Silver | R$ 10.000 |
| `tx_value_50k` | Magnata | 🥇 Gold | R$ 50.000 |
| `tx_value_200k` | Milionário dos Dados | 💎 Diamond | R$ 200.000 |

### 📊 Lançamentos — Categorias Diferentes (4 tiers)

| Slug | Nome | Tier | Meta |
|:-----|:-----|:-----|:-----|
| `cat_used_3` | Explorador | 🥉 Bronze | 3 categorias |
| `cat_used_5` | Diversificado | 🥈 Silver | 5 categorias |
| `cat_used_8` | Detalhista | 🥇 Gold | 8 categorias |
| `cat_used_12` | Taxonomista | 💎 Diamond | 12+ categorias |

### 📊 Lançamentos — Dias Ativos no Mês (4 tiers)

| Slug | Nome | Tier | Meta |
|:-----|:-----|:-----|:-----|
| `active_days_15` | Presente | 🥉 Bronze | 15 dias/mês |
| `active_days_20` | Frequente | 🥈 Silver | 20 dias/mês |
| `active_days_25` | Dedicado | 🥇 Gold | 25 dias/mês |
| `active_days_all` | Perfeição | 💎 Diamond | Mês inteiro |

### 🧠 Comportamento (8)

| Slug | Nome | Meta |
|:-----|:-----|:-----|
| `behavior_photo` | Fotógrafo | 10 registros por foto |
| `behavior_audio` | Locutor | 10 registros por áudio |
| `behavior_night` | Noturno | 20 registros após 22h |
| `behavior_morning` | Madrugador | 20 registros antes das 8h |
| `behavior_fast` | Raio | Registrou em < 10 segundos |
| `behavior_pdf` | Burocrata | 5 registros por PDF |
| `behavior_multi` | Multimídia | Áudio + foto + texto no mesmo dia |
| `behavior_sameday` | Pontual | 30 registros no mesmo dia do gasto |

### 💰 Financeiro (8)

| Slug | Nome | Meta |
|:-----|:-----|:-----|
| `fin_economist` | Economista | Gastou menos que mês anterior |
| `fin_focused` | Focado | 3 metas de categoria batidas |
| `fin_saver` | Poupador | Poupou 20%+ da receita |
| `fin_organized` | Organizado | Todas categorias preenchidas |
| `fin_needs_first` | Necessidades First | 50%+ em necessidades |
| `fin_freefall` | Em Queda Livre | 3 meses gastando menos |
| `fin_grade_a` | Nota A | Nota A no relatório mensal |
| `fin_golden_year` | Ano de Ouro | 12 meses usando o João.ai |
