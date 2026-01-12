# João.ai (FinZen) — Design System & Branding Guide
**Versão 2.0 (Refinamento Premium)**
*Última atualização: Janeiro 2026*

---

## 1. Design Rationale (Racionalidade das Decisões)

Este documento registra a transformação do João.ai de uma ferramenta administrativa funcional para um produto de consumo premium. Abaixo, explicamos o "porquê" por trás de cada decisão visual.

### 1.1. Filosofia: "Design Redutivo e Silencioso"
A decisão macro foi remover o ruído. Em interfaces financeiras, a ansiedade visual é alta. Para combater isso, adotamos uma abordagem onde a interface "sussurra" em vez de gritar.
*   **Decisão:** Removemos bordas sólidas cinzas (`border-gray-200`) e substituímos por sombras difusas (`shadow-premium`) e bordas brancas translúcidas.
*   **Resultado:** Os elementos parecem flutuar em camadas, criando profundidade sem peso visual.

### 1.2. O Conceito de "Luxo Digital"
O luxo em UI não vem de ornamentos, mas de espaço e tipografia.
*   **Decisão de Tipografia:** Substituímos a `Inter` (funcional) pela `Poppins` (geométrica e humana).
*   **Quebra de Padrão:** Decidimos *não* usar fontes monoespaçadas para os saldos principais (Dashboard). Usamos `Poppins Light` ou `ExtraLight`.
*   **Por quê?** Fontes monoespaçadas parecem "planilha/trabalho". Fontes geométricas finas parecem "revista/editorial". Isso muda a percepção do dinheiro de "contabilidade" para "patrimônio".

### 1.3. Profundidade e Atmosfera
O branco absoluto (`#FFFFFF`) sobre cinza chapado (`#F3F4F6`) parece software antigo.
*   **Ajuste:** Introduzimos um background com gradiente radial sutil ("Spotlight") e texturas de ruído (noise) em cards especiais (Insights).
*   **Resultado:** A interface ganhou tatibilidade e luz, parecendo mais "viva" e menos "digital estéril".

### 1.4. O Verde como Joia (Jewel Tones)
O verde é a cor da marca, mas usá-lo em excesso (botões, fundos, bordas) barateia o visual.
*   **Regra:** O verde (`brand-lime` e `brand-deep`) deve ser tratado como uma pedra preciosa. Ele aparece pouco, mas brilha.
*   **Aplicação:** Pequenos pontos de status, glows sutis atrás do avatar, ou barras de progresso finas. Nunca fundos inteiros saturados, exceto em ações primárias críticas.

---

## 2. Guia de Branding Oficial

### 2.1. Conceito da Marca
O João.ai não é um gerente de banco. É um **Concierge Financeiro Digital**.
*   **Personalidade:** Maduro, Calmo, Inteligente, Discreto.
*   **Emoção Alvo:** "Sinto que minha vida financeira está organizada e sob controle."
*   **Anti-Persona:** O João.ai NUNCA é: Infantil, Barulhento, Burocrático ou Alarmista.

### 2.2. Paleta de Cores (The Jewel Palette)

| Nome | Token Tailwind | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Deep Forest** | `bg-brand-deep` | `#133326` | Superfícies de navegação, textos de alto contraste. Autoridade. |
| **Electric Lime** | `bg-brand-lime` | `#95BD23` | Acentos, inovação, "AI", estados de sucesso. A "Joia". |
| **Paper White** | `bg-brand-background` | `#F7F9F8` | Fundo da aplicação. Não é branco puro, tem um toque de "papel de carta". |
| **Slate Soft** | `text-slate-400` | `#94a3b8` | Textos secundários. Nunca usamos preto puro (`#000000`) para textos. |

### 2.3. Tipografia (Editorial Financeiro)

**Fonte Primária:** `Poppins` (Google Fonts)
**Tracking Global:** `-0.02em` (Levemente apertado para elegância)

*   **Display (Saldos Gigantes):** `Font-Light` ou `Font-ExtraLight`.
    *   *Ex:* R$ 12.500,00
*   **Títulos de Seção:** `Font-SemiBold` ou `Font-Bold`, mas em tamanho menor.
    *   *Ex:* "Visão Geral"
*   **Rótulos (Labels):** `Font-Bold` + `Uppercase` + `Tracking-Widest` + Tamanho `xs` ou `xxs`.
    *   *Ex:* SALDO ATUAL

### 2.4. Componentes & UI Patterns

#### O "Card Premium"
O bloco construtivo fundamental do sistema.
*   **Shape:** `rounded-3xl` (24px) ou `rounded-2xl` (16px).
*   **Borda:** `border border-white/60` (quase imperceptível).
*   **Sombra:** `shadow-premium` (difusa, colorida com tom verde escuro, baixa opacidade).
*   **Comportamento:** Hover levanta levemente (`-translate-y-1`).

#### Botões e Ações
*   **Botões Primários:** `bg-brand-deep` text `brand-lime`. Sombra forte.
*   **Botões Secundários:** Pílulas brancas com borda sutil.
*   **Ícones:** Sempre `stroke-width={1.5}` ou `2`. Traços finos e elegantes. Nunca preenchidos (solid) a menos que seja para notificação ativa.

### 2.5. UX Principles (Experiência)

1.  **Privacidade Primeiro:** O sistema deve permitir ocultar valores (`isPrivacyMode`) facilmente, pois finanças são íntimas.
2.  **Insight sobre Dado:** Não mostre apenas uma tabela. Mostre o que o dado significa (ex: Card de Insight da IA).
3.  **Toque Humano:** Use saudações ("Boa tarde, João"), feedback visual de clique e transições suaves (`duration-300`, `ease-out`).

---

## 3. Como usar este guia

**Para Desenvolvedores:**
*   Não invente cores. Use estritamente as variáveis `brand-*` e `slate-*`.
*   Respeite os espaçamentos. O "ar" (whitespace) é o que define o luxo da interface. Se achar que está muito vazio, provavelmente está certo.

**Para IAs e Designers Futuros:**
*   Ao criar novas telas, pergunte-se: "Isso parece uma planilha ou um app de lifestyle?". Escolha o segundo.
*   **Regra de Ouro:** Se estiver em dúvida entre adicionar um elemento ou removê-lo, **remova-o**. A elegância está na subtração.

---
*FinZen Design System © 2026*
