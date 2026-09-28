import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { FinanceProvider } from '../services/FinanceContext';
import PlanSummary from './PlanSummary';

const AppShell: React.FC = () => {
  const location = useLocation();
  const isOperations = location.pathname === '/operations';

  if (isOperations) {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  return (
    <FinanceProvider>
      <Layout>
        <PlanSummary />
        <Outlet />
      </Layout>
    </FinanceProvider>
  );
};

export default AppShell;
