import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../services/AuthContext';
import { AccessProvider } from '../services/AccessContext';

/**
 * Shell que fornece AuthContext apenas para rotas que precisam de autenticação.
 * Landing page fica FORA dele para carregar instantaneamente.
 */
const AuthShell: React.FC = () => (
    <AuthProvider>
        <AccessProvider>
            <Outlet />
        </AccessProvider>
    </AuthProvider>
);

export default AuthShell;
