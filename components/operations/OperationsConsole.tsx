import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  FlaskConical,
  Gauge,
  Inbox,
  Loader2,
  MessageCircle,
  Phone,
  Play,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
  Users,
  Webhook,
  XCircle,
} from 'lucide-react';
import {
  operationsConsoleApi,
  type OperationsAccess,
  type OperationsConversation,
  type OperationsExecution,
  type OperationsExecutionDetail,
  type OperationsMessage,
  type OperationsOverview,
  type OperationsTestResult,
  type OpsStatus,
} from '../../services/operationsConsole';

type TabId = 'overview' | 'conversations' | 'executions' | 'lab';

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Visão geral', icon: Gauge },
  { id: 'conversations', label: 'Conversas', icon: MessageCircle },
  { id: 'executions', label: 'Execuções', icon: TerminalSquare },
  { id: 'lab', label: 'Laboratório', icon: FlaskConical },
];

const previewAccess: OperationsAccess = { allowed: true, integrations: { n8n: true, testWebhook: true } };
const previewOverview: OperationsOverview = {
  periodHours: 24, messages: 184, uniqueContacts: 47, queued: 2, executions: 179,
  success: 173, errors: 6, successRate: 96.6, averageDurationMs: 8420,
  n8nConnected: true, generatedAt: new Date().toISOString(),
};
const previewExecutions: OperationsExecution[] = [
  { id: '84291', workflowId: 'joao-main', workflowName: 'João.ai — Mensagem recebida', status: 'success', mode: 'webhook', startedAt: new Date(Date.now() - 90_000).toISOString(), stoppedAt: new Date(Date.now() - 81_380).toISOString(), durationMs: 8620, retryOf: null },
  { id: '84290', workflowId: 'joao-main', workflowName: 'João.ai — Mensagem recebida', status: 'error', mode: 'webhook', startedAt: new Date(Date.now() - 480_000).toISOString(), stoppedAt: new Date(Date.now() - 476_780).toISOString(), durationMs: 3220, retryOf: null },
  { id: '84289', workflowId: 'daily', workflowName: 'Mensagens diárias', status: 'success', mode: 'trigger', startedAt: new Date(Date.now() - 1_200_000).toISOString(), stoppedAt: new Date(Date.now() - 1_187_760).toISOString(), durationMs: 12240, retryOf: null },
  { id: '84288', workflowId: 'joao-main', workflowName: 'João.ai — Mensagem recebida', status: 'waiting', mode: 'webhook', startedAt: new Date(Date.now() - 1_800_000).toISOString(), stoppedAt: null, durationMs: null, retryOf: null },
];
const previewConversations: OperationsConversation[] = [
  { phone: '+5516998765432', lastInput: 'Gastei R$ 42,90 no mercado hoje', lastOutput: 'Pronto! Registrei seu gasto no mercado.', lastAt: new Date(Date.now() - 90_000).toISOString(), messageCount: 14, errorCount: 0, status: 'success' },
  { phone: '+5516987654321', lastInput: 'Quanto eu gastei este mês?', lastOutput: 'Não consegui concluir essa consulta agora.', lastAt: new Date(Date.now() - 480_000).toISOString(), messageCount: 7, errorCount: 1, status: 'error' },
  { phone: '+5516976543210', lastInput: 'Recebi 2500 de salário', lastOutput: 'Entrada de R$ 2.500,00 registrada.', lastAt: new Date(Date.now() - 1_200_000).toISOString(), messageCount: 22, errorCount: 0, status: 'success' },
];

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function formatDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : '—';
}

function formatDuration(value?: number | null) {
  if (value === null || value === undefined) return '—';
  if (value < 1000) return `${value} ms`;
  if (value < 60_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)} s`;
  return `${Math.floor(value / 60_000)}m ${Math.round((value % 60_000) / 1000)}s`;
}

function compactPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 13) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9)}`;
  if (digits.length === 12) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)}-${digits.slice(8)}`;
  return phone;
}

function truncate(value: string | null | undefined, max = 92) {
  const text = value?.trim() || 'Sem conteúdo';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function asJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? '');
  }
}

function statusMeta(status: OpsStatus | 'completed' | 'queued') {
  const map = {
    success: { label: 'Concluída', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    completed: { label: 'Concluída', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    error: { label: 'Erro', className: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    running: { label: 'Executando', className: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500 animate-pulse' },
    waiting: { label: 'Aguardando', className: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
    queued: { label: 'Na fila', className: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    unknown: { label: 'Desconhecida', className: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  } as const;
  return map[status] ?? map.unknown;
}

const StatusPill: React.FC<{ status: OpsStatus | 'completed' | 'queued' }> = ({ status }) => {
  const meta = statusMeta(status);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${meta.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

const EmptyState: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-8 text-center">
    <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-slate-500"><Icon size={24} /></div>
    <h3 className="font-bold text-slate-800">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{text}</p>
  </div>
);

const LoadingBlock = () => (
  <div className="flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200/80 bg-white">
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
      <Loader2 className="animate-spin text-brand-deep" size={20} /> Sincronizando operação
    </div>
  </div>
);

const OperationsConsole: React.FC = () => {
  const isPreview = import.meta.env.DEV && window.location.pathname.startsWith('/operations-preview');
  const [tab, setTab] = useState<TabId>('overview');
  const [access, setAccess] = useState<OperationsAccess | null>(isPreview ? previewAccess : null);
  const [overview, setOverview] = useState<OperationsOverview | null>(isPreview ? previewOverview : null);
  const [conversations, setConversations] = useState<OperationsConversation[]>(isPreview ? previewConversations : []);
  const [executions, setExecutions] = useState<OperationsExecution[]>(isPreview ? previewExecutions : []);
  const [selectedConversation, setSelectedConversation] = useState<OperationsConversation | null>(null);
  const [messages, setMessages] = useState<OperationsMessage[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<OperationsExecutionDetail | null>(null);
  const [loading, setLoading] = useState(!isPreview);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [testPhone, setTestPhone] = useState('+55');
  const [testMessage, setTestMessage] = useState('Registrei um gasto de R$ 42,90 no mercado hoje');
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<OperationsTestResult | null>(null);

  const loadData = useCallback(async (quiet = false) => {
    if (isPreview) {
      setOverview({ ...previewOverview, generatedAt: new Date().toISOString() });
      return;
    }
    quiet ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const currentAccess = await operationsConsoleApi.access();
      setAccess(currentAccess);
      const [overviewResult, conversationsResult, executionsResult] = await Promise.allSettled([
        operationsConsoleApi.overview(),
        operationsConsoleApi.conversations(),
        currentAccess.integrations.n8n ? operationsConsoleApi.executions() : Promise.resolve([]),
      ]);
      if (overviewResult.status === 'fulfilled') setOverview(overviewResult.value);
      if (conversationsResult.status === 'fulfilled') setConversations(conversationsResult.value);
      if (executionsResult.status === 'fulfilled') setExecutions(executionsResult.value);
      const rejection = [overviewResult, conversationsResult, executionsResult].find(item => item.status === 'rejected');
      if (rejection?.status === 'rejected') setError(rejection.reason instanceof Error ? rejection.reason.message : 'Parte dos dados não pôde ser carregada.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível abrir o Centro de Operações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isPreview]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    const timer = window.setInterval(() => { void loadData(true); }, 30_000);
    return () => window.clearInterval(timer);
  }, [loadData]);

  const filteredConversations = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return conversations;
    return conversations.filter(item => `${item.phone} ${item.lastInput ?? ''} ${item.lastOutput ?? ''}`.toLowerCase().includes(term));
  }, [conversations, search]);

  async function openConversation(conversation: OperationsConversation) {
    setSelectedConversation(conversation);
    setSelectedExecution(null);
    setDetailLoading(true);
    try {
      if (isPreview) {
        setMessages([{
          id: `preview-${conversation.phone}`,
          telefone: conversation.phone,
          input_usuario: conversation.lastInput,
          output_agente: conversation.lastOutput,
          metadata: conversation.status === 'error' ? { status: 'error', node: 'Consultar relatório', message: 'Tempo limite na consulta' } : { status: 'success', intent: 'registrar_despesa', environment: 'preview' },
          created_at: conversation.lastAt,
        }]);
        return;
      }
      setMessages(await operationsConsoleApi.conversation(conversation.phone));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a conversa.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function openExecution(execution: OperationsExecution) {
    if (!execution.id) return;
    setSelectedConversation(null);
    setSelectedExecution(null);
    setDetailLoading(true);
    try {
      if (isPreview) {
        const failed = execution.status === 'error';
        setSelectedExecution({
          ...execution,
          steps: [
            { sequence: 1, nodeName: 'Mensagem recebida', attempt: 1, status: 'success', startedAt: execution.startedAt, durationMs: 18, error: null, output: { phone: '+5516••••5432', type: 'incoming' } },
            { sequence: 2, nodeName: 'Buscar organização', attempt: 1, status: 'success', startedAt: execution.startedAt, durationMs: 126, error: null, output: { status: 'active', organization: 'Conta de teste' } },
            { sequence: 3, nodeName: 'Agente financeiro', attempt: 1, status: failed ? 'error' : 'success', startedAt: execution.startedAt, durationMs: failed ? 2870 : 6390, error: failed ? { type: 'TimeoutError', message: 'A ferramenta não respondeu dentro do limite.' } : null, output: failed ? null : { intent: 'registrar_despesa', confidence: 0.98 } },
            ...(!failed ? [{ sequence: 4, nodeName: 'Responder usuário', attempt: 1, status: 'success' as const, startedAt: execution.startedAt, durationMs: 392, error: null, output: { delivered: true } }] : []),
          ],
        });
        return;
      }
      setSelectedExecution(await operationsConsoleApi.execution(execution.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a execução.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function submitTest(event: React.FormEvent) {
    event.preventDefault();
    setTestRunning(true);
    setTestResult(null);
    setError(null);
    try {
      if (isPreview) {
        await new Promise(resolve => window.setTimeout(resolve, 900));
        setTestResult({ requestId: crypto.randomUUID(), phone: testPhone, accepted: true, response: { mode: 'preview', output: 'Mensagem processada com sucesso no ambiente demonstrativo.' }, sentAt: new Date().toISOString() });
        return;
      }
      const result = await operationsConsoleApi.runTest(testPhone, testMessage);
      setTestResult(result);
      window.setTimeout(() => { void loadData(true); }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar o teste.');
    } finally {
      setTestRunning(false);
    }
  }

  if (loading && !access) {
    return <LoadingBlock />;
  }

  if (!access) {
    return (
      <div className="mx-auto max-w-2xl rounded-[32px] border border-rose-200 bg-white p-8 shadow-sm">
        <div className="mb-5 inline-flex rounded-2xl bg-rose-50 p-3 text-rose-600"><ShieldCheck size={26} /></div>
        <h1 className="text-2xl font-black tracking-tight text-brand-deep">Centro de Operações protegido</h1>
        <p className="mt-3 leading-7 text-slate-600">{error ?? 'Seu usuário ainda não foi autorizado para acessar dados operacionais.'}</p>
        <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          Aplique a migration <strong>0010_operations_console.sql</strong>, autorize seu usuário e publique a função <strong>joao-ops-console</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="relative isolate -mt-3 space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[34px] bg-brand-deep px-6 py-7 text-white shadow-[0_26px_80px_rgba(14,52,44,0.20)] md:px-9 md:py-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-brand-lime/10" />
        <div className="pointer-events-none absolute bottom-0 right-28 h-px w-72 bg-gradient-to-r from-transparent via-brand-lime/50 to-transparent" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-lime">
                <CircleDot size={13} className="animate-pulse" /> {isPreview ? 'prévia local' : 'operação ao vivo'}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-300">restrito à equipe</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-[44px] md:leading-[1.05]">
              Centro de Operações
              <span className="ml-2 text-brand-lime">João.ai</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Conversas, execuções e diagnóstico do assistente em uma única linha do tempo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">última leitura</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{overview ? formatDate(overview.generatedAt) : 'aguardando'}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadData(true)}
              disabled={refreshing}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-brand-lime transition hover:bg-white/10 disabled:opacity-50"
              aria-label="Atualizar dados"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </section>

      <nav className="flex gap-2 overflow-x-auto rounded-[22px] border border-slate-200/80 bg-white p-2 shadow-sm" aria-label="Seções do centro de operações">
        {tabs.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? 'bg-brand-deep text-white shadow-lg shadow-brand-deep/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <Icon size={17} className={active ? 'text-brand-lime' : ''} /> {item.label}
            </button>
          );
        })}
      </nav>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div><strong>Atenção:</strong> {error}</div>
        </div>
      )}

      {tab === 'overview' && (
        <OverviewTab overview={overview} executions={executions} access={access} onOpenExecution={openExecution} />
      )}

      {tab === 'conversations' && (
        <ConversationsTab
          conversations={filteredConversations}
          search={search}
          onSearch={setSearch}
          selected={selectedConversation}
          messages={messages}
          detailLoading={detailLoading}
          onSelect={openConversation}
        />
      )}

      {tab === 'executions' && (
        <ExecutionsTab
          executions={executions}
          selected={selectedExecution}
          detailLoading={detailLoading}
          connected={access.integrations.n8n}
          onSelect={openExecution}
        />
      )}

      {tab === 'lab' && (
        <LabTab
          enabled={access.integrations.testWebhook}
          phone={testPhone}
          message={testMessage}
          running={testRunning}
          result={testResult}
          onPhone={setTestPhone}
          onMessage={setTestMessage}
          onSubmit={submitTest}
        />
      )}
    </div>
  );
};

const OverviewTab: React.FC<{
  overview: OperationsOverview | null;
  executions: OperationsExecution[];
  access: OperationsAccess;
  onOpenExecution: (execution: OperationsExecution) => void;
}> = ({ overview, executions, access, onOpenExecution }) => {
  if (!overview) return <LoadingBlock />;
  const metrics = [
    { label: 'Mensagens', value: overview.messages, caption: 'últimas 24 horas', icon: Inbox, tone: 'bg-sky-50 text-sky-700' },
    { label: 'Contatos', value: overview.uniqueContacts, caption: 'números únicos', icon: Users, tone: 'bg-violet-50 text-violet-700' },
    { label: 'Sucesso', value: overview.successRate === null ? '—' : `${overview.successRate}%`, caption: `${overview.success} concluídas`, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Erros', value: overview.errors, caption: overview.errors ? 'exigem atenção' : 'nenhum detectado', icon: AlertTriangle, tone: 'bg-rose-50 text-rose-700' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="group rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50">
              <div className="flex items-start justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-2xl ${metric.tone}`}><Icon size={19} /></div>
                <ArrowDown size={16} className="-rotate-45 text-slate-300 transition group-hover:text-brand-lime" />
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-brand-deep">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.caption}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">atividade recente</p>
              <h2 className="mt-1 text-xl font-black text-brand-deep">Últimas execuções</h2>
            </div>
            <Activity size={20} className="text-brand-lime" />
          </div>
          {!access.integrations.n8n ? (
            <EmptyState icon={ServerCog} title="API do n8n não conectada" text="Configure N8N_BASE_URL e N8N_API_KEY na Edge Function para exibir a linha do tempo real." />
          ) : executions.length === 0 ? (
            <EmptyState icon={Activity} title="Nenhuma execução encontrada" text="As execuções aparecerão aqui assim que o workflow receber uma mensagem." />
          ) : (
            <div className="divide-y divide-slate-100">
              {executions.slice(0, 6).map(execution => (
                <button key={execution.id} type="button" onClick={() => onOpenExecution(execution)} className="flex w-full items-center gap-4 py-3.5 text-left transition hover:bg-slate-50/80 md:px-2">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-deep text-brand-lime"><Webhook size={16} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{execution.workflowName || `Workflow ${execution.workflowId || 'sem nome'}`}</p>
                    <p className="mt-1 text-xs text-slate-400">#{execution.id} · {formatDate(execution.startedAt)}</p>
                  </div>
                  <span className="hidden text-xs font-semibold text-slate-500 sm:block">{formatDuration(execution.durationMs)}</span>
                  <StatusPill status={execution.status} />
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-[28px] bg-[#EAF0E8] p-6 text-brand-deep">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-deep/50">saúde da operação</p>
          <h2 className="mt-1 text-xl font-black">Sinais do sistema</h2>
          <div className="mt-6 space-y-3">
            <HealthRow label="Banco e auditoria" ok />
            <HealthRow label="API do n8n" ok={access.integrations.n8n} />
            <HealthRow label="Webhook de teste" ok={access.integrations.testWebhook} />
          </div>
          <div className="mt-7 rounded-2xl border border-brand-deep/10 bg-white/60 p-4">
            <div className="flex items-center justify-between text-sm font-bold"><span>Fila atual</span><span>{overview.queued}</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-deep/10">
              <div className={`h-full rounded-full ${overview.queued > 10 ? 'bg-rose-500' : 'bg-brand-lime'}`} style={{ width: `${Math.min(100, Math.max(6, overview.queued * 7))}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-brand-deep/60">Tempo médio de resposta: <strong>{formatDuration(overview.averageDurationMs)}</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const HealthRow: React.FC<{ label: string; ok: boolean }> = ({ label, ok }) => (
  <div className="flex items-center justify-between rounded-2xl border border-brand-deep/10 bg-white/60 px-4 py-3">
    <span className="text-sm font-semibold">{label}</span>
    <span className={`flex items-center gap-1.5 text-xs font-bold ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>
      {ok ? <Check size={15} /> : <AlertTriangle size={15} />} {ok ? 'online' : 'configurar'}
    </span>
  </div>
);

const ConversationsTab: React.FC<{
  conversations: OperationsConversation[];
  search: string;
  onSearch: (value: string) => void;
  selected: OperationsConversation | null;
  messages: OperationsMessage[];
  detailLoading: boolean;
  onSelect: (conversation: OperationsConversation) => void;
}> = ({ conversations, search, onSearch, selected, messages, detailLoading, onSelect }) => (
  <div className="grid min-h-[640px] overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[390px_1fr]">
    <section className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-r">
      <div className="mb-4 flex items-center justify-between px-1">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">caixa de entrada</p><h2 className="mt-1 text-xl font-black text-brand-deep">Conversas</h2></div>
        <span className="rounded-full bg-brand-deep px-2.5 py-1 text-xs font-bold text-brand-lime">{conversations.length}</span>
      </div>
      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm focus-within:border-brand-lime/70">
        <Search size={17} className="text-slate-400" />
        <input value={search} onChange={event => onSearch(event.target.value)} placeholder="Telefone ou mensagem" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
      </label>
      <div className="mt-4 max-h-[540px] space-y-2 overflow-y-auto pr-1">
        {conversations.map(item => (
          <button key={item.phone} type="button" onClick={() => onSelect(item)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.phone === item.phone ? 'border-brand-lime bg-white shadow-md' : 'border-transparent hover:border-slate-200 hover:bg-white'}`}>
            <div className="flex items-start gap-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.status === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-brand-deep text-brand-lime'}`}><Phone size={16} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-slate-800">{compactPhone(item.phone)}</p><span className="text-[10px] text-slate-400">{formatDate(item.lastAt)}</span></div>
                <p className="mt-1 truncate text-xs text-slate-500">{truncate(item.lastInput, 55)}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400"><span>{item.messageCount} interações</span>{item.errorCount > 0 && <span className="text-rose-600">· {item.errorCount} erro(s)</span>}</div>
              </div>
            </div>
          </button>
        ))}
        {conversations.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Nenhuma conversa encontrada.</p>}
      </div>
    </section>
    <section className="relative min-w-0 bg-white p-5 md:p-7">
      {!selected ? (
        <EmptyState icon={MessageCircle} title="Escolha uma conversa" text="Abra um número para ver a mensagem recebida, a resposta do João.ai e os metadados de auditoria." />
      ) : detailLoading ? <LoadingBlock /> : (
        <>
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">linha do tempo</p><h2 className="mt-1 text-xl font-black text-brand-deep">{compactPhone(selected.phone)}</h2></div>
            <StatusPill status={selected.status} />
          </div>
          <div className="mt-6 max-h-[520px] space-y-7 overflow-y-auto pr-2">
            {messages.map(message => (
              <div key={message.id} className="space-y-3">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">{formatDate(message.created_at)}</p>
                {message.input_usuario && <div className="ml-auto max-w-[82%] rounded-[22px] rounded-br-md bg-brand-deep px-4 py-3 text-sm leading-6 text-white shadow-sm"><p>{message.input_usuario}</p></div>}
                {message.output_agente && <div className="max-w-[86%] rounded-[22px] rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep/50"><Bot size={13} /> João.ai</div><p className="whitespace-pre-wrap">{message.output_agente}</p></div>}
                {message.metadata && Object.keys(message.metadata).length > 0 && <details className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><summary className="cursor-pointer font-semibold">Metadados técnicos</summary><pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5">{asJson(message.metadata)}</pre></details>}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  </div>
);

const ExecutionsTab: React.FC<{
  executions: OperationsExecution[];
  selected: OperationsExecutionDetail | null;
  detailLoading: boolean;
  connected: boolean;
  onSelect: (execution: OperationsExecution) => void;
}> = ({ executions, selected, detailLoading, connected, onSelect }) => {
  if (!connected) return <EmptyState icon={ServerCog} title="Conecte a API do n8n" text="A chave permanece somente na Edge Function. Depois da configuração, esta tela exibirá o comportamento real de cada nó." />;
  return (
    <div className="grid min-h-[660px] overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-sm xl:grid-cols-[430px_1fr]">
      <section className="border-b border-slate-200 bg-[#102E28] p-4 text-white xl:border-b-0 xl:border-r xl:border-white/10">
        <div className="mb-5 px-2 pt-2"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-lime/70">n8n execution feed</p><h2 className="mt-1 text-xl font-black">Execuções recentes</h2></div>
        <div className="max-h-[570px] space-y-2 overflow-y-auto pr-1">
          {executions.map(execution => (
            <button key={execution.id} type="button" onClick={() => onSelect(execution)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === execution.id ? 'border-brand-lime bg-white/10' : 'border-white/5 bg-white/[0.035] hover:bg-white/[0.07]'}`}>
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold">{execution.workflowName || `Workflow ${execution.workflowId || ''}`}</p><p className="mt-1 font-mono text-[10px] text-slate-400">execução #{execution.id}</p></div><StatusPill status={execution.status} /></div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400"><span className="flex items-center gap-1.5"><Clock3 size={13} /> {formatDate(execution.startedAt)}</span><strong className="text-slate-300">{formatDuration(execution.durationMs)}</strong></div>
            </button>
          ))}
          {executions.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Nenhuma execução retornada pelo n8n.</p>}
        </div>
      </section>
      <section className="min-w-0 p-5 md:p-7">
        {detailLoading ? <LoadingBlock /> : !selected ? (
          <EmptyState icon={TerminalSquare} title="Abra uma execução" text="A linha do tempo organiza os nós pela hora real de início e mostra duração, saída e erro de cada etapa." />
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
              <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">execução #{selected.id}</p><h2 className="mt-1 text-xl font-black text-brand-deep">{selected.workflowName || `Workflow ${selected.workflowId || ''}`}</h2></div>
              <div className="flex items-center gap-3"><span className="text-xs font-bold text-slate-500">{formatDuration(selected.durationMs)}</span><StatusPill status={selected.status} /></div>
            </div>
            <div className="mt-6 max-h-[550px] overflow-y-auto pr-2">
              {selected.steps.map((step, index) => (
                <div key={`${step.nodeName}-${step.attempt}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < selected.steps.length - 1 && <span className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-slate-200" />}
                  <div className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${step.status === 'error' ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-emerald-200 bg-emerald-50 text-emerald-600'}`}>{step.status === 'error' ? <XCircle size={17} /> : <Check size={17} />}</div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">etapa {step.sequence}{step.attempt > 1 ? ` · tentativa ${step.attempt}` : ''}</p><h3 className="mt-1 font-bold text-slate-800">{step.nodeName}</h3></div><span className="text-xs font-bold text-slate-500">{formatDuration(step.durationMs)}</span></div>
                    {(step.error || step.output) && <details className="mt-3 border-t border-slate-200 pt-3"><summary className="cursor-pointer text-xs font-bold text-brand-deep">{step.error ? 'Ver erro técnico' : 'Ver saída do nó'}</summary><pre className={`mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl p-3 font-mono text-[10px] leading-5 ${step.error ? 'bg-rose-950 text-rose-100' : 'bg-slate-950 text-slate-200'}`}>{asJson(step.error || step.output)}</pre></details>}
                  </div>
                </div>
              ))}
              {selected.steps.length === 0 && <EmptyState icon={Code2} title="Dados dos nós não salvos" text="Ative o salvamento de dados de execução no n8n para exibir entradas, saídas e duração por etapa." />}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

const LabTab: React.FC<{
  enabled: boolean;
  phone: string;
  message: string;
  running: boolean;
  result: OperationsTestResult | null;
  onPhone: (value: string) => void;
  onMessage: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}> = ({ enabled, phone, message, running, result, onPhone, onMessage, onSubmit }) => (
  <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
    <form onSubmit={onSubmit} className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">webhook sandbox</p><h2 className="mt-1 text-2xl font-black tracking-tight text-brand-deep">Laboratório de mensagens</h2></div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-lime/15 text-brand-deep"><FlaskConical size={21} /></div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">Gera o mesmo envelope do Chatwoot e envia exclusivamente para o webhook de teste configurado.</p>
      <div className="mt-7 space-y-5">
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Número simulado</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-brand-lime focus-within:bg-white"><Phone size={17} className="text-slate-400" /><input value={phone} onChange={event => onPhone(event.target.value)} placeholder="+55 16 99999-9999" className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none" /></div></label>
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Mensagem recebida</span><textarea value={message} onChange={event => onMessage(event.target.value)} rows={6} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-brand-lime focus:bg-white" /></label>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-900"><ShieldCheck size={18} className="mt-0.5 shrink-0" /><p><strong>Ambiente isolado.</strong> O payload recebe <code>dry_run=true</code> e deve apontar para uma cópia de testes do workflow, sem envio real ao WhatsApp.</p></div>
      <button type="submit" disabled={!enabled || running || !phone.trim() || !message.trim()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-deep px-5 py-4 text-sm font-black text-white shadow-lg shadow-brand-deep/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0">
        {running ? <><Loader2 size={18} className="animate-spin text-brand-lime" /> Executando workflow</> : <><Play size={18} className="fill-brand-lime text-brand-lime" /> Executar teste completo</>}
      </button>
      {!enabled && <p className="mt-3 text-center text-xs font-semibold text-amber-700">Configure N8N_TEST_WEBHOOK_URL para habilitar o envio.</p>}
    </form>

    <section className="overflow-hidden rounded-[30px] bg-[#0B211D] text-white shadow-[0_22px_70px_rgba(11,33,29,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5"><div className="flex items-center gap-3"><TerminalSquare size={19} className="text-brand-lime" /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">console de teste</p><h2 className="font-bold">Rastreamento da solicitação</h2></div></div><span className="flex items-center gap-2 text-[11px] font-bold text-slate-400"><span className={`h-2 w-2 rounded-full ${running ? 'animate-pulse bg-sky-400' : result ? 'bg-emerald-400' : 'bg-slate-600'}`} /> {running ? 'executando' : result ? 'recebido' : 'pronto'}</span></div>
      <div className="p-6 md:p-8">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: 'Montar webhook', icon: Webhook, done: Boolean(result) || running },
            { label: 'Executar no n8n', icon: ServerCog, done: Boolean(result), active: running },
            { label: 'Capturar resposta', icon: Bot, done: Boolean(result) },
          ].map((step, index) => {
            const Icon = step.icon;
            return <div key={step.label} className={`relative rounded-2xl border p-4 ${step.done ? 'border-brand-lime/30 bg-brand-lime/[0.07]' : step.active ? 'border-sky-400/30 bg-sky-400/[0.06]' : 'border-white/10 bg-white/[0.025]'}`}><div className="flex items-center justify-between"><Icon size={18} className={step.done ? 'text-brand-lime' : 'text-slate-500'} /><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></div><p className={`mt-6 text-xs font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>{step.label}</p></div>;
          })}
        </div>
        <div className="mt-6 min-h-[330px] rounded-2xl border border-white/10 bg-black/20 p-5 font-mono">
          {!running && !result && <div className="flex h-64 flex-col items-center justify-center text-center"><CircleDot size={22} className="mb-3 text-slate-600" /><p className="text-xs text-slate-500">Aguardando uma mensagem de teste.</p><p className="mt-2 text-[10px] text-slate-700">A execução real aparecerá na aba Execuções.</p></div>}
          {running && <div className="space-y-3 text-xs"><p className="text-brand-lime">$ enviando webhook de teste...</p><p className="text-slate-500">$ aguardando confirmação do n8n</p><span className="inline-block h-4 w-2 animate-pulse bg-brand-lime" /></div>}
          {result && <div className="space-y-5 text-xs"><div><p className="text-slate-500">request_id</p><p className="mt-1 break-all text-brand-lime">{result.requestId}</p></div><div><p className="text-slate-500">telefone</p><p className="mt-1 text-slate-200">{compactPhone(result.phone)}</p></div><div><p className="text-slate-500">resposta do webhook</p><pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-black/30 p-3 text-[10px] leading-5 text-slate-300">{asJson(result.response)}</pre></div><p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> Solicitação aceita pelo ambiente de teste.</p></div>}
        </div>
      </div>
    </section>
  </div>
);

export default OperationsConsole;
