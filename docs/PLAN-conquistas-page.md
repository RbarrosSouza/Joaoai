# Página de Conquistas — João.ai

## Contexto

O João.ai é um assistente financeiro pessoal via WhatsApp com painel web. A aplicação usa React 19 + TypeScript + Vite + Tailwind CDN + Supabase Auth. O objetivo é criar uma **página de Conquistas** com dados reais do Supabase, acessível somente para usuários autenticados, com schema projetado para integração com o workflow N8N existente.

---

## Proposed Changes

### 1. Database — Supabase (Migrations)

#### [NEW] Migration: `create_achievements_tables`

Três tabelas novas:

**`achievement_definitions`** — Catálogo de todas as conquistas possíveis (seed)
- `id`, `slug` (unique), `category` (streak/transaction/behavior/financial)
- `subcategory`, `name`, `description`, `emoji`, `tier` (bronze/silver/gold/diamond)
- `threshold` (meta numérica), `sort_order`

**`user_achievements`** — Progresso do usuário por conquista
- `org_id` → FK organizations, `achievement_id` → FK achievement_definitions
- `current_value`, `unlocked`, `unlocked_at`
- UNIQUE(org_id, achievement_id)

**`user_streaks`** — Streaks de dias consecutivos por org
- `org_id` (unique) → FK organizations
- `current_streak`, `longest_streak`, `last_activity_date`

#### [NEW] Migration: `seed_achievement_definitions`

Seed com ~38 conquistas baseadas no HTML de referência:
- 6 de Streak (7d, 15d, 30d, 60d, 100d, 365d)
- 16 de Lançamentos (4x total transações, 4x valor registrado, 4x categorias, 4x dias ativos)
- 8 de Comportamento (foto, áudio, noturno, madrugador, raio, PDF, multimídia, pontual)
- 8 de Financeiro (economista, focado, poupador, organizado, etc.)

#### [NEW] Migration: `create_update_achievements_function`

Função RPC `update_achievements_after_transaction(p_org_id uuid)` chamável pelo N8N após cada lançamento:
1. Atualiza streak (verifica `last_activity_date`)
2. Conta total de transações → atualiza progresso
3. Soma valor total → atualiza progresso
4. Conta categorias distintas → atualiza progresso
5. Conta dias ativos no mês → atualiza progresso

**Integração N8N:** Após o nó "Lançar" inserir uma transação, adiciona-se uma chamada HTTP ao Supabase RPC:
```
POST /rest/v1/rpc/update_achievements_after_transaction
Body: { "p_org_id": "<org_id>" }
```

---

### 2. Frontend

#### [NEW] `components/Achievements.tsx` (~400 linhas)

Componente principal que busca dados reais do Supabase:
- Usa `useFinance()` para obter `transactions` e calcular stats
- Busca `achievement_definitions`, `user_achievements` e `user_streaks` via Supabase client
- Tema escuro com CSS scoped (variáveis CSS inline, não afeta o resto da app)
- Estrutura: Header → LevelCard → StreakBanner → Tabs → BadgeSections → NextUp → WhatsApp Preview
- Fontes `DM Sans` + `Space Mono` carregadas via link no componente

#### [MODIFY] `App.tsx` (+2 linhas)

```diff
+import Achievements from './components/Achievements';
 ...
               <Route path="/settings" element={<Settings />} />
+              <Route path="/conquistas" element={<Achievements />} />
```

#### [MODIFY] `Layout.tsx` (+3 linhas)

```diff
-import { ..., Layers, ... } from 'lucide-react';
+import { ..., Layers, Trophy, ... } from 'lucide-react';
 ...
             <NavItem path="/categories" icon={Layers} label="Categorias" />
+            <NavItem path="/conquistas" icon={Trophy} label="Conquistas" />
 ...
             <DrawerItem path="/categories" ... />
+            <DrawerItem path="/conquistas" icon={Trophy} label="Conquistas" desc="Badges e progresso" />
```

---

## Resumo de Arquivos

| Arquivo | Ação | Descrição |
|:--------|:-----|:----------|
| Supabase migrations (3) | **NOVO** | Tabelas, seed, função RPC |
| `components/Achievements.tsx` | **NOVO** | Página de conquistas (~400 linhas) |
| `App.tsx` | Modificar | +2 linhas (import + rota) |
| `Layout.tsx` | Modificar | +3 linhas (Trophy + NavItems) |

---

## Verification Plan

### Testes via Browser

1. **Auth guard:** Abrir `/#/conquistas` sem login → redireciona para `/login`
2. **Com login:** Navegar para `/conquistas` → página renderiza com dados do Supabase
3. **Sidebar desktop:** Item "Conquistas" com ícone Trophy visível e funcional
4. **Drawer mobile:** Item "Conquistas" no menu mobile
5. **Tabs de filtro:** Cada tab filtra as seções corretamente
6. **Responsividade:** 375px, 768px, 1440px — grid adapta

### Verificação de Dados

7. **SQL direto:** `SELECT * FROM achievement_definitions` → 38 registros seedados
8. **RPC:** Chamar `update_achievements_after_transaction` com um org_id válido → verifica se `user_achievements` e `user_streaks` são atualizados
