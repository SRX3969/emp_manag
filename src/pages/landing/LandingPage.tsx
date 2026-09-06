import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Clock,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  FileText,
  Search,
  ChevronRight,
  Briefcase,
  UserCheck,
  BarChart3,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PageTransition, RevealCard, FadeIn } from '@/components/motion/Motion';

export function LandingPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'employee' | 'payroll'>('dashboard');

  const handleQuickDemo = (role: 'SUPER_ADMIN' | 'EMPLOYEE') => {
    if (role === 'SUPER_ADMIN') {
      login('rahul.sharma@apexglobal.com', 'password123', 'SUPER_ADMIN');
    } else {
      login('priya.patel@apexglobal.com', 'password123', 'EMPLOYEE');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans transition-colors duration-200 selection:bg-[var(--accent)] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--surface)]/90 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white font-semibold flex items-center justify-center text-sm shadow-xs">
              A
            </div>
            <div>
              <span className="font-heading font-semibold text-sm text-[var(--text-primary)] tracking-tight">
                Apex Global
              </span>
              <span className="text-[10px] text-[var(--accent)] font-mono ml-1.5 font-medium">
                EMS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-[var(--text-primary)] transition-colors">
              Platform Architecture
            </a>
            <a href="#portals" className="hover:text-[var(--text-primary)] transition-colors">
              Dual Portals
            </a>
            <a href="#security" className="hover:text-[var(--text-primary)] transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-all cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <button
                  onClick={() => handleQuickDemo('SUPER_ADMIN')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium shadow-xs cursor-pointer transition-all"
                >
                  <span>Launch Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <PageTransition variant="fade">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-normal mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Enterprise Workforce Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--text-primary)] font-heading leading-[1.12] max-w-4xl mx-auto">
              Manage your workforce <br className="hidden sm:block" />
              <span className="text-[var(--text-secondary)] font-normal">with clarity and precision.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              A calm, unified operating platform for complete employee lifecycles, precision shift attendance, intelligent leave balance approvals, and automated payroll runs.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 h-10 text-sm font-medium shadow-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Management Portal
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="px-5 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-[var(--accent)]" />
                <span>Test Employee Self-Service</span>
              </button>
            </div>

            {/* Micro Metrics Strip */}
            <div className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-heading">100%</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">Real Data Operations</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Dual</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">Employer & Staff Portals</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-heading">6-Tab</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">360° Employee Dossiers</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Ctrl+K</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">Global Command Search</p>
              </div>
            </div>
          </PageTransition>
        </div>
      </section>

      {/* Interactive Platform Preview Showcase */}
      <section id="preview" className="py-16 border-y border-[var(--border-color)] bg-[var(--surface-elevated)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] font-heading">
              Platform Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal">
              High-performance modules engineered for operational clarity and live data execution.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Command Center
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Shift Terminal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'employee'
                    ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                360° Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payroll')}
                className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'payroll'
                    ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Payroll & Payslips
              </button>
            </div>
          </div>

          {/* Tab Preview Box */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-xs overflow-hidden">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Workforce Analytics & Headcount Velocity
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Live operational aggregate computed across all personnel</p>
                  </div>
                  <Badge variant="info" size="sm">Realtime Synced</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Total Headcount</p>
                    <p className="text-xl font-semibold text-[var(--text-primary)] mt-1 font-heading">12 Active</p>
                    <p className="text-[10px] text-emerald-500 font-medium mt-0.5">100% Retention</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Daily Attendance</p>
                    <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">92% Rate</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">11 Present / 1 Remote</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Pending Approvals</p>
                    <p className="text-xl font-semibold text-amber-600 dark:text-amber-400 mt-1 font-heading">2 Requests</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Avg turnaround 1.2 hrs</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Monthly Payroll</p>
                    <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 mt-1 font-heading">$108,500</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">100% On-time Disbursed</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Precision Shift Terminal
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Sub-second timestamp recording with work mode tagging</p>
                  </div>
                  <Badge variant="success" size="sm">Active Terminal</Badge>
                </div>
                <div className="p-6 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-center space-y-2">
                  <div className="inline-block px-4 py-2 rounded-md bg-[var(--surface)] border border-[var(--border-color)]">
                    <span className="font-mono text-2xl font-semibold text-[var(--text-primary)] tracking-wider">
                      09:41:22 AM
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">Live Server Synced Time · Geofence Verified</p>
                </div>
              </div>
            )}

            {activeTab === 'employee' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Unified 360° Employee Dossier
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Overview, Attendance, Leave, Payroll, Documents & Audit Log</p>
                  </div>
                  <Badge variant="neutral" size="sm">EMP-001 · Rahul Sharma</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['1. Overview', '2. Attendance History', '3. Leave Balances', '4. Salary & Payslips', '5. Documents Vault', '6. Audit Trail'].map((t, idx) => (
                    <div
                      key={t}
                      className={`px-3 py-1.5 rounded-md border ${
                        idx === 0
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent-text)] font-semibold'
                          : 'border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Multi-Tier Compensation & Itemized Payslips
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Automated gross-to-net salary calculations with print formatting</p>
                  </div>
                  <Badge variant="success" size="sm">Ready to Print</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-elevated)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-2">Earnings Breakdown</p>
                    <div className="space-y-1.5 text-[var(--text-secondary)]">
                      <div className="flex justify-between"><span>Base Salary</span><span className="font-medium text-[var(--text-primary)]">$12,500.00</span></div>
                      <div className="flex justify-between"><span>Housing Allowance (HRA)</span><span className="font-medium text-[var(--text-primary)]">$2,500.00</span></div>
                      <div className="flex justify-between"><span>Special Allowance</span><span className="font-medium text-[var(--text-primary)]">$1,000.00</span></div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-elevated)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-2">Statutory Deductions & Net</p>
                    <div className="space-y-1.5 text-[var(--text-secondary)]">
                      <div className="flex justify-between"><span>Income Tax (TDS)</span><span className="text-red-500 font-medium">-$1,800.00</span></div>
                      <div className="flex justify-between"><span>Provident Fund / 401(k)</span><span className="text-red-500 font-medium">-$750.00</span></div>
                      <div className="flex justify-between pt-1 border-t border-[var(--border-color)] font-semibold text-[var(--text-primary)]">
                        <span>Net Take Home</span><span className="text-emerald-600 dark:text-emerald-400 font-bold">$13,450.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6 Core Feature Capabilities Grid */}
      <section id="features" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] font-heading">
              Engineered for Enterprise Operational Excellence
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Strict role authorization, genuine database calculations, and zero visual clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Complete Employee 360°
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Full-spectrum directory with multi-tier department hierarchy, designation routing, emergency contacts, and document storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Precision Shift Attendance
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Live digital clock shift recording, On-site / Remote / Hybrid tag selection, automatic punctuality scoring, and timesheets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Intelligent Leave Balances
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Annual, Sick, Casual, Parental, and Unpaid leave balances with dynamic deduction upon approval and calendar overlap prevention.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Automated Payroll Engine
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                One-click payroll run generation, statutory deductions, bank routing mask, and printable itemized PDF-styled payslips.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Global Command Palette (Ctrl+K)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Instant keyboard shortcut navigation across all employees, departments, quick clock-in actions, and report shortcuts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
                Immutable Audit Logs & RBAC
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Role-based access control with granular permissions for Super Admin, HR Director, Department Manager, and Employee roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Showcase Section */}
      <section id="portals" className="py-16 border-t border-[var(--border-color)] bg-[var(--surface-elevated)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] font-heading">
              Tailored Dual Portals for Every Role
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Executives manage operations while employees enjoy a dedicated self-service workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employer Card */}
            <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">Employer / HR Command Suite</h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">Super Admins, HR Directors & Managers</p>
                  </div>
                </div>
                <Badge variant="info">Management</Badge>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Workforce analytics, headcount growth & retention metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>One-click leave approval queue with instant balance deductions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Payroll run processing, disbursement authorization & tax summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Full organization audit log and administrative security settings</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('SUPER_ADMIN')}
                  className="w-full py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Launch Management Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Employee Card */}
            <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">Employee Self-Service Portal</h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">Staff Engineers, Designers & Operators</p>
                  </div>
                </div>
                <Badge variant="success">Self-Service</Badge>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Live shift clock-in/out with On-site, Remote & Hybrid tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Real-time leave balance tracking & instant request submission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Itemized salary payslips with 1-click printable view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Assigned task checklist, OKRs & company holiday calendar</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('EMPLOYEE')}
                  className="w-full py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Launch Employee Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security Callout */}
      <section id="security" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] font-heading">
            Enterprise Security & Zero-Trust Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto font-normal leading-relaxed">
            Engineered with strict tenant data isolation, TLS 1.3 cryptographic protection, and backend role verification on all queries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-normal text-[var(--text-secondary)] pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-Tenant Scoping</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Immutable Audit Trails</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> RBAC Permission Enforcement</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--surface)] py-8 text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[var(--accent)] text-white font-bold flex items-center justify-center text-[9px]">
              A
            </div>
            <span className="font-medium text-[var(--text-primary)]">Apex Global EMS Platform</span>
            <span>· All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[var(--text-primary)]">Sign In</Link>
            <Link to="/forgot-password" className="hover:text-[var(--text-primary)]">Reset Password</Link>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">v2.4.0 Production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
