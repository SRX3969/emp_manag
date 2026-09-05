import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Network,
  Clock,
  CalendarDays,
  CalendarRange,
  DollarSign,
  FileSpreadsheet,
  Target,
  Award,
  FolderLock,
  CheckSquare,
  Megaphone,
  BarChart3,
  Briefcase,
  Bell,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCheck,
  Calendar,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import { Permission } from '@/types/auth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: Permission;
  badge?: string | number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { hasPermission, role, currentOrg } = useAuth();
  const { leaveRequests, tasks } = useData();
  const location = useLocation();

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'PENDING').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  // EMPLOYER / MANAGEMENT NAVIGATION
  const employerNavigationGroups: NavGroup[] = [
    {
      group: 'EXECUTIVE',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'PEOPLE',
      items: [
        {
          label: 'Employees',
          path: '/employees',
          icon: <Users className="w-4 h-4" />,
          permission: 'employees.view',
        },
        {
          label: 'Departments',
          path: '/departments',
          icon: <Building2 className="w-4 h-4" />,
          permission: 'departments.view',
        },
        {
          label: 'Organization',
          path: '/organization',
          icon: <Network className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'WORKFORCE',
      items: [
        {
          label: 'Attendance',
          path: '/attendance',
          icon: <Clock className="w-4 h-4" />,
          permission: 'attendance.view',
        },
        {
          label: 'Leave Management',
          path: '/leave',
          icon: <CalendarDays className="w-4 h-4" />,
          permission: 'leave.view',
          badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
        },
        {
          label: 'Holidays',
          path: '/holidays',
          icon: <CalendarRange className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'PAYROLL',
      items: [
        {
          label: 'Payroll Runs',
          path: '/payroll',
          icon: <DollarSign className="w-4 h-4" />,
          permission: 'payroll.view',
        },
        {
          label: 'Payslips',
          path: '/payroll/payslips',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          permission: 'payroll.view',
        },
      ],
    },
    {
      group: 'PERFORMANCE',
      items: [
        {
          label: 'Goals & KPIs',
          path: '/performance',
          icon: <Target className="w-4 h-4" />,
          permission: 'performance.view',
        },
        {
          label: 'Reviews & Appraisals',
          path: '/performance/reviews',
          icon: <Award className="w-4 h-4" />,
          permission: 'performance.view',
        },
      ],
    },
    {
      group: 'RESOURCES',
      items: [
        {
          label: 'Documents Vault',
          path: '/documents',
          icon: <FolderLock className="w-4 h-4" />,
          permission: 'documents.view',
        },
        {
          label: 'Tasks & Sprints',
          path: '/tasks',
          icon: <CheckSquare className="w-4 h-4" />,
          permission: 'tasks.view',
          badge: openTasksCount > 0 ? openTasksCount : undefined,
        },
        {
          label: 'Announcements',
          path: '/announcements',
          icon: <Megaphone className="w-4 h-4" />,
          permission: 'announcements.view',
        },
      ],
    },
    {
      group: 'ANALYTICS',
      items: [
        {
          label: 'Reports & Exports',
          path: '/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          permission: 'reports.view',
        },
      ],
    },
    {
      group: 'TALENT ACQUISITION',
      items: [
        {
          label: 'Recruitment & ATS',
          path: '/recruitment',
          icon: <Briefcase className="w-4 h-4" />,
          permission: 'recruitment.view',
        },
      ],
    },
    {
      group: 'SYSTEM & COMPLIANCE',
      items: [
        {
          label: 'Notifications',
          path: '/notifications',
          icon: <Bell className="w-4 h-4" />,
        },
        {
          label: 'Audit Logs',
          path: '/audit-logs',
          icon: <ShieldAlert className="w-4 h-4" />,
          permission: 'audit.view',
        },
        {
          label: 'Company Settings',
          path: '/settings',
          icon: <Settings className="w-4 h-4" />,
          permission: 'settings.manage',
        },
      ],
    },
  ];

  // EMPLOYEE SELF-SERVICE NAVIGATION
  const employeeNavigationGroups: NavGroup[] = [
    {
      group: 'MY WORKSPACE',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          label: 'My Attendance',
          path: '/attendance',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          label: 'My Leave Requests',
          path: '/leave',
          icon: <CalendarDays className="w-4 h-4" />,
        },
        {
          label: 'Holidays Calendar',
          path: '/holidays',
          icon: <CalendarRange className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'MY FINANCES',
      items: [
        {
          label: 'My Payslips',
          path: '/payroll',
          icon: <Wallet className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'MY CAREER',
      items: [
        {
          label: 'Goals & Appraisals',
          path: '/performance',
          icon: <Target className="w-4 h-4" />,
        },
        {
          label: 'My Documents',
          path: '/documents',
          icon: <FolderLock className="w-4 h-4" />,
        },
        {
          label: 'My Tasks',
          path: '/tasks',
          icon: <CheckSquare className="w-4 h-4" />,
          badge: openTasksCount > 0 ? openTasksCount : undefined,
        },
      ],
    },
    {
      group: 'COMPANY',
      items: [
        {
          label: 'Announcements',
          path: '/announcements',
          icon: <Megaphone className="w-4 h-4" />,
        },
        {
          label: 'Team Directory',
          path: '/employees',
          icon: <Users className="w-4 h-4" />,
        },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: <Bell className="w-4 h-4" />,
        },
      ],
    },
  ];

  const activeGroups = role === 'EMPLOYEE' ? employeeNavigationGroups : employerNavigationGroups;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out dark:border-[#292B30] dark:bg-[#101113] select-none',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-3.5 dark:border-[#292B30]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-xs">
                {currentOrg.name.charAt(0)}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate font-heading">
                  {currentOrg.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  {role === 'EMPLOYEE' ? 'EMPLOYEE PORTAL' : 'ENTERPRISE SUITE'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              {currentOrg.name.charAt(0)}
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1D1F23] dark:hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
          {activeGroups.map((group) => {
            const filteredItems = group.items.filter((item) => {
              if (!item.permission) return true;
              return hasPermission(item.permission);
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.group} className="space-y-0.5">
                {!isCollapsed && (
                  <p className="px-2 pb-1 text-[10px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {group.group}
                  </p>
                )}

                {filteredItems.map((item) => {
                  const isActive =
                    item.path === '/dashboard'
                      ? location.pathname === '/dashboard' || location.pathname === '/'
                      : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => isMobileOpen && onMobileClose()}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/40 dark:text-blue-400'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#17181B] dark:hover:text-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        )}
                      >
                        {item.icon}
                      </span>

                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge !== undefined && (
                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}

                      {/* Active Left Indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 p-3 dark:border-[#292B30]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">{role}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected & Synced" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
