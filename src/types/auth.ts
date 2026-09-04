export type Role = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type Permission =
  | 'employees.view'
  | 'employees.create'
  | 'employees.update'
  | 'employees.delete'
  | 'departments.view'
  | 'departments.manage'
  | 'attendance.view'
  | 'attendance.manage'
  | 'leave.view'
  | 'leave.apply'
  | 'leave.approve'
  | 'payroll.view'
  | 'payroll.manage'
  | 'performance.view'
  | 'performance.manage'
  | 'documents.view'
  | 'documents.manage'
  | 'tasks.view'
  | 'tasks.manage'
  | 'reports.view'
  | 'recruitment.view'
  | 'recruitment.manage'
  | 'settings.manage'
  | 'audit.view';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  organizationId: string;
  employeeId?: string;
  departmentId?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  currency: string;
  fiscalYearStart: string;
  timezone: string;
  createdAt: string;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'employees.view', 'employees.create', 'employees.update', 'employees.delete',
    'departments.view', 'departments.manage',
    'attendance.view', 'attendance.manage',
    'leave.view', 'leave.apply', 'leave.approve',
    'payroll.view', 'payroll.manage',
    'performance.view', 'performance.manage',
    'documents.view', 'documents.manage',
    'tasks.view', 'tasks.manage',
    'reports.view',
    'recruitment.view', 'recruitment.manage',
    'settings.manage',
    'audit.view',
  ],
  HR_ADMIN: [
    'employees.view', 'employees.create', 'employees.update',
    'departments.view', 'departments.manage',
    'attendance.view', 'attendance.manage',
    'leave.view', 'leave.apply', 'leave.approve',
    'payroll.view', 'payroll.manage',
    'performance.view', 'performance.manage',
    'documents.view', 'documents.manage',
    'tasks.view', 'tasks.manage',
    'reports.view',
    'recruitment.view', 'recruitment.manage',
    'settings.manage',
    'audit.view',
  ],
  MANAGER: [
    'employees.view',
    'departments.view',
    'attendance.view',
    'leave.view', 'leave.apply', 'leave.approve',
    'performance.view', 'performance.manage',
    'documents.view',
    'tasks.view', 'tasks.manage',
    'reports.view',
    'recruitment.view',
  ],
  EMPLOYEE: [
    'employees.view',
    'departments.view',
    'attendance.view',
    'leave.view', 'leave.apply',
    'performance.view',
    'documents.view',
    'tasks.view',
  ],
};
