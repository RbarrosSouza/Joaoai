// UUID v4 util (sem dependências).
// - Em browsers modernos: usa crypto.randomUUID()
// - Fallback: gera v4 via crypto.getRandomValues()

export function uuidv4(): string {
  if (typeof crypto !== 'undefined') {
    // @ts-expect-error randomUUID pode não estar tipado dependendo do lib dom
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    if (typeof crypto.getRandomValues === 'function') return uuidFromGetRandomValues();
  }
  // Último fallback: gera um UUID “aceitável” (não criptograficamente forte)
  return uuidFromMathRandom();
}

function uuidFromGetRandomValues(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // RFC4122 v4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return bytesToUuid(bytes);
}

function bytesToUuid(b: Uint8Array): string {
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidFromMathRandom(): string {
  // Não ideal, mas evita IDs inválidos.
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


