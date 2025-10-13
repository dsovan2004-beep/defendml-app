// src/hooks/usePermissions.ts
// Custom hook for checking permissions in components

import { useAuth } from '@/contexts/AuthContext';
import { UserRole, hasPermission } from '@/types/roles';

export function usePermissions() {
  const { user } = useAuth();

  const can = (
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'export'
  ): boolean => {
    if (!user) return false;
    return hasPermission(user.role, resource, action);
  };

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const isSuperAdmin = (): boolean => {
    return isRole(UserRole.SUPER_ADMIN);
  };

  const isSecurityAnalyst = (): boolean => {
    return isRole(UserRole.SECURITY_ANALYST);
  };

  const isViewer = (): boolean => {
    return isRole(UserRole.VIEWER);
  };

  const canExport = (): boolean => {
    return isSuperAdmin() || isSecurityAnalyst();
  };

  const canManageUsers = (): boolean => {
    return isSuperAdmin();
  };

  return {
    can,
    isRole,
    isSuperAdmin,
    isSecurityAnalyst,
    isViewer,
    canExport,
    canManageUsers,
    userRole: user?.role,
  };
}
