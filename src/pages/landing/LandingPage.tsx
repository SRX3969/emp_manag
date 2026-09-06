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
  Check,
  Zap,
  Globe,
  Award,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PageTransition } from '@/components/motion/Motion';

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
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans transition-colors duration-200 selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-[#0E1015]/85 border-b border-slate-200 dark:border-[#242838] transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-heading font-bold flex items-center justify-center text-sm shadow-sm glow-accent">
              A
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                Apex Global
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50">
                EMS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Core Capabilities
            </a>
            <a href="#preview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Platform Architecture
            </a>
            <a href="#portals" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Dual Portals
            </a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Security & Trust
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-[#242838] dark:hover:bg-[#1A1C26] text-slate-600 dark:text-slate-400 transition-all cursor-pointer shadow-2xs"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Enter App
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/15 to-transparent dark:from-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <PageTransition variant="fade">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Enterprise Workforce OS · v2.4.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-[1.12] max-w-4xl mx-auto">
              Manage your workforce <br className="hidden sm:block" />
              <span className="gradient-text-indigo font-extrabold">with clarity and precision.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              A unified operating platform for complete employee lifecycles, geofenced shift attendance, intelligent leave balance deductions, and automated multi-tier payroll runs.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 h-11 text-sm font-semibold shadow-md glow-accent"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Management Portal
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="px-5 h-11 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-[#242838] dark:bg-[#12131A] dark:hover:bg-[#1A1C26] text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Test Employee Self-Service</span>
              </button>
            </div>

            {/* Micro Metrics Strip */}
            <div className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-2xs hover-lift">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-mono uppercase font-semibold">Data Integrity</span>
                  <DatabaseIcon className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-heading">100%</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Real Data Operations</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-2xs hover-lift">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-mono uppercase font-semibold">Architecture</span>
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Dual</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Employer & Staff Portals</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-2xs hover-lift">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-mono uppercase font-semibold">Dossier</span>
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-heading">360°</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">6-Tab Lifecycle Views</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-2xs hover-lift">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-mono uppercase font-semibold">Navigation</span>
                  <Search className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-heading">⌘K</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Command Palette</p>
              </div>
            </div>
          </PageTransition>
        </div>
      </section>

      {/* Interactive Platform Preview Showcase */}
      <section id="preview" className="py-16 border-y border-slate-200 dark:border-[#242838] bg-slate-50/70 dark:bg-[#12131A]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Platform Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
              High-performance modules engineered for operational clarity and live data execution.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="w-full max-w-full overflow-x-auto no-scrollbar flex justify-start sm:justify-center px-1 py-1">
            <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#161822] border border-slate-200 dark:border-[#242838] text-xs font-semibold shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Command Center
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'attendance'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Shift Terminal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'employee'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                360° Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payroll')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'payroll'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Payroll & Payslips
              </button>
            </div>
          </div>

          {/* Tab Preview Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] p-6 shadow-md overflow-hidden">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#242838] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                      Workforce Analytics & Headcount Velocity
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live operational aggregate computed across all personnel</p>
                  </div>
                  <Badge variant="info" size="sm" dot>Realtime Synced</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838]">
                    <p className="text-[11px] text-slate-500 font-medium font-mono">Total Headcount</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-heading">12 Active</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">100% Retention</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838]">
                    <p className="text-[11px] text-slate-500 font-medium font-mono">Daily Attendance</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">92% Rate</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">11 Present / 1 Remote</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838]">
                    <p className="text-[11px] text-slate-500 font-medium font-mono">Pending Approvals</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-heading">2 Requests</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Avg turnaround 1.2 hrs</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838]">
                    <p className="text-[11px] text-slate-500 font-medium font-mono">Monthly Payroll</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-heading">₹1,39,85,500</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">100% On-time Disbursed</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#242838] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                      Precision Shift Terminal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sub-second timestamp recording with work mode tagging</p>
                  </div>
                  <Badge variant="success" size="sm" dot>Active Terminal</Badge>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838] text-center space-y-2">
                  <div className="inline-block px-5 py-2.5 rounded-xl bg-white dark:bg-[#12131A] border border-slate-200 dark:border-[#242838] shadow-xs">
                    <span className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      09:41:22 AM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live Server Synced Time (IST) · Geofence Verified</p>
                </div>
              </div>
            )}

            {activeTab === 'employee' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#242838] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                      Unified 360° Employee Dossier
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Overview, Attendance, Leave, Payroll, Documents & Audit Log</p>
                  </div>
                  <Badge variant="neutral" size="sm">EMP-001 · Rahul Sharma</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['1. Overview', '2. Attendance History', '3. Leave Balances', '4. Salary & Payslips', '5. Documents Vault', '6. Audit Trail'].map((t, idx) => (
                    <div
                      key={t}
                      className={`px-3 py-1.5 rounded-lg border font-medium ${
                        idx === 0
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 font-bold'
                          : 'border-slate-200 bg-slate-50 dark:border-[#242838] dark:bg-[#1A1C26] text-slate-600 dark:text-slate-400'
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
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#242838] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                      Multi-Tier Compensation & Itemized Payslips
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Automated gross-to-net salary calculations with statutory deductions</p>
                  </div>
                  <Badge variant="success" size="sm">Ready to Print</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-[#242838] dark:bg-[#1A1C26]">
                    <p className="font-bold text-slate-900 dark:text-white mb-2">Earnings Breakdown</p>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between"><span>Base Salary</span><span className="font-semibold text-slate-900 dark:text-slate-100">₹1,00,000.00</span></div>
                      <div className="flex justify-between"><span>Housing Allowance (HRA)</span><span className="font-semibold text-slate-900 dark:text-slate-100">₹50,000.00</span></div>
                      <div className="flex justify-between"><span>Special Allowance</span><span className="font-semibold text-slate-900 dark:text-slate-100">₹70,333.00</span></div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-[#242838] dark:bg-[#1A1C26]">
                    <p className="font-bold text-slate-900 dark:text-white mb-2">Statutory Deductions & Net</p>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between"><span>Income Tax (TDS / Sec 192)</span><span className="text-rose-600 font-semibold">-₹26,500.00</span></div>
                      <div className="flex justify-between"><span>Employee Provident Fund (EPF)</span><span className="text-rose-600 font-semibold">-₹12,000.00</span></div>
                      <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-[#242838] font-bold text-slate-900 dark:text-white">
                        <span>Net Take Home</span><span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹1,94,633.00</span>
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Engineered for Enterprise Operational Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Strict role authorization, genuine database calculations, and zero visual clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {/* Feature 1 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Complete Employee 360°
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-spectrum directory with multi-tier department hierarchy, designation routing, emergency contacts, and document storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Precision Shift Attendance
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Live digital clock shift recording, On-site / Remote / Hybrid tag selection, automatic punctuality scoring, and timesheets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Intelligent Leave Balances
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Annual, Sick, Casual, Parental, and Unpaid leave balances with dynamic deduction upon approval and calendar overlap prevention.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Automated Payroll Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                One-click payroll run generation, statutory deductions, bank routing mask, and printable itemized PDF-styled payslips.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Global Command Palette (⌘K)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant keyboard shortcut navigation across all employees, departments, quick clock-in actions, and report shortcuts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5.5 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-black/30 transition-all space-y-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Immutable Audit Logs & RBAC
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Role-based access control with granular permissions for Super Admin, HR Director, Department Manager, and Employee roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Showcase Section */}
      <section id="portals" className="py-16 border-t border-slate-200 dark:border-[#242838] bg-slate-50/70 dark:bg-[#12131A]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Tailored Dual Portals for Every Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Executives manage operations while employees enjoy a dedicated self-service workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employer Card */}
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] space-y-4 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Employer / HR Command Suite</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Super Admins, HR Directors & Managers</p>
                  </div>
                </div>
                <Badge variant="info">Management</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Workforce analytics, headcount growth & retention metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>One-click leave approval queue with instant balance deductions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Payroll run processing, disbursement authorization & tax summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Full organization audit log and administrative security settings</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('SUPER_ADMIN')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <span>Launch Management Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Employee Card */}
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white dark:border-[#242838] dark:bg-[#12131A] space-y-4 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Employee Self-Service Portal</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Staff Engineers, Designers & Operators</p>
                  </div>
                </div>
                <Badge variant="success">Self-Service</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
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
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 dark:border-[#242838] dark:bg-[#161822] dark:hover:bg-[#1E202E] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs glow-accent">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
            Enterprise Security & Zero-Trust Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
            Engineered with strict tenant data isolation, TLS 1.3 cryptographic protection, and backend role verification on all queries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-Tenant Scoping</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Immutable Audit Trails</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> RBAC Permission Enforcement</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#242838] bg-white dark:bg-[#0E1015] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-[9px]">
              A
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Apex Global EMS Platform</span>
            <span>· All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</Link>
            <Link to="/forgot-password" className="hover:text-indigo-600 dark:hover:text-indigo-400">Reset Password</Link>
            <span className="font-mono text-[11px] text-slate-400">v2.4.0 Production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
