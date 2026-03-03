import React, { useState, useEffect, useRef, useCallback } from "react";

const TOTAL_DURATION = 58000;

const TIMELINE = [
  // ═══ CENA 1: INTRO (0-3.5s) ═══
  { t: 0, type: "scene", scene: "intro" },
  { t: 500, type: "intro-logo" },
  { t: 1200, type: "intro-tagline" },
  { t: 2400, type: "intro-subtitle" },

  // ═══ CENA 2: WHATSAPP - TEXTO (3.5-14s) ═══
  { t: 3500, type: "scene", scene: "whatsapp" },
  { t: 4200, type: "typing-user" },
  { t: 5000, type: "msg", from: "user", text: "Gastei 47 reais no mercado", format: "text" },
  { t: 5800, type: "typing-joao" },
  { t: 6000, type: "reaction", emoji: "👍", target: "last-user" },
  { t: 7000, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\nAnotado! 🛒\n\n💰 R$ 47,00\n📍 Mercado\n📊 Alimentação\n📅 Hoje\n✅ Pago\n🔢 #1052", format: "text" },

  { t: 9500, type: "typing-user" },
  { t: 10200, type: "msg", from: "user", text: "Recebi 3000 de salário", format: "text" },
  { t: 11000, type: "typing-joao" },
  { t: 11200, type: "reaction", emoji: "💙", target: "last-user" },
  { t: 12200, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\nÉ isso aí! Salário na conta! 💰🎉\n\n💰 R$ 3.000,00\n📊 Salário\n📅 Hoje\n🔢 #1053", format: "text" },

  // ═══ CENA 3: WHATSAPP - ÁUDIO (14-22s) ═══
  { t: 14500, type: "typing-user" },
  { t: 15300, type: "msg", from: "user", text: "audio", format: "audio", duration: "0:04" },
  { t: 16500, type: "transcription", text: "\"Paguei oitenta reais de conta de luz\"" },
  { t: 17800, type: "typing-joao" },
  { t: 18000, type: "reaction", emoji: "👍", target: "last-user" },
  { t: 19000, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\nConta de luz registrada! ⚡\n\n💰 R$ 80,00\n📍 Conta de luz\n📊 Moradia\n📅 Hoje\n✅ Pago\n🔢 #1054", format: "text" },

  // ═══ CENA 4: WHATSAPP - IMAGEM/RECIBO (22-31s) ═══
  { t: 21500, type: "typing-user" },
  { t: 22300, type: "msg", from: "user", text: "image", format: "image" },
  { t: 23200, type: "image-scanning" },
  { t: 24800, type: "typing-joao" },
  { t: 25600, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\nRecibo processado! 📸\n\n💰 R$ 156,90\n📍 Posto Shell - Gasolina\n📊 Transporte\n📅 23/02/2026\n✅ Pago\n🔢 #1055", format: "text" },

  // ═══ CENA 5: EDIÇÃO (31-37s) ═══
  { t: 28500, type: "typing-user" },
  { t: 29200, type: "msg", from: "user", text: "Edita o #1052, era 57 não 47", format: "text" },
  { t: 30200, type: "typing-joao" },
  { t: 30400, type: "reaction", emoji: "✏️", target: "last-user" },
  { t: 31500, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\n🔢 #1052 atualizado! ✅\n\n💰 R$ 57,00 (era R$ 47,00)\n📍 Mercado\n📊 Alimentação", format: "text" },

  // ═══ CENA 6: CONSULTA (37-42s) ═══
  { t: 34000, type: "typing-user" },
  { t: 34700, type: "msg", from: "user", text: "Quanto gastei esse mês?", format: "text" },
  { t: 35500, type: "typing-joao" },
  { t: 36800, type: "msg", from: "joao", text: "💙 João - Finanças Pessoais\n\n📊 Resumo de Fevereiro:\n\n💸 Gastos: R$ 2.340,90\n💰 Receitas: R$ 3.000,00\n📈 Saldo: +R$ 659,10\n\n🏆 Top gastos:\n1. Alimentação — R$ 890,00\n2. Transporte — R$ 456,90\n3. Moradia — R$ 380,00\n\nVeja mais no painel:\n🔗 joaoai.app", format: "text" },

  // ═══ CENA 7: DASHBOARD PÁGINA 1 (40-48s) ═══
  { t: 40000, type: "scene", scene: "transition" },
  { t: 41500, type: "scene", scene: "dashboard1" },
  { t: 42000, type: "dash-cards" },
  { t: 43000, type: "dash-chart" },
  { t: 44500, type: "dash-donut" },

  // ═══ CENA 8: DASHBOARD PÁGINA 2 (48-52s) ═══
  { t: 47500, type: "scene", scene: "dashboard2" },
  { t: 48000, type: "dash2-list" },
  { t: 49000, type: "dash2-trend" },
  { t: 50500, type: "dash2-insight" },

  // ═══ CENA 9: CTA FINAL (52-58s) ═══
  { t: 52000, type: "scene", scene: "cta" },
  { t: 52500, type: "cta-title" },
  { t: 53500, type: "cta-features" },
  { t: 54500, type: "cta-button" },
  { t: 55500, type: "cta-url" },
];

// ─── PREMIUM SVG ICONS ───────────────────────────────────

function PremiumCoin({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <defs>
        <radialGradient id="pcg" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#FFF2A8" />
          <stop offset="35%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
        <radialGradient id="pcs" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <filter id="coinSh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000040" /></filter>
      </defs>
      <circle cx="30" cy="30" r="27" fill="url(#pcg)" stroke="#92400E" strokeWidth="1.2" filter="url(#coinSh)" />
      <circle cx="30" cy="30" r="22" fill="none" stroke="#B8860B" strokeWidth="0.6" opacity="0.4" />
      <circle cx="30" cy="30" r="27" fill="url(#pcs)" />
      <ellipse cx="22" cy="18" rx="8" ry="4" fill="#FFFDE7" opacity="0.25" transform="rotate(-20 22 18)" />
      <text x="30" y="38" textAnchor="middle" fontSize="24" fontWeight="800" fill="#7C5A00" fontFamily="'Outfit',serif" opacity="0.85">$</text>
    </svg>
  );
}

function PremiumCard({ size }: { size: number }) {
  const h = size * 0.65;
  return (
    <svg width={size} height={h} viewBox="0 0 72 47">
      <defs>
        <linearGradient id="cardG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#667EEA" /><stop offset="50%" stopColor="#5A67D8" /><stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="cardShine" x1="0" y1="0" x2="0.7" y2="0.7">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15" /><stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="cardSh"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#4338CA50" /></filter>
      </defs>
      <rect x="2" y="2" width="68" height="43" rx="8" fill="url(#cardG)" filter="url(#cardSh)" />
      <rect x="2" y="2" width="68" height="43" rx="8" fill="url(#cardShine)" />
      <rect x="8" y="12" width="14" height="10" rx="2.5" fill="#FFD700" opacity="0.9" />
      <rect x="10" y="14.5" width="10" height="1" rx="0.5" fill="#B8860B" opacity="0.4" />
      <rect x="10" y="17" width="10" height="1" rx="0.5" fill="#B8860B" opacity="0.4" />
      <rect x="8" y="28" width="32" height="2" rx="1" fill="#fff" opacity="0.15" />
      <circle cx="54" cy="32" r="7" fill="#EB001B" opacity="0.85" />
      <circle cx="62" cy="32" r="7" fill="#F79E1B" opacity="0.85" />
    </svg>
  );
}

function PremiumChart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <defs>
        <linearGradient id="bar1G" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#8CB82A" stopOpacity="0.6" /><stop offset="100%" stopColor="#8CB82A" /></linearGradient>
        <linearGradient id="bar2G" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.6" /><stop offset="100%" stopColor="#4ECDC4" /></linearGradient>
        <linearGradient id="bar3G" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" /><stop offset="100%" stopColor="#FFD700" /></linearGradient>
        <filter id="chartSh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000030" /></filter>
      </defs>
      <rect x="4" y="4" width="48" height="48" rx="12" fill="#0D2818" stroke="#8CB82A" strokeWidth="0.5" strokeOpacity="0.2" filter="url(#chartSh)" />
      <rect x="10" y="28" width="8" height="18" rx="2" fill="url(#bar1G)" />
      <rect x="22" y="18" width="8" height="28" rx="2" fill="url(#bar2G)" />
      <rect x="34" y="10" width="8" height="36" rx="2" fill="url(#bar3G)" />
      <path d="M14 26 L26 16 L38 8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" strokeDasharray="2 3" />
      <circle cx="14" cy="26" r="2" fill="#fff" opacity="0.6" />
      <circle cx="26" cy="16" r="2" fill="#fff" opacity="0.6" />
      <circle cx="38" cy="8" r="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}

function PremiumWallet({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <defs>
        <linearGradient id="walG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient>
        <linearGradient id="walShine" x1="0" y1="0" x2="0.5" y2="0.5"><stop offset="0%" stopColor="#fff" stopOpacity="0.2" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <filter id="walSh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7C3AED40" /></filter>
      </defs>
      <rect x="6" y="12" width="44" height="34" rx="8" fill="url(#walG)" filter="url(#walSh)" />
      <rect x="6" y="12" width="44" height="34" rx="8" fill="url(#walShine)" />
      <rect x="6" y="12" width="44" height="10" rx="8" fill="#6D28D9" opacity="0.5" />
      <rect x="32" y="26" width="20" height="12" rx="4" fill="#DDD6FE" opacity="0.3" />
      <circle cx="42" cy="32" r="3.5" fill="#EDE9FE" opacity="0.8" />
      <circle cx="42" cy="32" r="1.5" fill="#7C3AED" />
    </svg>
  );
}

function PremiumCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <defs>
        <radialGradient id="chkG" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#6EE7B7" /><stop offset="60%" stopColor="#22C55E" /><stop offset="100%" stopColor="#15803D" />
        </radialGradient>
        <filter id="chkSh"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#22C55E40" /></filter>
      </defs>
      <circle cx="28" cy="28" r="24" fill="url(#chkG)" filter="url(#chkSh)" />
      <ellipse cx="22" cy="18" rx="9" ry="5" fill="#fff" opacity="0.12" transform="rotate(-25 22 18)" />
      <path d="M17 28 L24 35 L40 19" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PremiumReceipt({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 56">
      <defs>
        <linearGradient id="rcpG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF3C7" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient>
        <filter id="rcpSh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B30" /></filter>
      </defs>
      <path d="M6 6 L6 48 L10 44 L14 48 L18 44 L22 48 L26 44 L30 48 L34 44 L38 48 L42 44 L42 6 Z" fill="url(#rcpG)" filter="url(#rcpSh)" />
      <rect x="12" y="14" width="24" height="2" rx="1" fill="#92400E" opacity="0.25" />
      <rect x="12" y="20" width="18" height="2" rx="1" fill="#92400E" opacity="0.2" />
      <rect x="12" y="26" width="20" height="2" rx="1" fill="#92400E" opacity="0.2" />
      <rect x="12" y="34" width="24" height="3" rx="1.5" fill="#92400E" opacity="0.35" />
    </svg>
  );
}

function PremiumMoney({ size }: { size: number }) {
  const h = size * 0.55;
  return (
    <svg width={size} height={h} viewBox="0 0 68 38">
      <defs>
        <linearGradient id="monG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22C55E" /><stop offset="50%" stopColor="#16A34A" /><stop offset="100%" stopColor="#15803D" /></linearGradient>
        <linearGradient id="monShine" x1="0" y1="0" x2="0.6" y2="0.6"><stop offset="0%" stopColor="#fff" stopOpacity="0.15" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <filter id="monSh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#16A34A40" /></filter>
      </defs>
      <rect x="2" y="2" width="64" height="34" rx="6" fill="url(#monG)" filter="url(#monSh)" />
      <rect x="2" y="2" width="64" height="34" rx="6" fill="url(#monShine)" />
      <circle cx="34" cy="19" r="10" fill="none" stroke="#BBF7D0" strokeWidth="1" opacity="0.3" />
      <text x="34" y="25" textAnchor="middle" fontSize="16" fontWeight="800" fill="#BBF7D0" fontFamily="'Outfit',serif" opacity="0.6">$</text>
    </svg>
  );
}

function PremiumShield({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <defs>
        <linearGradient id="shdG" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#4ECDC4" /><stop offset="100%" stopColor="#0D9488" /></linearGradient>
        <filter id="shdSh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0D948840" /></filter>
      </defs>
      <path d="M28 6 L46 14 L46 28 C46 40 28 50 28 50 C28 50 10 40 10 28 L10 14 Z" fill="url(#shdG)" filter="url(#shdSh)" />
      <path d="M28 6 L46 14 L46 28 C46 40 28 50 28 50" fill="#fff" opacity="0.08" />
      <path d="M21 28 L26 33 L36 23" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── FLOATING ELEMENTS CONFIG ────────────────────────────

const FLOAT_ITEMS = [
  { type: "coin", size: 42, rx: 220, ry: 280, speed: 0.032, startAngle: 20, delay: 0, bob: 10, bobSpeed: 1.6 },
  { type: "coin", size: 32, rx: 240, ry: 300, speed: 0.025, startAngle: 140, delay: 700, bob: 7, bobSpeed: 2.0 },
  { type: "coin", size: 36, rx: 230, ry: 290, speed: 0.029, startAngle: 255, delay: 1400, bob: 12, bobSpeed: 1.4 },
  { type: "card", size: 50, rx: 225, ry: 285, speed: 0.027, startAngle: 350, delay: 300, bob: 8, bobSpeed: 1.8 },
  { type: "chart", size: 40, rx: 238, ry: 298, speed: 0.022, startAngle: 115, delay: 1100, bob: 11, bobSpeed: 1.5 },
  { type: "check", size: 36, rx: 215, ry: 275, speed: 0.035, startAngle: 195, delay: 1700, bob: 7, bobSpeed: 2.1 },
  { type: "receipt", size: 34, rx: 235, ry: 295, speed: 0.024, startAngle: 305, delay: 2100, bob: 9, bobSpeed: 1.7 },
  { type: "wallet", size: 38, rx: 218, ry: 278, speed: 0.031, startAngle: 55, delay: 2700, bob: 8, bobSpeed: 1.9 },
  { type: "money", size: 42, rx: 242, ry: 305, speed: 0.028, startAngle: 175, delay: 3100, bob: 6, bobSpeed: 2.2 },
  { type: "shield", size: 34, rx: 210, ry: 270, speed: 0.033, startAngle: 240, delay: 500, bob: 9, bobSpeed: 1.6 },
  // Sparkle dots
  { type: "sparkle", size: 6, rx: 200, ry: 260, speed: 0.042, startAngle: 40, delay: 150, bob: 4, bobSpeed: 2.8 },
  { type: "sparkle", size: 8, rx: 255, ry: 320, speed: 0.019, startAngle: 130, delay: 900, bob: 5, bobSpeed: 2.4 },
  { type: "sparkle", size: 5, rx: 195, ry: 255, speed: 0.048, startAngle: 220, delay: 1500, bob: 3, bobSpeed: 3.0 },
  { type: "sparkle", size: 7, rx: 250, ry: 315, speed: 0.017, startAngle: 310, delay: 550, bob: 4, bobSpeed: 2.6 },
  { type: "sparkle", size: 5, rx: 205, ry: 265, speed: 0.045, startAngle: 165, delay: 1900, bob: 3, bobSpeed: 3.2 },
] as const;

const ICON_COMPONENTS: Record<string, React.FC<{ size: number }>> = {
  coin: PremiumCoin, card: PremiumCard, chart: PremiumChart, wallet: PremiumWallet,
  check: PremiumCheck, receipt: PremiumReceipt, money: PremiumMoney, shield: PremiumShield,
};

const GLOW_COLORS: Record<string, string> = {
  coin: "#FFD700", card: "#667EEA", chart: "#8CB82A", wallet: "#A78BFA",
  check: "#22C55E", receipt: "#F59E0B", money: "#22C55E", shield: "#4ECDC4", sparkle: "#8CB82A",
};

function FloatingElements() {
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      setTick(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <>
      {FLOAT_ITEMS.map((item, i) => {
        const t = Math.max(0, tick - item.delay);
        const fadeIn = Math.min(1, t / 1200);
        if (fadeIn <= 0) return null;

        const angle = (item.startAngle * Math.PI / 180) + t * item.speed * 0.001;
        const x = Math.cos(angle) * item.rx;
        const y = Math.sin(angle) * item.ry;
        const bobOffset = Math.sin(t * item.bobSpeed * 0.001) * item.bob;
        const scale = 1 + Math.sin(t * 0.0012 + i) * 0.1;
        const depthScale = 0.75 + (Math.sin(angle) + 1) * 0.175;
        const depthOpacity = 0.45 + (Math.sin(angle) + 1) * 0.275;
        const zIndex = Math.sin(angle) > 0 ? 10 : 0;
        const glowColor = GLOW_COLORS[item.type] || "#8CB82A";
        const IconComp = ICON_COMPONENTS[item.type];

        return (
          <div key={i} style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: `translate(${x.toFixed(1)}px, ${(y + bobOffset).toFixed(1)}px) scale(${(scale * depthScale).toFixed(3)})`,
            width: item.size, height: item.size,
            marginLeft: -item.size / 2, marginTop: -item.size / 2,
            opacity: fadeIn * (item.type === "sparkle" ? 0.55 : depthOpacity),
            filter: `drop-shadow(0 0 ${item.type === "sparkle" ? 6 : 14}px ${glowColor}50)`,
            pointerEvents: "none", zIndex,
            transition: "opacity 0.3s",
          }}>
            {IconComp && <IconComp size={item.size} />}
            {item.type === "sparkle" && (
              <svg width={item.size} height={item.size} viewBox="0 0 20 20">
                <defs>
                  <radialGradient id={`sp${i}`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={glowColor} stopOpacity="1" />
                    <stop offset="50%" stopColor={glowColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="10" cy="10" r="8" fill={`url(#sp${i})`} />
                <circle cx="10" cy="10" r="2" fill="#fff" opacity="0.8" />
              </svg>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── COMPONENTES ─────────────────────────────────────────

function WhatsAppHeader() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #075E54, #128C7E)",
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{ color: "#fff", fontSize: 20 }}>←</div>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: "linear-gradient(135deg, #8CB82A, #175E40)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>💙</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>João.ai</div>
        <div style={{ color: "#ffffffAA", fontSize: 12 }}>online</div>
      </div>
      <div style={{ display: "flex", gap: 18, color: "#fff", fontSize: 18 }}>
        <span>📹</span><span>📞</span><span>⋮</span>
      </div>
    </div>
  );
}

function TypingIndicator({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
      background: "#ffffff12", borderRadius: "16px 16px 16px 4px",
      width: "fit-content", marginBottom: 6, marginLeft: 8,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#8CB82A",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg, animIn, reaction }) {
  const isUser = msg.from === "user";
  const bubbleBg = isUser ? "#005C4B" : "#1F2C34";

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      padding: "3px 12px",
      opacity: animIn ? 1 : 0,
      transform: animIn ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
      transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <div style={{
        maxWidth: msg.format === "image" ? 240 : 310,
        padding: msg.format === "image" ? 4 : "8px 12px",
        borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        background: bubbleBg, position: "relative",
        boxShadow: "0 1px 3px #00000020",
        marginBottom: reaction ? 10 : 0,
      }}>
        {msg.format === "text" && (
          <div style={{
            fontSize: 14.5, color: "#E9EDEF", lineHeight: 1.45,
            whiteSpace: "pre-wrap", fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
          }}>{msg.text}</div>
        )}

        {msg.format === "audio" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", minWidth: 200 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #8CB82A, #175E40)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
            }}>▶</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "center", height: 24 }}>
                {Array.from({ length: 28 }, (_, i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2,
                    height: 4 + Math.sin(i * 0.8) * 10 + Math.random() * 8,
                    background: "#8CB82A", opacity: 0.7,
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#8696A0", marginTop: 2 }}>{msg.duration}</div>
            </div>
          </div>
        )}

        {msg.format === "image" && (
          <div style={{
            width: 232, height: 174, borderRadius: 8,
            background: "linear-gradient(135deg, #1a2e28, #0d1f18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              width: 140, background: "#f5f5f0", borderRadius: 4,
              padding: "10px 8px", transform: "rotate(-2deg)",
              boxShadow: "0 4px 12px #00000040",
            }}>
              <div style={{ textAlign: "center", borderBottom: "1px dashed #ccc", paddingBottom: 4, marginBottom: 6 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#333" }}>POSTO SHELL</div>
                <div style={{ fontSize: 6, color: "#888" }}>CNPJ: 12.345.678/0001-90</div>
              </div>
              <div style={{ fontSize: 6, color: "#555", lineHeight: 1.6 }}>
                <div>Gasolina Comum</div>
                <div>32,45L x R$4,83</div>
                <div style={{ borderTop: "1px solid #ddd", marginTop: 4, paddingTop: 4, fontWeight: 700, fontSize: 9, color: "#111" }}>
                  TOTAL: R$ 156,90
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <div style={{ fontSize: 5, color: "#999" }}>23/02/2026 14:32</div>
              </div>
            </div>
          </div>
        )}

        <div style={{
          fontSize: 11, color: "#ffffff60", textAlign: "right", marginTop: 4,
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
        }}>
          <span>{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, "0")}</span>
          {isUser && <span style={{ color: "#53BDEB", fontSize: 13 }}>✓✓</span>}
        </div>

        {reaction && (
          <div style={{
            position: "absolute", bottom: -10,
            right: isUser ? 8 : "auto", left: isUser ? "auto" : 8,
            background: "#1a2a23", borderRadius: 20, padding: "1px 5px",
            fontSize: 13, border: "1px solid #ffffff15",
            animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 10,
          }}>{reaction}</div>
        )}
      </div>
    </div>
  );
}

function TranscriptionBubble({ text, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      margin: "4px 12px 4px 50px", padding: "6px 12px", borderRadius: 10,
      background: "linear-gradient(135deg, #8CB82A15, #8CB82A08)",
      border: "1px solid #8CB82A30",
      fontSize: 12, color: "#8CB82A", fontStyle: "italic",
      animation: "fadeSlideUp 0.4s ease-out",
    }}>🎙️ Transcrição: {text}</div>
  );
}

function ScanningOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: 8,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#00000060", backdropFilter: "blur(2px)", zIndex: 5,
    }}>
      <div style={{
        padding: "8px 16px", borderRadius: 20,
        background: "#8CB82A20", border: "1px solid #8CB82A50",
        color: "#8CB82A", fontSize: 13, fontWeight: 600,
        animation: "pulse 1s ease-in-out infinite",
      }}>🔍 Processando recibo...</div>
    </div>
  );
}

// ─── SVG CHARTS ──────────────────────────────────────────

function DonutChart({ data, size = 120, strokeWidth = 16, animated }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff08" strokeWidth={strokeWidth} />
      {data.map((item, i) => {
        const pct = item.value / total;
        const dash = `${circ * pct} ${circ * (1 - pct)}`;
        const off = -circ * cum;
        cum += pct;
        return (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={item.color} strokeWidth={strokeWidth - 1}
            strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ opacity: animated ? 1 : 0, transition: `all 0.6s ease-out ${i * 120}ms` }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 5} textAnchor="middle" fill="#ffffff66" fontSize="9" fontFamily="Outfit">Total</text>
      <text x={size / 2} y={size / 2 + 11} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Outfit">R$ 2.340</text>
    </svg>
  );
}

function MiniLineChart({ data, color = "#8CB82A", w = 300, h = 55, animated }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const area = pts + ` ${w},${h} 0,${h}`;
  const last = data[data.length - 1];
  const lastY = h - ((last - min) / range) * (h - 8) - 4;
  return (
    <svg width={w} height={h} style={{ opacity: animated ? 1 : 0, transition: "opacity 0.6s" }}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaG)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r="3.5" fill={color} stroke="#051A10" strokeWidth="2" />
    </svg>
  );
}

// ─── CENAS ───────────────────────────────────────────────

function IntroScene({ progress }) {
  const logoVis = progress > 500;
  const tagVis = progress > 1200;
  const subVis = progress > 2400;
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 40% 40%, #0d2e1e, #051A10 70%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: "linear-gradient(#8CB82A 1px, transparent 1px), linear-gradient(90deg, #8CB82A 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, #8CB82A15, transparent 70%)", animation: "pulse 3s ease-in-out infinite"
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        opacity: logoVis ? 1 : 0, transform: logoVis ? "scale(1)" : "scale(0.7)",
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, #8CB82A, #175E40)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, boxShadow: "0 0 40px #8CB82A30"
        }}>💙</div>
        <span style={{ fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: "-2px" }}>João.ai</span>
      </div>
      <div style={{
        fontSize: 18, color: "#8CB82A", fontWeight: 300, letterSpacing: 3, textTransform: "uppercase",
        opacity: tagVis ? 1 : 0, transform: tagVis ? "translateY(0)" : "translateY(15px)", transition: "all 0.6s ease-out",
      }}>Se liga em como é fácil</div>
      <div style={{
        fontSize: 16, color: "#ffffff55", fontWeight: 300, marginTop: 8,
        opacity: subVis ? 1 : 0, transition: "opacity 0.5s ease-out",
      }}>Veja como funciona na prática</div>
    </div>
  );
}

function Dashboard1Scene({ progress }) {
  const cardsVis = progress > 500;
  const chartVis = progress > 1500;
  const donutVis = progress > 3000;
  const cats = [
    { name: "Alimentação", value: 890, color: "#8CB82A" },
    { name: "Transporte", value: 457, color: "#4ECDC4" },
    { name: "Moradia", value: 380, color: "#FF6B6B" },
    { name: "Lazer", value: 245, color: "#FFE66D" },
    { name: "Saúde", value: 189, color: "#A78BFA" },
    { name: "Outros", value: 180, color: "#6B7280" },
  ];
  const bars = [28, 35, 22, 45, 38, 52, 41, 33, 48, 29, 55, 42, 36, 50, 30, 44, 39, 47, 25, 53, 40, 32, 46, 37];
  const bMax = Math.max(...bars);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#051A10", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #8CB82A, #175E40)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13
          }}>💙</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#ffffff55", fontSize: 11 }}>Fev 2026</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#8CB82A" }} />
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: 7, opacity: cardsVis ? 1 : 0, transform: cardsVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease-out" }}>
        {[
          { label: "Receitas", value: "3.000", icon: "📈", color: "#8CB82A", pre: "R$" },
          { label: "Despesas", value: "2.340", icon: "📉", color: "#FF6B6B", pre: "R$" },
          { label: "Saldo", value: "659", icon: "💰", color: "#4ECDC4", pre: "+R$" },
        ].map((c, i) => (
          <div key={i} style={{
            flex: 1, padding: "8px 8px", borderRadius: 10,
            background: `linear-gradient(135deg, ${c.color}10, ${c.color}04)`,
            border: `1px solid ${c.color}20`, borderLeft: `3px solid ${c.color}`,
          }}>
            <div style={{ fontSize: 9, color: "#ffffff55", marginBottom: 2, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
            </div>
            <div style={{ fontSize: 9, color: "#ffffff44" }}>{c.pre}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.color, letterSpacing: "-0.5px" }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{
        borderRadius: 10, background: "#ffffff05", border: "1px solid #ffffff10", padding: "8px 10px",
        opacity: chartVis ? 1 : 0, transform: chartVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease-out 0.15s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#ffffff66" }}>Gastos diários</span>
          <span style={{ fontSize: 9, color: "#8CB82A", fontWeight: 600 }}>📊 Fevereiro</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 70 }}>
          {bars.map((v, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: "2px 2px 0 0",
              height: chartVis ? `${(v / bMax) * 100}%` : "0%",
              background: i === bars.length - 1
                ? "linear-gradient(to top, #8CB82A, #8CB82ACC)"
                : i % 7 === 0 ? "linear-gradient(to top, #8CB82A55, #8CB82A18)" : "linear-gradient(to top, #8CB82A30, #8CB82A0A)",
              transition: `height 0.5s ease-out ${i * 20}ms`,
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {["1", "7", "14", "21", "24"].map(d => <span key={d} style={{ fontSize: 7, color: "#ffffff28" }}>{d}</span>)}
        </div>
      </div>

      {/* Donut + Legend */}
      <div style={{
        borderRadius: 10, background: "#ffffff05", border: "1px solid #ffffff10", padding: "8px 10px",
        display: "flex", gap: 10, alignItems: "center", flex: 1,
        opacity: donutVis ? 1 : 0, transform: donutVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease-out 0.3s",
      }}>
        <DonutChart data={cats} size={105} strokeWidth={13} animated={donutVis} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span style={{ fontSize: 10, color: "#ffffff55", marginBottom: 1 }}>Por categoria</span>
          {cats.slice(0, 5).map((cat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#ffffffAA", flex: 1 }}>{cat.name}</span>
              <span style={{ fontSize: 9, color: "#ffffff55" }}>{Math.round(cat.value / 23.4)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
        <div style={{ width: 14, height: 3, borderRadius: 2, background: "#8CB82A" }} />
        <div style={{ width: 7, height: 3, borderRadius: 2, background: "#ffffff15" }} />
      </div>
    </div>
  );
}

function Dashboard2Scene({ progress }) {
  const listVis = progress > 500;
  const trendVis = progress > 1500;
  const insightVis = progress > 3000;
  const trendData = [1200, 1450, 980, 1680, 1320, 1890, 2100, 1750, 2340];
  const mos = ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev"];
  const txs = [
    { desc: "Mercado", cat: "Alimentação", val: "57,00", icon: "🛒", color: "#8CB82A", time: "Hoje" },
    { desc: "Salário", cat: "Renda", val: "3.000,00", icon: "💰", color: "#4ECDC4", time: "Hoje", inc: true },
    { desc: "Conta de luz", cat: "Moradia", val: "80,00", icon: "⚡", color: "#FF6B6B", time: "Hoje" },
    { desc: "Posto Shell", cat: "Transporte", val: "156,90", icon: "⛽", color: "#FFE66D", time: "Hoje" },
    { desc: "Farmácia", cat: "Saúde", val: "45,00", icon: "💊", color: "#A78BFA", time: "Ontem" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: "#051A10", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #8CB82A, #175E40)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13
          }}>💙</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Analytics</span>
        </div>
        <span style={{ color: "#ffffff55", fontSize: 11 }}>Fev 2026</span>
      </div>

      {/* Trend */}
      <div style={{
        borderRadius: 10, background: "#ffffff05", border: "1px solid #ffffff10", padding: "8px 10px",
        opacity: trendVis ? 1 : 0, transform: trendVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#ffffff66" }}>Tendência de gastos</span>
          <span style={{ fontSize: 9, color: "#FF6B6B", fontWeight: 600 }}>↑ 12% vs Jan</span>
        </div>
        <MiniLineChart data={trendData} color="#8CB82A" w={318} h={50} animated={trendVis} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {mos.map((m, i) => <span key={i} style={{ fontSize: 7, color: i === mos.length - 1 ? "#8CB82A" : "#ffffff28" }}>{m}</span>)}
        </div>
      </div>

      {/* Transactions */}
      <div style={{
        borderRadius: 10, background: "#ffffff05", border: "1px solid #ffffff10", padding: "8px 10px", flex: 1,
        opacity: listVis ? 1 : 0, transform: listVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease-out 0.15s",
      }}>
        <div style={{ fontSize: 11, color: "#ffffff66", marginBottom: 6 }}>Últimos lançamentos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {txs.map((tx, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 8, background: "#ffffff03",
              opacity: listVis ? 1 : 0, transform: listVis ? "translateX(0)" : "translateX(-15px)",
              transition: `all 0.4s ease-out ${i * 80}ms`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: `${tx.color}12`, border: `1px solid ${tx.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>{tx.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#ffffffDD", fontWeight: 500 }}>{tx.desc}</div>
                <div style={{ fontSize: 9, color: "#ffffff44" }}>{tx.cat} · {tx.time}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tx.inc ? "#8CB82A" : "#FF6B6B" }}>
                {tx.inc ? "+" : "-"}R$ {tx.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div style={{
        borderRadius: 10, padding: "8px 12px",
        background: "linear-gradient(135deg, #8CB82A10, #8CB82A04)", border: "1px solid #8CB82A20",
        opacity: insightVis ? 1 : 0, transform: insightVis ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s ease-out",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <div>
            <div style={{ fontSize: 11, color: "#8CB82A", fontWeight: 600 }}>Insight do João</div>
            <div style={{ fontSize: 10, color: "#ffffff77", marginTop: 1 }}>Gastos com alimentação subiram 15%. Quer definir um orçamento?</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
        <div style={{ width: 7, height: 3, borderRadius: 2, background: "#ffffff15" }} />
        <div style={{ width: 14, height: 3, borderRadius: 2, background: "#8CB82A" }} />
      </div>
    </div>
  );
}

function TransitionScene() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "#051A10",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16
    }}>
      <div style={{ fontSize: 42, animation: "pulse 1s ease-in-out infinite" }}>📊</div>
      <div style={{ fontSize: 18, color: "#8CB82A", fontWeight: 600, animation: "fadeSlideUp 0.5s ease-out" }}>Abrindo Dashboard...</div>
      <div style={{ fontSize: 13, color: "#ffffff55" }}>joaoai.app</div>
    </div>
  );
}

function CTAScene({ progress }) {
  const titleVis = progress > 500, featVis = progress > 1500, btnVis = progress > 2500, urlVis = progress > 3500;
  const feats = ["🎙️ Áudio, foto, PDF ou texto", "🤖 IA que entende e categoriza", "📊 Dashboard completo", "⚡ Zero atrito, controle total"];
  return (
    <div style={{
      position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #0d2e1e, #051A10 70%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 30
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05,
        backgroundImage: "radial-gradient(#8CB82A 1px, transparent 1px)", backgroundSize: "24px 24px"
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
        opacity: titleVis ? 1 : 0, transform: titleVis ? "scale(1)" : "scale(0.8)",
        transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #8CB82A, #175E40)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 0 30px #8CB82A30"
        }}>💙</div>
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>João.ai</div>
          <div style={{ fontSize: 14, color: "#8CB82A", fontWeight: 300 }}>Suas finanças no WhatsApp</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {feats.map((f, i) => (
          <div key={i} style={{
            fontSize: 17, color: "#ffffffDD", fontWeight: 400,
            opacity: featVis ? 1 : 0, transform: featVis ? "translateX(0)" : "translateX(-20px)",
            transition: `all 0.4s ease-out ${i * 120}ms`
          }}>{f}</div>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: "16px 44px", borderRadius: 100, background: "linear-gradient(135deg, #8CB82A, #6DA020)",
        color: "#000", fontSize: 18, fontWeight: 700, boxShadow: "0 0 40px #8CB82A40",
        opacity: btnVis ? 1 : 0, transform: btnVis ? "scale(1)" : "scale(0.9)",
        transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>Teste grátis 7 dias</div>
      <div style={{
        fontSize: 15, color: "#ffffff55", fontWeight: 300,
        opacity: urlVis ? 1 : 0, transition: "opacity 0.4s ease-out"
      }}>joaoai.app</div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────

export default function JoaoAiDemoVideo() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(false);
  const [typingJoao, setTypingJoao] = useState(false);
  const [currentScene, setCurrentScene] = useState("intro");
  const [sceneStart, setSceneStart] = useState(0);
  const [reactions, setReactions] = useState({});
  const [showTranscription, setShowTranscription] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [showScanning, setShowScanning] = useState(false);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const processedEventsRef = useRef(new Set());
  const chatRef = useRef(null);
  const lastUserMsgIdRef = useRef(null);

  const reset = useCallback(() => {
    setCurrentTime(0); setMessages([]); setTypingUser(false); setTypingJoao(false);
    setCurrentScene("intro"); setSceneStart(0); setReactions({});
    setShowTranscription(false); setShowScanning(false);
    processedEventsRef.current = new Set(); lastUserMsgIdRef.current = null;
    lastTimeRef.current = Date.now();
  }, []);

  const processEvents = useCallback((time) => {
    TIMELINE.forEach((evt, idx) => {
      if (evt.t <= time && !processedEventsRef.current.has(idx)) {
        processedEventsRef.current.add(idx);
        switch (evt.type) {
          case "scene":
            setCurrentScene(evt.scene); setSceneStart(time);
            if (evt.scene === "whatsapp") { setTypingUser(false); setTypingJoao(false); }
            break;
          case "typing-user": setTypingUser(true); setTypingJoao(false); break;
          case "typing-joao": setTypingJoao(true); setTypingUser(false); break;
          case "msg":
            setTypingUser(false); setTypingJoao(false);
            setMessages(prev => [...prev, { ...evt, id: idx, visible: true }]);
            if (evt.from === "user") lastUserMsgIdRef.current = idx;
            setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
            break;
          case "reaction":
            if (lastUserMsgIdRef.current !== null) {
              const tid = lastUserMsgIdRef.current;
              setReactions(prev => ({ ...prev, [tid]: evt.emoji }));
            }
            break;
          case "transcription":
            setShowTranscription(true); setTranscriptionText(evt.text);
            setTimeout(() => setShowTranscription(false), 3000);
            break;
          case "image-scanning":
            setShowScanning(true); setTimeout(() => setShowScanning(false), 2000);
            break;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); return; }
    lastTimeRef.current = Date.now();
    const tick = () => {
      const now = Date.now(); const delta = now - lastTimeRef.current; lastTimeRef.current = now;
      setCurrentTime(prev => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) { reset(); lastTimeRef.current = Date.now(); return 0; }
        processEvents(next); return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPlaying, processEvents]);

  const sceneProgress = currentTime - sceneStart;

  return (
    <div style={{
      width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      overflow: "visible",
    }}>
      <style>{`
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes popIn { 0%{transform:scale(0)} 100%{transform:scale(1)} }
        @keyframes fadeSlideUp { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Phone + Floating Elements Container */}
      <div style={{ position: "relative" }}>
        {/* Ambient glow behind phone */}
        <div className="hidden lg:block" style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, #8CB82A08 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Orbit ring decorations */}
        <div className="hidden lg:block" style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 480, height: 620, borderRadius: "50%",
          border: "1px solid #8CB82A08",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div className="hidden lg:block" style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 550, height: 700, borderRadius: "50%",
          border: "1px dashed #8CB82A05",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Floating premium icons */}
        <div className="hidden lg:block" style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, zIndex: 1, pointerEvents: "none" }}>
          <FloatingElements />
        </div>

        <div style={{
          width: 380, height: 580, borderRadius: 36, background: "#111B21",
          boxShadow: "0 0 0 3px #1a2a23, 0 0 0 6px #0d1f18, 0 30px 80px #00000080, 0 0 120px #8CB82A10",
          overflow: "hidden", position: "relative", zIndex: 2,
        }}>
          <div style={{
            height: 28, background: "#0B141A", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 20px", fontSize: 12, color: "#ffffff88",
          }}>
            <span>{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, "0")}</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10 }}>5G</span><span>📶</span><span>🔋</span>
            </div>
          </div>

          {currentScene === "intro" && <IntroScene progress={sceneProgress} />}

          {currentScene === "whatsapp" && (
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 28px)" }}>
              <WhatsAppHeader />
              <div ref={chatRef} style={{
                flex: 1, overflow: "auto",
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundColor: "#0B141A", padding: "8px 0", scrollBehavior: "smooth",
              }}>
                <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 12px" }}>
                  <span style={{ background: "#182229", borderRadius: 8, padding: "4px 14px", fontSize: 12, color: "#8696A0" }}>HOJE</span>
                </div>
                {messages.map((msg, i) => (
                  <div key={msg.id} style={{ position: "relative" }}>
                    <MessageBubble msg={msg} animIn={msg.visible} reaction={reactions[msg.id] || null} />
                    {msg.format === "image" && showScanning && i === messages.length - 1 && <ScanningOverlay visible={true} />}
                  </div>
                ))}
                {showTranscription && <TranscriptionBubble text={transcriptionText} visible={true} />}
                {typingJoao && <TypingIndicator visible={true} />}
                <div style={{ height: 8 }} />
              </div>
              <div style={{ background: "#1F2C34", padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, opacity: 0.6 }}>😊</span>
                <span style={{ fontSize: 18, opacity: 0.6 }}>📎</span>
                <div style={{ flex: 1, background: "#2A3942", borderRadius: 20, padding: "8px 14px", fontSize: 14, color: "#8696A0", display: "flex", alignItems: "center" }}>
                  {typingUser ? <span style={{ color: "#E9EDEF", animation: "pulse 1s infinite" }}>Digitando...</span> : "Mensagem"}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#00A884", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {typingUser ? "➤" : "🎙️"}
                </div>
              </div>
            </div>
          )}

          {currentScene === "transition" && <TransitionScene />}
          {currentScene === "dashboard1" && <Dashboard1Scene progress={sceneProgress} />}
          {currentScene === "dashboard2" && <Dashboard2Scene progress={sceneProgress} />}
          {currentScene === "cta" && <CTAScene progress={sceneProgress} />}
        </div>
      </div>{/* end phone+floating container */}
    </div>
  );
}
