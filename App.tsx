import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';

// ── Lazy-loaded pages (code splitting) ──
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// AuthShell carrega AuthProvider apenas quando necessário
const AuthShell = lazy(() => import('./components/AuthShell'));
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
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ─── Rotas PÚBLICAS: sem AuthProvider, sem Supabase ─── */}
            <Route path="/" element={<Landing />} />

            {/* ─── Rotas que precisam de AuthContext ─── */}
            <Route element={<AuthShell />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

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
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
