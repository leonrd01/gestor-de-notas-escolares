
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
    const { isProfessor } = useAuth();
    
    // In a real app with different roles, you'd check this.
    // For now, any authenticated user is considered a professor.
    if (!isProfessor) {
      // Maybe redirect to a "not authorized" page or back to login
      return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
