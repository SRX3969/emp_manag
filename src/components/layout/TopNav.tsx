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
  PlusCircle,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { cn, formatDateTime } from '@/lib/utils';

interface TopNavProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export function TopNav({ onOpenMobileMenu, onOpenSearch }: TopNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, currentOrg, organizations, switchOrganization, createOrganization, role, logout, switchRole } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCurrency, setNewOrgCurrency] = useState('INR');
  const [newOrgTimezone, setNewOrgTimezone] = useState('Asia/Kolkata (IST)');

  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    createOrganization({
      name: newOrgName.trim(),
      currency: newOrgCurrency,
      timezone: newOrgTimezone,
    });
    setNewOrgName('');
    setShowNewOrgModal(false);
    setShowOrgMenu(false);
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-2.5 sm:px-4 backdrop-blur-md dark:border-[#242838] dark:bg-[#0E1015]/90 select-none shadow-xs">
      {/* Left: Mobile Toggle & Organization Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1A1C26] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Organization Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowOrgMenu(!showOrgMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 dark:border-[#242838] dark:bg-[#12131A] dark:hover:border-[#383E54] transition-all cursor-pointer text-xs font-medium"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-slate-100 max-w-[90px] xs:max-w-[130px] sm:max-w-[200px] truncate">
              {currentOrg.name}
            </span>
            {currentOrg.isDemo ? (
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800/50">
                Demo
              </span>
            ) : (
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/50">
                Live
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showOrgMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowOrgMenu(false)} />
              <div className="fixed inset-x-3 top-16 sm:top-auto sm:inset-auto sm:left-0 sm:absolute mt-2 w-auto sm:w-72 rounded-xl bg-white dark:bg-[#12131A] border border-slate-200 dark:border-[#242838] shadow-xl z-40 p-1.5 text-xs divide-y divide-slate-100 dark:divide-[#242838] animate-reveal-scale">
                <div className="px-3 py-2 text-slate-400 dark:text-slate-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  Select Organization
                </div>

                <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
                  {organizations.map((org) => {
                    const isSelected = org.id === currentOrg.id;
                    return (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrganization(org.id);
                          setShowOrgMenu(false);
                        }}
                        className={cn(
                          'flex w-full items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1A1C26]'
                        )}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate">{org.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">
                            {org.isDemo ? 'Preloaded Demo Data' : 'Production Workspace'}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="py-1 pt-1.5">
                  <button
                    onClick={() => {
                      setShowNewOrgModal(true);
                      setShowOrgMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors font-medium cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create New Organization</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Page Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="capitalize text-slate-900 dark:text-slate-100 font-semibold tracking-tight">
            {location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]?.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="flex-1 max-w-[140px] xs:max-w-xs sm:max-w-md mx-1.5 sm:mx-4">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between h-9 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 px-2 sm:px-3 text-xs text-slate-500 dark:border-[#242838] dark:bg-[#12131A] dark:text-slate-400 dark:hover:border-[#383E54] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
            <span className="hidden sm:inline truncate">Search employees, departments, records...</span>
            <span className="sm:hidden text-[11px] truncate">Search...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono border border-slate-200 text-slate-600 dark:bg-[#1A1C26] dark:border-[#242838] dark:text-slate-300 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-[#242838] dark:hover:bg-[#1A1C26] text-slate-600 dark:text-slate-400 transition-all cursor-pointer shadow-2xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowOrgMenu(false);
            }}
            className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-[#242838] dark:hover:bg-[#1A1C26] text-slate-600 dark:text-slate-400 transition-all cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="fixed inset-x-3 top-16 sm:top-auto sm:inset-auto sm:right-0 sm:absolute mt-2 w-auto sm:w-96 rounded-xl bg-white dark:bg-[#12131A] border border-slate-200 dark:border-[#242838] shadow-xl z-40 overflow-hidden animate-reveal-scale">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#242838] bg-slate-50/70 dark:bg-[#161822]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer font-medium"
                    >
                      Mark all read
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
                          'p-3.5 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1A1C26]',
                          !notif.isRead && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1 glow-accent" />
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block font-mono">
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
              setShowOrgMenu(false);
            }}
            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1C26] transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-[#242838]"
          >
            <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" status="online" />
            <div className="hidden md:flex flex-col text-left text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                {role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="fixed inset-x-3 top-16 sm:top-auto sm:inset-auto sm:right-0 sm:absolute mt-2 w-auto sm:w-60 rounded-xl bg-white dark:bg-[#12131A] border border-slate-200 dark:border-[#242838] shadow-xl z-40 p-1.5 text-xs divide-y divide-slate-100 dark:divide-[#242838] animate-reveal-scale">
                <div className="px-3 py-2.5">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge variant="info" size="sm">
                      {role}
                    </Badge>
                    <span className="text-[10px] text-slate-400">· {currentOrg.name}</span>
                  </div>
                </div>

                <div className="py-1.5">
                  <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Instant Switch Persona
                  </span>
                  <div className="grid grid-cols-2 gap-1 px-1.5 py-1">
                    {[
                      { r: 'SUPER_ADMIN' as const, label: 'Super Admin' },
                      { r: 'HR_ADMIN' as const, label: 'HR Director' },
                      { r: 'MANAGER' as const, label: 'Manager' },
                      { r: 'EMPLOYEE' as const, label: 'Employee' },
                    ].map((item) => (
                      <button
                        key={item.r}
                        onClick={() => {
                          switchRole(item.r);
                          setShowProfileMenu(false);
                        }}
                        type="button"
                        className={cn(
                          'px-2 py-1.5 rounded-md text-[11px] font-medium text-left transition-colors cursor-pointer',
                          role === item.r
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-[#1A1C26] text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1A1C26] transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Company Settings</span>
                  </Link>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer font-medium"
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

      {/* New Organization Modal */}
      <Dialog
        isOpen={showNewOrgModal}
        onClose={() => setShowNewOrgModal(false)}
        title="Create New Organization"
        description="Initialize a clean production organization with isolated employee records and workforce policies."
        maxWidth="md"
      >
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <Input
            label="Organization Name"
            placeholder="e.g., Nexus Enterprises Inc."
            required
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Operating Currency"
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
                { value: 'EUR', label: 'EUR (€) - Euro' },
                { value: 'GBP', label: 'GBP (£) - British Pound' },
                { value: 'SGD', label: 'SGD (S$)' },
              ]}
              value={newOrgCurrency}
              onChange={(e) => setNewOrgCurrency(e.target.value)}
            />

            <Select
              label="Timezone"
              options={[
                { value: 'Asia/Kolkata (IST)', label: 'Asia/Kolkata (IST - India)' },
                { value: 'America/New_York (EST)', label: 'America/New_York (EST)' },
                { value: 'America/Los_Angeles (PST)', label: 'America/Los_Angeles (PST)' },
                { value: 'Europe/London (GMT)', label: 'Europe/London (GMT)' },
                { value: 'Asia/Singapore (SGT)', label: 'Asia/Singapore (SGT)' },
              ]}
              value={newOrgTimezone}
              onChange={(e) => setNewOrgTimezone(e.target.value)}
            />
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-lg text-xs text-indigo-900 dark:text-indigo-300">
            <p className="font-semibold mb-0.5">Production Workspace Guarantee:</p>
            <p>
              Your new organization starts in a clean production state with 0 employees, 0 attendance records, and default leave policies.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#242838]">
            <Button variant="outline" type="button" onClick={() => setShowNewOrgModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Initialize Organization
            </Button>
          </div>
        </form>
      </Dialog>
    </header>
  );
}
