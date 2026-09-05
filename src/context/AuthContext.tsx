import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Role, Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { mockOrganization, mockUsers } from '@/data/mockData';

export const cleanProductionOrg: Organization = {
  id: 'org_prod_clean',
  name: 'Acme Corporation (Production)',
  slug: 'acme-corp-prod',
  currency: 'USD',
  fiscalYearStart: 'January',
  timezone: 'America/New_York (EST)',
  isDemo: false,
  createdAt: '2026-09-01T00:00:00Z',
};

const initialOrganizations: Organization[] = [
  { ...mockOrganization, isDemo: true, name: 'Apex Global Technologies (Demo)' },
  cleanProductionOrg,
];

interface AuthContextType {
  currentUser: User;
  currentOrg: Organization;
  organizations: Organization[];
  role: Role;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  switchRole: (role: Role) => void;
  switchOrganization: (orgId: string) => void;
  createOrganization: (data: { name: string; currency: string; timezone: string }) => Organization;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('emp_organizations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Ignore fallback
      }
    }
    return initialOrganizations;
  });

  const [currentOrg, setCurrentOrg] = useState<Organization>(() => {
    const savedOrgId = localStorage.getItem('emp_active_org_id');
    if (savedOrgId) {
      const match = organizations.find((o) => o.id === savedOrgId);
      if (match) return match;
    }
    return organizations[0] || mockOrganization;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('emp_active_role') as Role;
    if (savedRole) {
      const match = mockUsers.find((u) => u.role === savedRole);
      if (match) return { ...match, organizationId: currentOrg.id };
    }
    return { ...mockUsers[0], organizationId: currentOrg.id }; // Default: Rahul Sharma (SUPER_ADMIN)
  });

  useEffect(() => {
    localStorage.setItem('emp_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('emp_active_org_id', currentOrg.id);
  }, [currentOrg]);

  const permissions = ROLE_PERMISSIONS[currentUser.role] || [];

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const switchRole = (newRole: Role) => {
    const matchedUser = mockUsers.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser({
      ...matchedUser,
      organizationId: currentOrg.id,
    });
    localStorage.setItem('emp_active_role', newRole);
  };

  const switchOrganization = (orgId: string) => {
    const target = organizations.find((o) => o.id === orgId);
    if (target) {
      setCurrentOrg(target);
      setCurrentUser((prev) => ({
        ...prev,
        organizationId: target.id,
      }));
    }
  };

  const createOrganization = (data: { name: string; currency: string; timezone: string }): Organization => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: data.name,
      slug,
      currency: data.currency || 'USD',
      fiscalYearStart: 'January',
      timezone: data.timezone || 'America/New_York (EST)',
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setCurrentOrg(newOrg);
    setCurrentUser((prev) => ({
      ...prev,
      organizationId: newOrg.id,
    }));

    return newOrg;
  };

  const logout = () => {
    switchRole('EMPLOYEE');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentOrg,
        organizations,
        role: currentUser.role,
        permissions,
        hasPermission,
        switchRole,
        switchOrganization,
        createOrganization,
        setUser: setCurrentUser,
        isAuthenticated: true,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
