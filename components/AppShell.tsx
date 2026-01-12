import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';
import { FinanceProvider } from '../services/FinanceContext';

const AppShell: React.FC = () => {
  return (
    <FinanceProvider>
      <Layout>
        <Outlet />
      </Layout>
    </FinanceProvider>
  );
};

export default AppShell;


