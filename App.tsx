import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';

// Caminho da raiz "/" entra no main bundle para evitar waterfall de Suspense
// e mostrar o formulário de Login junto com o primeiro paint.
import Login from './pages/Login';
import AuthShell from './components/AuthShell';

// ── Lazy-loaded pages (code splitting) ──
const Landing = lazy(() => import('./pages/Landing'));
const LandingCommercial = lazy(() => import('./pages/LandingCommercial'));
const Signup = lazy(() => import('./pages/Signup'));
const SetPassword = lazy(() => import('./pages/SetPassword'));
const RecoverAccess = lazy(() => import('./pages/RecoverAccess'));

const AppShell = lazy(() => import('./components/AppShell'));

const Dashboard = lazy(() => import('./components/Dashboard'));
const TransactionList = lazy(() => import('./components/TransactionList'));
const CreditCards = lazy(() => import('./components/CreditCards'));
const Accounts = lazy(() => import('./components/Accounts'));
const Planning = lazy(() => import('./components/Planning'));
const Categories = lazy(() => import('./components/Categories'));
const Settings = lazy(() => import('./components/Settings'));
const Analytics = lazy(() => import('./components/Analytics'));
const Achievements = lazy(() => import('./components/Achievements'));
const OperationsConsole = lazy(() => import('./components/operations/OperationsConsole'));

// RequireAuth lazy (depende de AuthContext, só carrega dentro do AuthShell)
const RequireAuth = lazy(() =>
  import('./components/RequireAuth').then(m => ({ default: m.RequireAuth }))
);

// ── Loading fallback ──
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-brand-background">
    <div className="w-8 h-8 border-2 border-brand-lime/30 border-t-brand-lime rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ─── Rotas PÚBLICAS: sem AuthProvider, sem Supabase ─── */}
            <Route path="/vendas" element={<Landing />} />
            <Route path="/comercial" element={<LandingCommercial />} />
            <Route path="/v2" element={<LandingCommercial />} />
            {import.meta.env.DEV && <Route path="/operations-preview" element={<OperationsConsole />} />}

            {/* ─── Rotas que precisam de AuthContext ─── */}
            <Route element={<AuthShell />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/definir-senha" element={<SetPassword />} />
              <Route path="/recuperar-acesso" element={<RecoverAccess />} />

              <Route
                element={
                  <RequireAuth>
                    <AppShell />
                  </RequireAuth>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/cards" element={<CreditCards />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/conquistas" element={<Achievements />} />
                <Route path="/operations" element={<OperationsConsole />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
