import { getSupabaseClient } from './supabaseClient';

export type OpsStatus = 'success' | 'error' | 'running' | 'waiting' | 'unknown';

export type OperationsAccess = {
  allowed: boolean;
  integrations: {
    n8n: boolean;
    testWebhook: boolean;
  };
};

export type OperationsOverview = {
  periodHours: number;
  messages: number;
  uniqueContacts: number;
  queued: number;
  executions: number;
  success: number;
  errors: number;
  successRate: number | null;
  averageDurationMs: number | null;
  n8nConnected: boolean;
  generatedAt: string;
};

export type OperationsConversation = {
  phone: string;
  lastInput: string | null;
  lastOutput: string | null;
  lastAt: string;
  messageCount: number;
  errorCount: number;
  status: 'success' | 'error';
};

export type OperationsMessage = {
  id: string;
  telefone: string;
  input_usuario: string | null;
  output_agente: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type OperationsExecution = {
  id: string;
  workflowId: string | null;
  workflowName: string | null;
  status: OpsStatus;
  mode: string | null;
  startedAt: string | null;
  stoppedAt: string | null;
  durationMs: number | null;
  retryOf: string | null;
};

export type OperationsStep = {
  sequence: number;
  nodeName: string;
  attempt: number;
  status: 'success' | 'error';
  startedAt: string | null;
  durationMs: number | null;
  error: unknown;
  output: unknown;
};

export type OperationsExecutionDetail = OperationsExecution & {
  steps: OperationsStep[];
};

export type OperationsTestResult = {
  requestId: string;
  phone: string;
  accepted: boolean;
  response: unknown;
  sentAt: string;
};

const errorMessages: Record<string, string> = {
  unauthorized: 'Sua sessão expirou. Entre novamente.',
  forbidden: 'Este usuário não tem acesso ao Centro de Operações.',
  n8n_not_configured: 'A integração com a API do n8n ainda não foi configurada.',
  test_webhook_not_configured: 'O webhook isolado de testes ainda não foi configurado.',
  invalid_phone: 'Informe um telefone com DDD e código do país.',
  message_required: 'Escreva a mensagem que será enviada ao fluxo.',
};

async function invoke<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('O Supabase não está configurado neste ambiente.');

  const { data, error } = await supabase.functions.invoke('joao-ops-console', {
    body: { action, ...payload },
  });
  if (error) {
    let message = error.message || 'Não foi possível consultar o Centro de Operações.';
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === 'function') {
      try {
        const body = await context.clone().json() as { error?: string };
        if (body.error) message = errorMessages[body.error] ?? body.error;
      } catch {
        // A mensagem padrão do SDK continua sendo útil.
      }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(errorMessages[data.error] ?? data.error);
  return (data?.data ?? data) as T;
}

let accessPromise: Promise<OperationsAccess> | null = null;

export const operationsConsoleApi = {
  access(force = false) {
    if (force || !accessPromise) accessPromise = invoke<OperationsAccess>('access');
    return accessPromise;
  },
  overview: () => invoke<OperationsOverview>('overview'),
  conversations: (search = '') => invoke<OperationsConversation[]>('conversations', { search }),
  conversation: (phone: string) => invoke<OperationsMessage[]>('conversation', { phone }),
  executions: (limit = 80) => invoke<OperationsExecution[]>('executions', { limit }),
  execution: (id: string) => invoke<OperationsExecutionDetail>('execution', { id }),
  runTest: (phone: string, message: string) => invoke<OperationsTestResult>('test', { phone, message }),
};
