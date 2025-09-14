import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AccessDeniedPage } from '../../pages/AccessDeniedPage';

interface RoleRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, roles }) => {
  const { hasAnyRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(roles)) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};





