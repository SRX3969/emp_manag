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
  const { leaveRequests, tasks } = useData();
  const location = useLocation();

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'PENDING').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  const navigationGroups: NavGroup[] = [
    {
      group: 'WORKSPACE',
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
          label: 'Attendance',
          path: '/attendance',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          label: 'Leave',
          path: '/leave',
          icon: <CalendarDays className="w-4 h-4" />,
          badge: role !== 'EMPLOYEE' && pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
        },
        {
          label: 'Payroll',
          path: '/payroll',
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: 'Reports',
          path: '/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          permission: 'reports.view',
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
          label: 'Activity',
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#E8E8E5] bg-[#FAFAF9] transition-all duration-200 ease-in-out dark:border-[#242427] dark:bg-[#0B0B0C] select-none',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E8E8E5] px-4 dark:border-[#242427]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-semibold text-xs tracking-tight shadow-2xs">
                A
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-xs text-[#111111] dark:text-[#F5F5F5] tracking-tight truncate">
                  Apex
                </span>
                <span className="text-[10px] text-[#6B6B6B] dark:text-[#A1A1AA]">
                  People Operations
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-semibold text-xs shadow-2xs">
              A
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#E8E8E5]/60 hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:bg-[#242427] dark:hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {navigationGroups.map((group) => {
            const filteredItems = group.items.filter((item) => {
              if (!item.permission) return true;
              return hasPermission(item.permission);
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.group} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-2.5 pb-1 text-[10px] font-medium tracking-wider text-[#929292] dark:text-[#71717A] uppercase font-mono">
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
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all group relative',
                        isActive
                          ? 'bg-[#FFFFFF] text-[#111111] shadow-2xs border border-[#E8E8E5] dark:bg-[#18181B] dark:text-white dark:border-[#242427]'
                          : 'text-[#6B6B6B] hover:bg-[#FFFFFF]/70 hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:bg-[#18181B]/60 dark:hover:text-white'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive
                            ? 'text-[#5146E5] dark:text-[#6366F1]'
                            : 'text-[#929292] group-hover:text-[#111111] dark:text-[#71717A] dark:group-hover:text-white'
                        )}
                      >
                        {item.icon}
                      </span>

                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge !== undefined && (
                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5146E5] px-1 text-[10px] font-semibold text-white">
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
        <div className="border-t border-[#E8E8E5] p-3 dark:border-[#242427]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-1 rounded-lg hover:bg-[#FFFFFF] dark:hover:bg-[#18181B] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#A1A1AA] font-mono">
                    {role}
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Connected" />
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
