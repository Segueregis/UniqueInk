import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-black flex items-center justify-center p-4">
        <div className="text-ink-gold text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-gold mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;