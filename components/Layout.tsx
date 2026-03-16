
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
    const { isProfessor } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // In a real app with different roles, you'd check this.
    // For now, any authenticated user is considered a professor.
    if (!isProfessor) {
      // Maybe redirect to a "not authorized" page or back to login
      return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 p-6 overflow-y-auto md:ml-64">
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-white"
                        aria-label="Abrir menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Menu
                    </button>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
