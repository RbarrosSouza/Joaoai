/**
 * Utilitários para manipulação de datas preservando o timezone local.
 * 
 * PROBLEMA RESOLVIDO:
 * O uso de toISOString() converte datas para UTC, causando deslocamento de dias.
 * Exemplo: 02/02/2026 às 22:00 no Brasil (UTC-3) → 03/02/2026 01:00 em UTC
 * 
 * SOLUÇÃO:
 * Estas funções manipulam datas preservando o timezone local do usuário,
 * evitando conversões UTC que causam inconsistências de ±1 dia.
 * 
 * @author João.ai
 * @since 2026-02-02
 */

/**
 * Converte uma Date para string no formato YYYY-MM-DD preservando a data LOCAL.
 * 
 * NÃO use: date.toISOString().split('T')[0] - isso converte para UTC!
 * USE: toLocalDateString(date)
 * 
 * @param date - Objeto Date a ser convertido
 * @returns String no formato 'YYYY-MM-DD' na timezone local
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna a data de HOJE no formato YYYY-MM-DD (timezone local).
 * 
 * NÃO use: new Date().toISOString().split('T')[0]
 * USE: getTodayString()
 * 
 * @returns String no formato 'YYYY-MM-DD' representando hoje
 */
export function getTodayString(): string {
  return toLocalDateString(new Date());
}

/**
 * Parseia uma string YYYY-MM-DD como Date no timezone LOCAL (meio-dia).
 * 
 * Usar meio-dia (12:00) evita problemas de horário de verão que podem
 * ocorrer à meia-noite em alguns fusos horários.
 * 
 * @param dateStr - String no formato 'YYYY-MM-DD'
 * @returns Date object representando meio-dia desse dia no timezone local
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Usar meio-dia para evitar problemas de horário de verão
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/**
 * Converte uma Date para ISO string preservando a data LOCAL.
 * 
 * Ao invés de converter para UTC (que pode mudar o dia), esta função
 * cria uma ISO string que representa meia-noite no timezone local,
 * mas formatada como se fosse UTC para compatibilidade com APIs.
 * 
 * @param date - Date a ser convertida
 * @returns ISO string que preserva a data local (ex: '2026-02-02T12:00:00.000Z')
 */
export function toLocalISOString(date: Date): string {
  // Extrair componentes locais
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // Usar meio-dia para evitar problemas de timezone ao re-parsear
  return `${year}-${month}-${day}T12:00:00.000Z`;
}

/**
 * Converte uma string de data (qualquer formato) para ISO string local segura.
 * 
 * @param dateStr - String de data (YYYY-MM-DD ou ISO)
 * @returns ISO string que preserva a data original
 */
export function dateStringToLocalISO(dateStr: string): string {
  // Se já é uma string simples YYYY-MM-DD
  if (dateStr.length === 10 && dateStr.includes('-')) {
    return `${dateStr}T12:00:00.000Z`;
  }
  
  // Se é uma ISO string completa, extrair a data e reformatar
  const date = new Date(dateStr);
  return toLocalISOString(date);
}

/**
 * Extrai a string de data YYYY-MM-DD de uma ISO string de forma segura.
 * 
 * Para ISO strings com 'T12:00:00' (nosso padrão), extrai diretamente.
 * Para outras, usa a data local para evitar problemas de timezone.
 * 
 * @param isoString - String ISO de data
 * @returns String no formato 'YYYY-MM-DD'
 */
export function isoToLocalDateString(isoString: string): string {
  // Se a string usa nosso padrão T12:00:00, podemos extrair diretamente
  if (isoString.includes('T12:00:00')) {
    return isoString.split('T')[0];
  }
  
  // Caso contrário, parsear e usar data local
  const date = new Date(isoString);
  return toLocalDateString(date);
}
