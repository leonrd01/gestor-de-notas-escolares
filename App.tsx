
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import TurmasPage from './pages/TurmasPage';
import AlunosPage from './pages/AlunosPage';
import NotasPage from './pages/NotasPage';
import RelatorioPage from './pages/RelatorioPage';

const AppRoutes: React.FC = () => {
    const { user, isProfessor } = useAuth();

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }
    
    // Although Layout also checks this, this prevents rendering Layout at all
    // if not a professor.
    if (!isProfessor) {
        return (
             <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={
                    <div className="flex h-screen items-center justify-center text-red-500">
                        Acesso não autorizado.
                    </div>
                } />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/turmas" />} />
                <Route path="turmas" element={<TurmasPage />} />
                <Route path="alunos" element={<AlunosPage />} />
                <Route path="notas" element={<NotasPage />} />
                <Route path="relatorio" element={<RelatorioPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <HashRouter>
                    <AppRoutes />
                </HashRouter>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;
