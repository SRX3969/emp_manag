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
  const { currentUser, currentOrg, organizations, switchOrganization, createOrganization, role, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCurrency, setNewOrgCurrency] = useState('USD');
  const [newOrgTimezone, setNewOrgTimezone] = useState('America/New_York (EST)');

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
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-[#292B30] dark:bg-[#17181B]/95 select-none">
      {/* Left: Mobile Toggle & Organization Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-[#1D1F23]"
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
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50/80 hover:bg-slate-100 dark:border-[#292B30] dark:bg-[#131417] dark:hover:bg-[#1D1F23] transition-colors cursor-pointer text-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-slate-100 max-w-[150px] sm:max-w-[200px] truncate">
              {currentOrg.name}
            </span>
            {currentOrg.isDemo ? (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 text-[10px] font-medium border border-amber-300 dark:border-amber-800">
                Demo
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-medium border border-emerald-300 dark:border-emerald-800">
                Live Org
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showOrgMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowOrgMenu(false)} />
              <div className="absolute left-0 mt-2 w-72 rounded-lg bg-white dark:bg-[#17181B] border border-slate-200 dark:border-[#292B30] shadow-xl z-40 p-1 text-xs divide-y divide-slate-100 dark:divide-[#202227] animate-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase tracking-wider font-semibold">
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
                            ? 'bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950/40 dark:text-blue-200'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1D1F23]'
                        )}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate">{org.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                            {org.isDemo ? 'Preloaded Demo Data' : 'Production Zero State'}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
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
                    className="flex w-full items-center gap-2 px-3 py-2 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors font-medium"
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
              setShowOrgMenu(false);
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
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'INR', label: 'INR (₹)' },
                { value: 'SGD', label: 'SGD (S$)' },
              ]}
              value={newOrgCurrency}
              onChange={(e) => setNewOrgCurrency(e.target.value)}
            />

            <Select
              label="Timezone"
              options={[
                { value: 'America/New_York (EST)', label: 'America/New_York (EST)' },
                { value: 'America/Los_Angeles (PST)', label: 'America/Los_Angeles (PST)' },
                { value: 'Europe/London (GMT)', label: 'Europe/London (GMT)' },
                { value: 'Asia/Kolkata (IST)', label: 'Asia/Kolkata (IST)' },
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
