// src/types/roles.ts
// Role-Based Access Control (RBAC) type definitions

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SECURITY_ANALYST = 'security_analyst',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
}

// Permission matrix for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Full access to everything
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
    { resource: 'dashboard', action: 'read' },
    { resource: 'threats', action: 'read' },
    { resource: 'threats', action: 'export' },
    { resource: 'pii', action: 'read' },
    { resource: 'pii', action: 'export' },
    { resource: 'compliance', action: 'read' },
    { resource: 'compliance', action: 'export' },
    { resource: 'audit', action: 'read' },
    { resource: 'audit', action: 'export' },
    { resource: 'health', action: 'read' },
    { resource: 'usage', action: 'read' },
    { resource: 'usage', action: 'export' },
    { resource: 'tester', action: 'read' },
    { resource: 'settings', action: 'update' },
  ],
  
  [UserRole.SECURITY_ANALYST]: [
    // View all security data, export reports, but no user management
    { resource: 'dashboard', action: 'read' },
    { resource: 'threats', action: 'read' },
    { resource: 'threats', action: 'export' },
    { resource: 'pii', action: 'read' },
    { resource: 'pii', action: 'export' },
    { resource: 'compliance', action: 'read' },
    { resource: 'compliance', action: 'export' },
    { resource: 'audit', action: 'read' },
    { resource: 'audit', action: 'export' },
    { resource: 'health', action: 'read' },
    { resource: 'usage', action: 'read' },
    { resource: 'tester', action: 'read' },
  ],
  
  [UserRole.VIEWER]: [
    // View-only, no exports, no sensitive data
    { resource: 'dashboard', action: 'read' },
    { resource: 'health', action: 'read' },
    { resource: 'usage', action: 'read' },
    // No access to: threats, pii, compliance, audit, tester
  ],
};

// Helper function to check if user has permission
export function hasPermission(
  role: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'export'
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.some(
    (p) => p.resource === resource && p.action === action
  );
}

// Helper function to get role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.SECURITY_ANALYST]: 'Security Analyst',
    [UserRole.VIEWER]: 'Viewer',
  };
  return roleNames[role] || role;
}

// Helper function to get role description
export function getRoleDescription(role: UserRole): string {
  const descriptions = {
    [UserRole.SUPER_ADMIN]: 'Full access to all features including user management and system configuration',
    [UserRole.SECURITY_ANALYST]: 'View and export all security data, no user management or system configuration',
    [UserRole.VIEWER]: 'View-only access to basic dashboards and metrics',
  };
  return descriptions[role] || '';
}

// Helper function to get role color (for UI badges)
export function getRoleColor(role: UserRole): string {
  const colors = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    [UserRole.SECURITY_ANALYST]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    [UserRole.VIEWER]: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };
  return colors[role] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
}
