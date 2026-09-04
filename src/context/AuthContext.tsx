import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Role, Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { mockOrganization, mockUsers } from '@/data/mockData';

interface AuthContextType {
  currentUser: User;
  currentOrg: Organization;
  role: Role;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  switchRole: (role: Role) => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('emp_active_role') as Role;
    if (savedRole) {
      const match = mockUsers.find((u) => u.role === savedRole);
      if (match) return match;
    }
    return mockUsers[0]; // Default: Rahul Sharma (SUPER_ADMIN)
  });

  const [currentOrg, setCurrentOrg] = useState<Organization>(mockOrganization);

  const permissions = ROLE_PERMISSIONS[currentUser.role] || [];

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const switchRole = (newRole: Role) => {
    const matchedUser = mockUsers.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(matchedUser);
    localStorage.setItem('emp_active_role', newRole);
  };

  const logout = () => {
    // In demo / preview, reset to employee role
    switchRole('EMPLOYEE');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentOrg,
        role: currentUser.role,
        permissions,
        hasPermission,
        switchRole,
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
