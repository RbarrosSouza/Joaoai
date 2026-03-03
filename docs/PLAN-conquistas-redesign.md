# Redesign — Página de Conquistas (Light Theme + Gamificação)

## Problema

A versão atual usa tema escuro com CSS inline, fora do design system do João.ai. O usuário quer:
- **Tema claro** consistente com o resto da app
- **Gamificação visual** com animações e micro-interações
- **Mobile-first** com pontuação e nível sempre em evidência
- **Atenção aos detalhes** em posicionamento, enquadramento e hierarquia

---

## Princípios do Design System Aplicados

| Princípio | Aplicação |
|:----------|:----------|
| "Design Redutivo" | Sem bordas pesadas, usar `card-base` com sombras difusas |
| "Luxo Digital" | Tipografia `Outfit` (sans), espaçamento generoso, verde como joia |
| "Jewel Tones" | `brand-lime` como acento, `brand-deep` para destaque, nunca fundos saturados |
| Fundo | `bg-brand-background` (#F7F9F8) com spotlight gradient |
| Cards | `.card-base` (rounded-3xl, border-white/60, shadow-premium) |
| Animações | `animate-slide-up`, `animate-fade-in`, hover `-translate-y-1` |
| Labels | `text-xs font-bold uppercase tracking-widest text-slate-400` |

---

## Proposed Changes

### [MODIFY] `components/Achievements.tsx` (reescrita completa ~450 linhas)

Troca do tema escuro para Tailwind classes consistentes com o app. Estrutura:

#### 1. Header (igual ao Dashboard)
- Saudação + título "Minhas Conquistas"
- Subtítulo `text-slate-400`
- Animação `animate-slide-up`

#### 2. Hero Card — Nível + Pontuação (mobile-first, sticky)
- **`card-base` com borda `border-brand-lime/20`**
- Lado esquerdo: nível em circle `bg-brand-deep text-brand-lime` (bold, grande)
- Título do nível (ex: "Estrategista") em `font-semibold text-slate-800`
- Barra de progresso XP (`bg-brand-lime` sobre `bg-slate-100`, rounded-full, animada)
- Lado direito: stats (`X/38 desbloqueados`)
- **Em mobile:** sticky no topo ao scrollar, com `glass-panel` + backdrop-blur
- Efeito: glow verde sutil no canto (`bg-brand-lime/5 blur-3xl`)

#### 3. Streak Banner
- `card-base` com toque de laranja (`bg-orange-50 border-orange-100`)
- Emoji 🔥 grande + dias + recorde
- Micro-animação no emoji (pulse lento)

#### 4. Tabs de Filtro
- Pills horizontais com scroll (`no-scrollbar`)
- Active: `bg-brand-deep text-white`, Inactive: `bg-white border-slate-100 text-slate-500`
- Transição suave `transition-all duration-200`

#### 5. Grid de Badges (por categoria)
- Header da seção: emoji + nome + contador `X/N`
- Grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`
- Cada badge é um **`card-base` miniatura**:
  - **Desbloqueado:** fundo branco, emoji colorido, nome `text-slate-800`, checkmark `text-brand-lime`, hover `shadow-premium -translate-y-1`
  - **Bloqueado:** `opacity-50`, emoji em `grayscale`, barra de progresso `bg-slate-100`
  - **Tier badge:** label `text-[9px] uppercase` com cor do tier (bronze #CD7F32, silver #C0C0C0, gold #FFD700, diamond #B9F2FF)
- Animação de entrada: `animate-slide-up` com `animationDelay` escalonado

#### 6. Próximas Conquistas
- Lista vertical com `card-base`, barra de progresso `bg-brand-lime`, percentual
- Efeito hover com expand sutil

#### 7. CTA WhatsApp
- Card com `bg-green-50 border-green-100`, ícone 📱
- Botão `bg-brand-deep text-white` (consistente com botões primários do app)

---

## Destaques Mobile

- **Hero card sticky:** Ao scrollar, o card de nível fica fixo no topo com `glass-panel`
- **Pontuação sempre visível:** Nível + XP + desbloqueados compactados
- **Grid 2 colunas:** badges em 2 cols no mobile, adaptando para 3-4 no desktop
- **Bottom padding:** `pb-48` para não cobrir a bottom nav

---

## Verification Plan

### Verificação pelo Usuário (Manual)

1. Acessar `/#/conquistas` logado
2. Conferir que a página usa o **tema claro** (fundo off-white, cards brancos)
3. Verificar que o **hero card de nível** está visível no topo
4. Em mobile (375px): verificar que o hero card fica sticky ao scrollar
5. Clicar nos **tabs** e confirmar que filtram corretamente
6. Verificar que **badges desbloqueados** têm emoji colorido e **bloqueados** estão em grayscale
7. Verificar animações suaves ao entrar na página
8. Comparar visualmente com o Dashboard para confirmar consistência de design
