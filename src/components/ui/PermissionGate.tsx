import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Permission, Role } from '@/types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  roles?: Role[];
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permission,
  roles,
  fallback = null,
}: PermissionGateProps) {
  const { role, hasPermission } = useAuth();

  if (roles && !roles.includes(role)) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
