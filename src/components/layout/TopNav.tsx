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
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF9]/95 px-4 backdrop-blur-xs dark:border-[#242427] dark:bg-[#0B0B0C]/95 select-none">
      {/* Left: Mobile Toggle & Organization Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-[#6B6B6B] hover:bg-[#E8E8E5]/50 hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:bg-[#18181B]"
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
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#E8E8E5] bg-white hover:border-[#D1D1CD] dark:border-[#242427] dark:bg-[#111113] dark:hover:border-[#38383C] transition-colors cursor-pointer text-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-[#5146E5] dark:text-[#6366F1] shrink-0" />
            <span className="font-semibold text-[#111111] dark:text-[#F5F5F5] max-w-[150px] sm:max-w-[200px] truncate">
              {currentOrg.name}
            </span>
            {currentOrg.isDemo ? (
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-medium border border-amber-200 dark:border-amber-800/50">
                Demo
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-medium border border-emerald-200 dark:border-emerald-800/50">
                Live
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-[#929292] shrink-0" />
          </button>

          {showOrgMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowOrgMenu(false)} />
              <div className="absolute left-0 mt-2 w-72 rounded-lg bg-white dark:bg-[#111113] border border-[#E8E8E5] dark:border-[#242427] shadow-lg z-40 p-1 text-xs divide-y divide-[#E8E8E5] dark:divide-[#242427] animate-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[#929292] dark:text-[#71717A] font-mono text-[10px] uppercase tracking-wider font-semibold">
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
                          'flex w-full items-center justify-between px-3 py-2 rounded text-left transition-colors',
                          isSelected
                            ? 'bg-[#EEF2FF] text-[#3730A3] font-semibold dark:bg-[#1E1B4B] dark:text-[#C7D2FE]'
                            : 'text-[#111111] dark:text-[#F5F5F5] hover:bg-[#FAFAF9] dark:hover:bg-[#18181B]'
                        )}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate">{org.name}</span>
                          <span className="text-[10px] text-[#6B6B6B] dark:text-[#A1A1AA] font-normal">
                            {org.isDemo ? 'Preloaded Demo Data' : 'Production Workspace'}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#5146E5] dark:text-[#6366F1] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowNewOrgModal(true);
                      setShowOrgMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded text-[#5146E5] dark:text-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B]/40 transition-colors font-medium cursor-pointer"
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
        <div className="hidden md:flex items-center gap-2 text-xs text-[#6B6B6B] dark:text-[#A1A1AA]">
          <span className="text-[#E8E8E5] dark:text-[#242427]">/</span>
          <span className="capitalize text-[#111111] dark:text-[#F5F5F5] font-medium">
            {location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]?.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between h-8.5 rounded-lg border border-[#E8E8E5] bg-white px-3 text-xs text-[#6B6B6B] hover:border-[#D1D1CD] dark:border-[#242427] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:border-[#38383C] transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#929292]" />
            <span className="hidden sm:inline">Search employees, departments, records...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-block rounded bg-[#FAFAF9] px-1.5 py-0.5 text-[10px] font-mono border border-[#E8E8E5] text-[#6B6B6B] dark:bg-[#18181B] dark:border-[#242427] dark:text-[#A1A1AA]">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg border border-[#E8E8E5] hover:bg-[#FAFAF9] dark:border-[#242427] dark:hover:bg-[#18181B] text-[#6B6B6B] dark:text-[#A1A1AA] transition-all cursor-pointer shadow-2xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-[#111111] hover:-rotate-12 transition-transform" />
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
            className="relative p-1.5 rounded-lg border border-[#E8E8E5] hover:bg-[#FAFAF9] dark:border-[#242427] dark:hover:bg-[#18181B] text-[#6B6B6B] dark:text-[#A1A1AA] transition-all cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5146E5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5146E5]"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#111113] border border-[#E8E8E5] dark:border-[#242427] shadow-xl z-40 overflow-hidden animate-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E5] dark:border-[#242427] bg-[#FAFAF9] dark:bg-[#18181B]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5]">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#5146E5] dark:bg-[#1E1B4B] dark:text-[#C7D2FE]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#5146E5] hover:underline dark:text-[#6366F1] cursor-pointer font-medium"
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
              setShowOrgMenu(false);
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
                  <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Switch Persona / Role
                  </span>
                  <div className="grid grid-cols-2 gap-1 px-2 py-1">
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
                          'px-2 py-1 rounded text-[11px] font-medium text-left transition-colors cursor-pointer',
                          role === item.r
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-[#1D1F23] text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
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
                    className="flex w-full items-center gap-2 px-3 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
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

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-0.5">Genuine Data Guarantee:</p>
            <p>
              Your new organization will start in a clean production state with 0 employees, 0 attendance records, and default leave policies.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#292B30]">
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
