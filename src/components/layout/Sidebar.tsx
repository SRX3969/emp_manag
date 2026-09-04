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
  UserPlus,
  Bell,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
  const { hasPermission, role } = useAuth();
  const location = useLocation();

  const navigationGroups: NavGroup[] = [
    {
      group: 'DASHBOARD',
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
          permission: 'payroll.manage',
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
          path: '/performance/goals',
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
          label: 'Documents',
          path: '/documents',
          icon: <FolderLock className="w-4 h-4" />,
          permission: 'documents.view',
        },
        {
          label: 'Tasks',
          path: '/tasks',
          icon: <CheckSquare className="w-4 h-4" />,
          permission: 'tasks.view',
        },
        {
          label: 'Announcements',
          path: '/announcements',
          icon: <Megaphone className="w-4 h-4" />,
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
      group: 'RECRUITMENT',
      items: [
        {
          label: 'Job Openings',
          path: '/recruitment/jobs',
          icon: <Briefcase className="w-4 h-4" />,
          permission: 'recruitment.view',
        },
        {
          label: 'Candidates Pipeline',
          path: '/recruitment/candidates',
          icon: <UserPlus className="w-4 h-4" />,
          permission: 'recruitment.view',
        },
      ],
    },
    {
      group: 'SYSTEM',
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
          label: 'Settings',
          path: '/settings',
          icon: <Settings className="w-4 h-4" />,
          permission: 'settings.manage',
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-white dark:bg-[#17181B] border-r border-slate-200 dark:border-[#292B30] py-4">
      {/* Brand Header */}
      <div>
        <div className={cn('flex items-center px-4 mb-6', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  Apex EMS
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Enterprise HR Suite
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              A
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-[#1D1F23] dark:hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 px-2">
          {navigationGroups.map((grp) => {
            // Filter items user has permission to see
            const visibleItems = grp.items.filter(
              (item) => !item.permission || hasPermission(item.permission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {grp.group}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive =
                      item.path === '/dashboard'
                        ? location.pathname === '/dashboard' || location.pathname === '/'
                        : location.pathname.startsWith(item.path);

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onMobileClose}
                        title={isCollapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group relative',
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-semibold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1D1F23] dark:hover:text-slate-200',
                          isCollapsed && 'justify-center px-2'
                        )}
                      >
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                          )}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}

                        {!isCollapsed && item.badge && (
                          <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {item.badge}
                          </span>
                        )}

                        {/* Active Accent Bar on Left */}
                        {isActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-600 dark:bg-blue-500" />
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer System Info */}
      {!isCollapsed && (
        <div className="px-4 pt-4 border-t border-slate-100 dark:border-[#202227] text-[11px] text-slate-400 dark:text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-400">Apex Global Platform</p>
          <p className="text-[10px]">v2.6.4 · Production Stable</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-200 z-30',
          isCollapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onMobileClose} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#17181B] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
