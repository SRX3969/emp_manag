import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building,
  Users,
  Clock,
  Calendar,
  Shield,
  Palette,
  CheckCircle,
  Save,
  Lock,
} from 'lucide-react';
import { PageTransition } from '@/components/motion/Motion';

export function SettingsPage() {
  const { settings, updateSettings, employees } = useData();
  const { currentUser, role } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('company');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [companyForm, setCompanyForm] = useState({
    companyName: settings.companyName,
    companyEmail: settings.companyEmail,
    companyPhone: settings.companyPhone,
    companyAddress: settings.companyAddress,
    currency: settings.currency,
    timezone: settings.timezone,
    standardWorkHours: settings.standardWorkHours,
    allowRemoteClockIn: settings.allowRemoteClockIn,
    autoApproveLeaves: settings.autoApproveLeaves,
    notifyOnLeaveRequest: settings.notifyOnLeaveRequest,
    notifyOnPayrollRun: settings.notifyOnPayrollRun,
    twoFactorRequired: settings.twoFactorRequired,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(companyForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Organization Settings & Policies"
        description="Global system configurations, company governance rules, security parameters, and regional localization."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <Tabs
        tabs={[
          { id: 'company', label: 'Company Profile' },
          { id: 'users', label: 'Users & Roles' },
          { id: 'attendance', label: 'Attendance Rules' },
          { id: 'leave', label: 'Leave Policies' },
          { id: 'security', label: 'Security & 2FA' },
          { id: 'appearance', label: 'Appearance' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {savedSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration updates successfully committed to database.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Company Profile */}
        {activeTab === 'company' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Corporate Legal Entity Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Legal Corporate Name"
                required
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
              />
              <Input
                label="Official Contact Email"
                type="email"
                required
                value={companyForm.companyEmail}
                onChange={(e) => setCompanyForm({ ...companyForm, companyEmail: e.target.value })}
              />
              <Input
                label="Main Phone"
                value={companyForm.companyPhone}
                onChange={(e) => setCompanyForm({ ...companyForm, companyPhone: e.target.value })}
              />
              <Select
                label="Base Currency"
                value={companyForm.currency}
                onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                options={[
                  { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                  { value: 'USD', label: 'USD ($) - US Dollar' },
                  { value: 'EUR', label: 'EUR (€) - Euro' },
                  { value: 'GBP', label: 'GBP (£) - British Pound' },
                ]}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Registered Corporate Headquarters Address"
                  value={companyForm.companyAddress}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyAddress: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users & Roles */}
        {activeTab === 'users' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-[#202227] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                System Access Hierarchy
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
              {[
                { name: 'Rahul Sharma', email: 'rahul.sharma@apexglobal.in', role: 'SUPER_ADMIN', desc: 'Full System Control' },
                { name: 'Ananya Rao', email: 'ananya.rao@apexglobal.in', role: 'HR_ADMIN', desc: 'HR Operations' },
                { name: 'Arjun Kumar', email: 'arjun.kumar@apexglobal.in', role: 'MANAGER', desc: 'Engineering Team Lead' },
                { name: 'Priya Patel', email: 'priya.patel@apexglobal.in', role: 'EMPLOYEE', desc: 'Self Service' },
              ].map((u) => (
                <div key={u.email} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                      <p className="text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info" size="sm">
                      {u.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Attendance Rules */}
        {activeTab === 'attendance' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Attendance Rules & Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Standard Shift Hours per Day"
                type="number"
                value={companyForm.standardWorkHours}
                onChange={(e) => setCompanyForm({ ...companyForm, standardWorkHours: Number(e.target.value) })}
              />
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="remote-clockin"
                  checked={companyForm.allowRemoteClockIn}
                  onChange={(e) => setCompanyForm({ ...companyForm, allowRemoteClockIn: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remote-clockin" className="text-slate-700 dark:text-slate-300 font-medium">
                  Allow Remote & Hybrid Clock In
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Leave Policies */}
        {activeTab === 'leave' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Leave Request Notification Rules
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notify-leave"
                  checked={companyForm.notifyOnLeaveRequest}
                  onChange={(e) => setCompanyForm({ ...companyForm, notifyOnLeaveRequest: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notify-leave" className="text-slate-700 dark:text-slate-300">
                  Notify Department Manager immediately when leave is requested
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notify-payroll"
                  checked={companyForm.notifyOnPayrollRun}
                  onChange={(e) => setCompanyForm({ ...companyForm, notifyOnPayrollRun: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notify-payroll" className="text-slate-700 dark:text-slate-300">
                  Send email alert to employees when monthly payslips are disbursed
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Security Policies & Two-Factor Authentication
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="two-factor"
                checked={companyForm.twoFactorRequired}
                onChange={(e) => setCompanyForm({ ...companyForm, twoFactorRequired: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="two-factor" className="text-slate-700 dark:text-slate-300 font-medium">
                Enforce Two-Factor Authentication (2FA) for all administrative roles
              </label>
            </div>
          </div>
        )}

        {/* Tab 6: Appearance */}
        {activeTab === 'appearance' && (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Visual Theme Preference
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-[#292B30]'
                }`}
              >
                <div className="w-6 h-6 rounded bg-[#F8F9FA] border border-slate-300 mb-2" />
                <span className="font-bold block">Enterprise Light</span>
                <span className="text-[11px] text-slate-500">High contrast white & neutral slate</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-[#292B30]'
                }`}
              >
                <div className="w-6 h-6 rounded bg-[#101113] border border-slate-700 mb-2" />
                <span className="font-bold block">Enterprise Dark</span>
                <span className="text-[11px] text-slate-500">Calm matte dark slate (#101113)</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-[#292B30]'
                }`}
              >
                <div className="w-6 h-6 rounded bg-gradient-to-r from-[#F8F9FA] to-[#101113] border border-slate-400 mb-2" />
                <span className="font-bold block">System Auto</span>
                <span className="text-[11px] text-slate-500">Syncs with OS color preference</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#292B30]">
          <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </PageTransition>
  );
}
