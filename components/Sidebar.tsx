
import React from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useToast } from '../hooks/useToast';

const NavIcon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

const Sidebar: React.FC = () => {
    const { addToast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            addToast('Logout realizado com sucesso!', 'success');
        } catch (error) {
            addToast('Erro ao fazer logout.', 'error');
            console.error(error);
        }
    };

    const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200";
    const activeNavLinkClasses = "bg-indigo-600 text-white";

    return (
        <div className="w-64 h-full bg-gray-800 text-white flex flex-col fixed">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <NavIcon path="M12 6.253v11.494m-9-5.747h18" />
                <h1 className="text-2xl font-bold">Gestor Escolar</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/turmas" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <NavIcon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.001 3.001 0 015.658 0M9 9a3 3 0 116 0 3 3 0 01-6 0z" />
                    Turmas
                </NavLink>
                <NavLink to="/alunos" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <NavIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    Alunos
                </NavLink>
                <NavLink to="/notas" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <NavIcon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    Lançar Notas
                </NavLink>
                 <NavLink to="/relatorio" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <NavIcon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    Relatório
                </NavLink>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-200">
                    <NavIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
