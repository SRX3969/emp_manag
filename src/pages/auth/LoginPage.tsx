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
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const success = login(email.trim(), password);
      setIsLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password.');
      }
    }, 300);
  };

  const handleQuickPersonaLogin = (personaEmail: string, personaRole: Role) => {
    setEmail(personaEmail);
    setPassword('password123');
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      const success = login(personaEmail, 'password123', personaRole);
      setIsLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password.');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex selection:bg-[var(--accent)] selection:text-white">
      {/* Left Pane: Quiet Editorial Showcase & Values (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E1013] text-white p-12 lg:p-14 flex-col justify-between relative border-r border-[#22252A] overflow-hidden">
        {/* Brand Header */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/landing" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm flex items-center justify-center shadow-xs">
                A
              </div>
              <div>
                <span className="font-heading font-semibold text-sm text-white tracking-tight">
                  {currentOrg.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono ml-2 font-normal">
                  v2.4.0
                </span>
              </div>
            </Link>

            <Link
              to="/landing"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>

          <div className="pt-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Enterprise Workforce Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-heading leading-snug">
              Your people. <br />
              <span className="text-zinc-400 font-normal">One clear view.</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed font-normal">
              Manage employees, precision attendance, intelligent leave balance approvals, and multi-tier payroll from one calm workspace.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 space-y-3.5 py-8">
          <div className="flex items-start gap-3 text-xs text-zinc-300">
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 mt-0.5 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-medium text-white">Precision Shift Attendance</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">Real-time digital clock terminal with work mode tagging & punctuality records.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-zinc-300">
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 mt-0.5 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-medium text-white">Automated Leave Balances</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">Instant balance auto-deductions upon manager approval with overlap protection.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-zinc-300">
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 mt-0.5 shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-medium text-white">Multi-Tier Payroll & Printable Payslips</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">Itemized gross-to-net calculations with role-based private access.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-zinc-300">
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 mt-0.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-medium text-white">Role-Based Access & Audit Logging</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">Granular RBAC guards across Super Admin, HR, Manager, and Employee roles.</p>
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="relative z-10 pt-4 border-t border-[#22252A] flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>TLS 1.3 Encryption · SOC-2 Ready</span>
          </div>
          <span className="font-mono">Live Database Connected</span>
        </div>
      </div>

      {/* Right Pane: Minimal Authentication Form & 1-Click Personas */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
        <PageTransition variant="scale" className="w-full max-w-md space-y-6">
          {/* Mobile Brand Link (Visible only on mobile/tablet) */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white font-semibold flex items-center justify-center text-sm">
                A
              </div>
              <span className="font-heading font-semibold text-base text-[var(--text-primary)]">
                {currentOrg.name}
              </span>
            </div>
            <Link to="/landing" className="text-xs text-[var(--accent)] font-medium">
              Overview →
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] font-heading">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Select your portal below to access management tools or personal self-service.
            </p>
          </div>

          {/* Dual Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] text-xs font-medium">
            <button
              type="button"
              onClick={() => handlePortalSwitch('EMPLOYER')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md transition-all cursor-pointer ${
                portalMode === 'EMPLOYER'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Employer / HR</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('EMPLOYEE')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md transition-all cursor-pointer ${
                portalMode === 'EMPLOYEE'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Employee Portal</span>
            </button>
          </div>

          {/* Main Auth Form */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {portalMode === 'EMPLOYER' ? 'Management Authentication' : 'Employee Self-Service'}
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
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
                    className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <label className="flex items-center gap-1.5 text-[var(--text-secondary)] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[var(--accent)]" />
                    <span>Remember session</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[var(--accent)] hover:underline text-[11px]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-sm font-medium"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to {portalMode === 'EMPLOYER' ? 'Management Suite' : 'Employee Workspace'}
              </Button>
            </form>

            {/* 1-Click Fast Sign-In Personas */}
            <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold font-mono">
                  1-Click Fast Sign-In ({portalMode === 'EMPLOYER' ? 'Employer' : 'Employee'})
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
              </div>

              <div className="space-y-1.5">
                {(portalMode === 'EMPLOYER' ? employerPersonas : employeePersonas).map((p) => (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => handleQuickPersonaLogin(p.email, p.role)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-[var(--surface-elevated)] group-hover:bg-[var(--surface)] transition-colors">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            ({p.title})
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] truncate max-w-[260px]">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[var(--text-muted)]">
            Protected by Enterprise Role-Based Access Control and convex data persistence.
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
