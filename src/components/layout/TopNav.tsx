import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Check,
  ChevronDown,
  User,
  LogOut,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn, formatDateTime } from '@/lib/utils';

interface TopNavProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export function TopNav({ onOpenMobileMenu, onOpenSearch }: TopNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, currentOrg, role, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-[#292B30] dark:bg-[#17181B]/95 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-[#1D1F23]"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currentOrg.name}</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="capitalize text-slate-600 dark:text-slate-300 font-medium">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]?.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between h-8.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 hover:border-slate-300 hover:bg-white dark:border-[#292B30] dark:bg-[#101113] dark:text-slate-400 dark:hover:border-slate-700 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search records, employees, tasks...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-mono border border-slate-200 text-slate-500 dark:bg-[#1D1F23] dark:border-[#292B30] dark:text-slate-400">
              Ctrl K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-[#1D1F23] dark:hover:text-slate-200 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-[#1D1F23] dark:hover:text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white dark:bg-[#17181B] border border-slate-200 dark:border-[#292B30] shadow-xl z-40 overflow-hidden animate-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#131417]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <Badge variant="info" size="sm">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#202227]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkUrl) {
                            navigate(notif.linkUrl);
                            setShowNotifications(false);
                          }
                        }}
                        className={cn(
                          'p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1D1F23]',
                          !notif.isRead && 'bg-blue-50/30 dark:bg-blue-950/20'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                          {formatDateTime(notif.createdAt)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1D1F23] transition-colors"
          >
            <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" status="online" />
            <div className="hidden md:flex flex-col text-left text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-[#17181B] border border-slate-200 dark:border-[#292B30] shadow-xl z-40 p-1 text-xs divide-y divide-slate-100 dark:divide-[#202227] animate-in zoom-in-95 duration-100">
                <div className="px-3 py-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                  <div className="mt-1.5">
                    <Badge variant="info" size="sm">
                      {role}
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Company Settings</span>
                  </Link>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
