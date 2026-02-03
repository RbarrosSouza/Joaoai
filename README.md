<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1m6zMWtW5NvJNK-dGvF6h7zLgu7y1fC4i

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Legado de Correções

### [2026-02-02] Correção de Inconsistência de Datas (Timezone/UTC)

**Problema Identificado:**
- Ao criar ou editar lançamentos, a data sugerida aparecia **1 dia depois** (ex: hoje é 02/02, mas mostrava 03/02)
- No histórico após lançado, a data aparecia **1 dia antes** (ex: lançado como 02/02, mostrava 01/02)

**Causa Raiz:**
O uso de `toISOString()` para manipulação de datas convertia automaticamente para UTC, causando deslocamento de ±1 dia dependendo do fuso horário do usuário.

Exemplo do problema:
```javascript
// ERRADO: Converte para UTC, pode mudar o dia!
new Date().toISOString().split('T')[0]  // Às 22:00 no Brasil (UTC-3), retorna o dia seguinte

// ERRADO: Ao parsear ISO string, interpreta como UTC
new Date("2026-02-02T00:00:00.000Z")  // No Brasil mostra 01/02 às 21:00
```

**Solução Implementada:**
Criado `utils/dateUtils.ts` com funções helper que preservam o timezone local:

- `toLocalDateString(date)` - Converte Date para "YYYY-MM-DD" local
- `getTodayString()` - Retorna hoje como "YYYY-MM-DD" local  
- `parseLocalDateString(str)` - Parseia "YYYY-MM-DD" como data local (meio-dia)
- `dateStringToLocalISO(str)` - Converte para ISO preservando a data local
- `isoToLocalDateString(iso)` - Extrai data de ISO string de forma segura

**Arquivos Modificados:**
- `utils/dateUtils.ts` (novo)
- `components/TransactionModal.tsx`
- `components/TransactionList.tsx`
- `components/Dashboard.tsx`
- `components/Analytics.tsx`
- `components/Planning.tsx`
- `services/FinanceContext.tsx`

**Como Usar (para futuras implementações):**
```typescript
import { getTodayString, toLocalDateString, dateStringToLocalISO, parseLocalDateString, isoToLocalDateString } from '../utils/dateUtils';

// Para obter hoje como string YYYY-MM-DD
const today = getTodayString();

// Para converter Date para string local
const dateStr = toLocalDateString(new Date());

// Para salvar no banco (ISO string que preserva a data)
const isoForDB = dateStringToLocalISO("2026-02-02");

// Para ler do banco e comparar/exibir
const dateFromDB = parseLocalDateString(isoToLocalDateString(transaction.date));
```

**IMPORTANTE:** Nunca use `toISOString().split('T')[0]` para manipular datas de usuário. Sempre use as funções de `dateUtils.ts`.
