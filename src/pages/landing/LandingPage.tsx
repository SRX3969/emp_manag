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
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] dark:bg-[#101113] dark:text-[#F5F5F5] font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#101113]/80 border-b border-slate-200 dark:border-[#292B30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
              A
            </div>
            <div>
              <span className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                Apex Global
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono ml-1.5 font-semibold">
                EMS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Platform Features
            </a>
            <a href="#preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Live Showcase
            </a>
            <a href="#portals" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Dual Portals
            </a>
            <a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Enterprise Security
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#292B30] hover:bg-slate-100 dark:hover:bg-[#1D1F23] text-slate-600 dark:text-slate-400 transition-all cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Go to Dashboard
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
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
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <PageTransition variant="fade">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Next-Generation Enterprise People Operations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Manage your workforce <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                with clarity and precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              A unified operating platform for complete employee lifecycles, precision shift attendance, intelligent leave balance tracking, payroll runs, and real-time organizational analytics.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 h-11 text-sm font-semibold shadow-md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Management Portal
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="px-5 h-11 rounded-lg border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-blue-500" />
                <span>Test Employee Self-Service</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#292B30] bg-white/70 dark:bg-[#17181B]/70 backdrop-blur-xs">
                <p className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real Data Calculations</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#292B30] bg-white/70 dark:bg-[#17181B]/70 backdrop-blur-xs">
                <p className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Dual</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Employer & Staff Portals</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#292B30] bg-white/70 dark:bg-[#17181B]/70 backdrop-blur-xs">
                <p className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">6-Tab</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">360° Employee Dossiers</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#292B30] bg-white/70 dark:bg-[#17181B]/70 backdrop-blur-xs">
                <p className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Ctrl+K</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Command Search Palette</p>
              </div>
            </div>
          </PageTransition>
        </div>
      </section>

      {/* Interactive Platform Preview Showcase */}
      <section id="preview" className="py-12 border-y border-slate-200 dark:border-[#292B30] bg-slate-100/50 dark:bg-[#141518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Interactive Platform Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore high-performance modules engineered for operational clarity and zero-latency execution.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-[#1F2228] border border-slate-200 dark:border-[#2B2F38] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-[#2A2E37] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Executive Command Center
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-white dark:bg-[#2A2E37] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Shift Terminal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'employee'
                    ? 'bg-white dark:bg-[#2A2E37] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                360° Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payroll')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'payroll'
                    ? 'bg-white dark:bg-[#2A2E37] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Payroll & Payslips
              </button>
            </div>
          </div>

          {/* Tab Preview Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] p-6 shadow-sm overflow-hidden">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Workforce Analytics & Headcount Velocity
                    </h3>
                    <p className="text-xs text-slate-500">Live operational aggregate computed across all staff</p>
                  </div>
                  <Badge variant="info" size="sm">Real Database Reactive</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131417] border border-slate-100 dark:border-[#202227]">
                    <p className="text-[11px] text-slate-400 font-medium">Total Headcount</p>
                    <p className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100 mt-1">12 Active</p>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">↑ 100% Retained</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131417] border border-slate-100 dark:border-[#202227]">
                    <p className="text-[11px] text-slate-400 font-medium">Daily Attendance</p>
                    <p className="text-xl font-bold font-heading text-emerald-600 dark:text-emerald-400 mt-1">92% Rate</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">11 Present / 1 WFH</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131417] border border-slate-100 dark:border-[#202227]">
                    <p className="text-[11px] text-slate-400 font-medium">Pending Approvals</p>
                    <p className="text-xl font-bold font-heading text-amber-600 dark:text-amber-400 mt-1">2 Requests</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Avg turnaround 1.2 hrs</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131417] border border-slate-100 dark:border-[#202227]">
                    <p className="text-[11px] text-slate-400 font-medium">Monthly Payroll</p>
                    <p className="text-xl font-bold font-heading text-purple-600 dark:text-purple-400 mt-1">$108,500</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">100% Disbursed on time</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Live Precision Shift Terminal
                    </h3>
                    <p className="text-xs text-slate-500">Sub-second timestamp recording with work mode tagging</p>
                  </div>
                  <Badge variant="success" size="sm">Active Shift Terminal</Badge>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#131417] border border-slate-100 dark:border-[#202227] text-center space-y-3">
                  <div className="inline-block px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                    <span className="font-mono text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                      09:41:22 AM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Live Server Synced Time · Geofence Verified</p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">On-site</span>
                    <span className="px-3 py-1 rounded bg-slate-200 dark:bg-[#25282E] text-slate-600 dark:text-slate-400 text-xs">Remote</span>
                    <span className="px-3 py-1 rounded bg-slate-200 dark:bg-[#25282E] text-slate-600 dark:text-slate-400 text-xs">Hybrid</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employee' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Unified 360° Employee Dossier
                    </h3>
                    <p className="text-xs text-slate-500">Overview, Attendance, Leave, Payroll, Documents & Audit Log</p>
                  </div>
                  <Badge variant="neutral" size="sm">EMP-001 · Rahul Sharma</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['1. Overview', '2. Attendance History', '3. Leave Balances', '4. Salary & Payslips', '5. Documents Vault', '6. Audit Trail'].map((t, idx) => (
                    <div
                      key={t}
                      className={`px-3 py-2 rounded-lg border ${
                        idx === 0
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'border-slate-200 dark:border-[#292B30] text-slate-600 dark:text-slate-400'
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
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Multi-Tier Compensation & Itemized Payslips
                    </h3>
                    <p className="text-xs text-slate-500">Automated gross-to-net salary calculations with print formatting</p>
                  </div>
                  <Badge variant="success" size="sm">Ready to Print</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-[#202227] bg-slate-50/60 dark:bg-[#131417]">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Earnings Breakdown</p>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between"><span>Base Salary</span><span className="font-medium">$12,500.00</span></div>
                      <div className="flex justify-between"><span>Housing Allowance (HRA)</span><span className="font-medium">$2,500.00</span></div>
                      <div className="flex justify-between"><span>Special Allowance</span><span className="font-medium">$1,000.00</span></div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-[#202227] bg-slate-50/60 dark:bg-[#131417]">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Statutory Deductions & Net</p>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between"><span>Income Tax (TDS)</span><span className="text-red-500 font-medium">-$1,800.00</span></div>
                      <div className="flex justify-between"><span>Provident Fund / 401(k)</span><span className="text-red-500 font-medium">-$750.00</span></div>
                      <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-[#292B30] font-bold text-slate-900 dark:text-slate-100">
                        <span>Net Take Home</span><span className="text-emerald-600 dark:text-emerald-400 font-extrabold">$13,450.00</span>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Engineered for Enterprise Operational Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every feature is built with strict role authorization, live calculations, and clean UI design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Complete Employee 360°
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full-spectrum directory with multi-tier department hierarchy, designation routing, emergency contacts, compensation history, and document storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Precision Shift Attendance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live digital clock shift recording, On-site / Remote / Hybrid tag selection, automatic punctuality scoring, and attendance correction workflows.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Intelligent Leave Balances
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Annual, Sick, Casual, Parental, and Unpaid leave balances with dynamic deduction upon approval and calendar overlap prevention.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Automated Payroll Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One-click payroll run generation, statutory deductions, bank routing mask, and printable itemized PDF-styled payslips.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Global Command Palette (Ctrl+K)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instant keyboard shortcut navigation across all employees, departments, quick clock-in actions, and report generation shortcuts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#17181B] hover:border-blue-500 dark:hover:border-blue-500 transition-all space-y-3 shadow-xs group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Immutable Audit Logs & RBAC
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Role-based access control with granular permissions for Super Admin, HR Director, Department Manager, and Employee roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Showcase Section */}
      <section id="portals" className="py-16 border-t border-slate-200 dark:border-[#292B30] bg-slate-50 dark:bg-[#121316]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Tailored Dual Portals for Every Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Executives manage operations while employees enjoy a dedicated self-service workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employer Card */}
            <div className="p-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-white dark:bg-[#17181B] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Employer / HR Command Suite</h3>
                    <p className="text-xs text-slate-500">For Super Admins, HR Directors & Managers</p>
                  </div>
                </div>
                <Badge variant="info">Management</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Workforce analytics, headcount growth & retention metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>One-click leave approval queue with instant balance deductions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Payroll run processing, disbursement authorization & tax summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Full organization audit log and administrative security settings</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('SUPER_ADMIN')}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Launch Management Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Employee Card */}
            <div className="p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-white dark:bg-[#17181B] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Employee Self-Service Portal</h3>
                    <p className="text-xs text-slate-500">For Staff Engineers, Designers & Operators</p>
                  </div>
                </div>
                <Badge variant="success">Self-Service</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Live shift clock-in/out with On-site, Remote & Hybrid tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time leave balance tracking & instant request submission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Itemized salary payslips with 1-click printable view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Assigned task checklist, OKRs & company holiday calendar</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('EMPLOYEE')}
                  className="w-full py-2.5 rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Enterprise Security & Zero-Trust Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
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
      <footer className="border-t border-slate-200 dark:border-[#292B30] bg-white dark:bg-[#101113] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              A
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Apex Global EMS Platform</span>
            <span>· All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Sign In</Link>
            <Link to="/forgot-password" className="hover:text-blue-600 dark:hover:text-blue-400">Reset Password</Link>
            <span className="font-mono text-[11px]">v2.4.0 Production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
