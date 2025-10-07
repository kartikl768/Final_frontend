import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user) {
    const userRole = user.Role;
    const isAllowed = allowedRoles.some(role => {
      if (role === 'Manager' && (userRole === 0 || userRole === 'Manager')) return true;
      if (role === 'HR' && (userRole === 1 || userRole === 'HR')) return true;
      if (role === 'Interviewer' && (userRole === 2 || userRole === 'Interviewer')) return true;
      if (role === 'Candidate' && (userRole === 3 || userRole === 'Candidate')) return true;
      return false;
    });
    
    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;