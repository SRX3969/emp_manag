import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  DollarSign,
  BarChart3,
  Bell,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderLock,
  CheckSquare,
  Megaphone,
  Network,
  Palmtree,
  Award,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import { Permission } from '@/types/auth';
import { Avatar } from '../ui/Avatar';

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
  const { hasPermission, role, currentOrg, currentUser } = useAuth();
  const { leaveRequests, tasks, announcements, notifications } = useData();
  const location = useLocation();

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'PENDING').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const navigationGroups: NavGroup[] = [
    {
      group: 'MAIN WORKSPACE',
      items: [
        {
          label: 'Overview',
          path: '/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
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
          label: 'Org Hierarchy',
          path: '/organization',
          icon: <Network className="w-4 h-4" />,
          permission: 'departments.view',
        },
      ],
    },
    {
      group: 'WORKFORCE & TIME',
      items: [
        {
          label: 'Attendance & Shifts',
          path: '/attendance',
          icon: <Clock className="w-4 h-4" />,
          permission: 'attendance.view',
        },
        {
          label: 'Leave Management',
          path: '/leave',
          icon: <CalendarDays className="w-4 h-4" />,
          permission: 'leave.view',
          badge: role !== 'EMPLOYEE' && pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
        },
        {
          label: 'Holidays Calendar',
          path: '/holidays',
          icon: <Palmtree className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'FINANCE & TALENT',
      items: [
        {
          label: 'Payroll & Payslips',
          path: '/payroll',
          icon: <DollarSign className="w-4 h-4" />,
          permission: 'payroll.view',
        },
        {
          label: 'Performance & OKRs',
          path: '/performance',
          icon: <Award className="w-4 h-4" />,
          permission: 'performance.view',
        },
        {
          label: 'Recruitment ATS',
          path: '/recruitment',
          icon: <Briefcase className="w-4 h-4" />,
          permission: 'recruitment.view',
        },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        {
          label: 'Tasks & Sprints',
          path: '/tasks',
          icon: <CheckSquare className="w-4 h-4" />,
          permission: 'tasks.view',
          badge: openTasksCount > 0 ? openTasksCount : undefined,
        },
        {
          label: 'Documents Vault',
          path: '/documents',
          icon: <FolderLock className="w-4 h-4" />,
          permission: 'documents.view',
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
      group: 'ANALYTICS & SYSTEM',
      items: [
        {
          label: 'Executive Reports',
          path: '/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          permission: 'reports.view',
        },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: <Bell className="w-4 h-4" />,
          badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
        },
        {
          label: 'Audit Trail',
          path: '/audit-logs',
          icon: <Activity className="w-4 h-4" />,
          permission: 'audit.view',
        },
        {
          label: 'Settings',
          path: '/settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity animate-reveal-fade"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-200 ease-in-out dark:border-[#242838] dark:bg-[#0E1015]/95 select-none shadow-sm',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-3.5 dark:border-[#242838]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-heading font-bold text-sm shadow-sm glow-accent">
                A
              </div>
              <div className="flex flex-col truncate">
                <span className="font-heading font-bold text-xs text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                  Apex Global
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
                    EMS
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentOrg.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-heading font-bold text-sm shadow-sm glow-accent">
              A
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-6.5 w-6.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1A1C26] dark:hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
          {navigationGroups.map((group) => {
            const filteredItems = group.items.filter((item) => {
              if (!item.permission) return true;
              return hasPermission(item.permission);
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.group} className="space-y-0.5">
                {!isCollapsed && (
                  <p className="px-2.5 pb-1 text-[9.5px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase font-mono">
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
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1A1C26]/80 dark:hover:text-slate-200'
                      )}
                    >
                      {/* Active Left Pill Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                      )}

                      <span
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                        )}
                      >
                        {item.icon}
                      </span>

                      {!isCollapsed && (
                        <span className="truncate flex-1 text-[12.5px]">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge !== undefined && (
                        <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom User Profile */}
        <div className="border-t border-slate-200 p-2.5 dark:border-[#242838]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/60 dark:bg-[#161822] border border-slate-200/70 dark:border-[#242838] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {role.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0" title="Connected to Cloud Sync">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="xs" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
