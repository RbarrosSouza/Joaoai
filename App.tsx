import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CreditCards from './components/CreditCards';
import Accounts from './components/Accounts';
import Planning from './components/Planning';
import Categories from './components/Categories';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import Achievements from './components/Achievements';
import { AuthProvider } from './services/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing'; // NEW

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
