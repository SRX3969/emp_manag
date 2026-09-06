import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  UserCheck,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Clock,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';
import { Role } from '@/types/auth';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function LoginPage() {
  const { login, currentOrg } = useAuth();
  const navigate = useNavigate();

  const [portalMode, setPortalMode] = useState<'EMPLOYER' | 'EMPLOYEE'>('EMPLOYER');
  const [email, setEmail] = useState('rahul.sharma@apexglobal.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const employerPersonas: { role: Role; title: string; name: string; email: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@apexglobal.com',
      desc: 'Full workforce governance, payroll disbursement, audit & settings',
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    },
    {
      role: 'HR_ADMIN',
      title: 'HR Director',
      name: 'Ananya Rao',
      email: 'ananya.rao@apexglobal.com',
      desc: 'Employee lifecycle, recruitment ATS, policy & attendance management',
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
    },
    {
      role: 'MANAGER',
      title: 'Engineering Manager',
      name: 'Arjun Kumar',
      email: 'arjun.kumar@apexglobal.com',
      desc: 'Team approvals, performance evaluations & sprint task assignments',
      icon: <Users className="w-4 h-4 text-purple-500" />,
    },
  ];

  const employeePersonas: { role: Role; title: string; name: string; email: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'EMPLOYEE',
      title: 'Staff Software Engineer',
      name: 'Priya Patel',
      email: 'priya.patel@apexglobal.com',
      desc: 'Personal attendance clock-in, leave balances, payslips & tasks',
      icon: <UserCheck className="w-4 h-4 text-blue-500" />,
    },
    {
      role: 'EMPLOYEE',
      title: 'Lead Product Designer',
      name: 'Elena Rostova',
      email: 'elena.rostova@apexglobal.com',
      desc: 'Self-service shift tracker, document portal & goals progress',
      icon: <Sparkles className="w-4 h-4 text-pink-500" />,
    },
  ];

  const handlePortalSwitch = (mode: 'EMPLOYER' | 'EMPLOYEE') => {
    setPortalMode(mode);
    setErrorMessage('');
    if (mode === 'EMPLOYER') {
      setEmail('rahul.sharma@apexglobal.com');
    } else {
      setEmail('priya.patel@apexglobal.com');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      login(email, password, portalMode === 'EMPLOYEE' ? 'EMPLOYEE' : undefined);
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  const handleQuickPersonaLogin = (personaEmail: string, personaRole: Role) => {
    setEmail(personaEmail);
    setIsLoading(true);
    setTimeout(() => {
      login(personaEmail, 'password123', personaRole);
      setIsLoading(false);
      navigate('/dashboard');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#101113] text-[#171717] dark:text-[#F5F5F5] flex selection:bg-blue-500 selection:text-white">
      {/* Left Pane: Product Showcase & Brand Value (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E1013] text-white p-12 flex-col justify-between relative border-r border-[#22252A] overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/landing" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-blue-500/10 group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight">
                  {currentOrg.name}
                </span>
                <span className="text-xs text-blue-400 font-mono ml-2 font-semibold">
                  EMS Enterprise
                </span>
              </div>
            </Link>

            <Link
              to="/landing"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>

          <div className="pt-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Enterprise People Operations Platform</span>
            </div>

            <h1 className="text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              People operations, <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                simplified & unified.
              </span>
            </h1>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Complete workforce visibility with sub-second attendance tracking, intelligent leave approvals, multi-tier compensation runs, and zero-latency database synchronization.
            </p>
          </div>
        </div>

        {/* Value Proposition Feature Checklist */}
        <div className="relative z-10 space-y-3.5 py-8">
          <div className="flex items-start gap-3 text-xs text-slate-300">
            <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Precision Shift Attendance</span>
              <p className="text-slate-400 text-[11px]">Real-time digital clock terminal with work mode tagging & punctuality metrics.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-300">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Automated Leave Balances</span>
              <p className="text-slate-400 text-[11px]">Instant balance auto-deductions upon manager approval with overlap guard.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-300">
            <div className="p-1 rounded bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Multi-Tier Payroll & Printable Payslips</span>
              <p className="text-slate-400 text-[11px]">Itemized gross-to-net calculations with role-based private access.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-300">
            <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Role-Based Access & Audit Logging</span>
              <p className="text-slate-400 text-[11px]">Granular RBAC guards across Super Admin, HR, Manager, and Employee roles.</p>
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="relative z-10 pt-4 border-t border-[#22252A] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>TLS 1.3 Encryption · SOC-2 Ready</span>
          </div>
          <span className="font-mono">v2.4.0 Production</span>
        </div>
      </div>

      {/* Right Pane: Authentication Form & 1-Click Fast Personas */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
        <PageTransition variant="scale" className="w-full max-w-md space-y-6">
          {/* Mobile Brand Link (Visible only on mobile/tablet) */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#292B30]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                A
              </div>
              <span className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                {currentOrg.name}
              </span>
            </div>
            <Link to="/landing" className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Landing Page →
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Sign In to Your Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your role portal to access management tools or personal self-service.
            </p>
          </div>

          {/* Dual Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-200/80 dark:bg-[#1A1C20] border border-slate-200 dark:border-[#292B30] text-xs font-semibold">
            <button
              type="button"
              onClick={() => handlePortalSwitch('EMPLOYER')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
                portalMode === 'EMPLOYER'
                  ? 'bg-white dark:bg-[#25282E] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Employer / HR</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('EMPLOYEE')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
                portalMode === 'EMPLOYEE'
                  ? 'bg-white dark:bg-[#25282E] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Employee Portal</span>
            </button>
          </div>

          {/* Main Auth Form */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {portalMode === 'EMPLOYER' ? 'Management Authentication' : 'Employee Self-Service'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {portalMode === 'EMPLOYER' ? 'Executive & workforce tools' : 'Personal shifts, leaves & payslips'}
                </p>
              </div>
              <Badge variant={portalMode === 'EMPLOYER' ? 'info' : 'success'} size="sm">
                {portalMode === 'EMPLOYER' ? 'Management' : 'Staff'}
              </Badge>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <Input
                label={portalMode === 'EMPLOYER' ? 'Work Corporate Email' : 'Employee Email'}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@apexglobal.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <label className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Remember session</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:underline dark:text-blue-400 text-[11px]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-sm font-semibold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to {portalMode === 'EMPLOYER' ? 'Management Suite' : 'Employee Workspace'}
              </Button>
            </form>

            {/* 1-Click Fast Sign-In Personas */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#202227] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                  1-Click Fast Sign-In ({portalMode === 'EMPLOYER' ? 'Employer' : 'Employee'})
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>

              <div className="space-y-1.5">
                {(portalMode === 'EMPLOYER' ? employerPersonas : employeePersonas).map((p) => (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => handleQuickPersonaLogin(p.email, p.role)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-slate-50/80 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-100 dark:bg-[#131417] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({p.title})
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Protected by Enterprise Role-Based Access Control and convex data persistence.
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
