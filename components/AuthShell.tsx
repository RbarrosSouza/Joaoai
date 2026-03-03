import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../services/AuthContext';

/**
 * Shell que fornece AuthContext apenas para rotas que precisam de autenticação.
 * Landing page fica FORA dele para carregar instantaneamente.
 */
const AuthShell: React.FC = () => (
    <AuthProvider>
        <Outlet />
    </AuthProvider>
);

export default AuthShell;
