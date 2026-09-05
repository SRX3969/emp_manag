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
} from 'lucide-react';
import { Role } from '@/types/auth';

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
    }, 350);
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] dark:bg-[#101113] dark:text-[#F5F5F5] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand & Organization Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md ring-4 ring-blue-500/10">
            A
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
            {currentOrg.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Human Resources & Workforce Operations Platform
          </p>
        </div>

        {/* Dual-Portal Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-200/80 dark:bg-[#1A1C20] border border-slate-200 dark:border-[#292B30] text-xs font-semibold">
          <button
            type="button"
            onClick={() => handlePortalSwitch('EMPLOYER')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all cursor-pointer ${
              portalMode === 'EMPLOYER'
                ? 'bg-white dark:bg-[#25282E] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Employer / HR Portal</span>
          </button>
          <button
            type="button"
            onClick={() => handlePortalSwitch('EMPLOYEE')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all cursor-pointer ${
              portalMode === 'EMPLOYEE'
                ? 'bg-white dark:bg-[#25282E] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Employee Portal</span>
          </button>
        </div>

        {/* Login Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {portalMode === 'EMPLOYER' ? 'Management Authentication' : 'Employee Self-Service Sign In'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {portalMode === 'EMPLOYER'
                  ? 'Access executive dashboard, approvals, payroll & records'
                  : 'Access your shift clock-in, leave requests, payslips & tasks'}
              </p>
            </div>
            <Badge variant={portalMode === 'EMPLOYER' ? 'info' : 'success'} size="sm">
              {portalMode === 'EMPLOYER' ? 'Executive & HR' : 'Self-Service'}
            </Badge>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label={portalMode === 'EMPLOYER' ? 'Corporate Email' : 'Employee Work Email'}
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
                  <span>Remember this device</span>
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
          <div className="pt-4 border-t border-slate-100 dark:border-[#202227] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                1-Click Fast Access ({portalMode === 'EMPLOYER' ? 'Employer Personas' : 'Employee Personas'})
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>

            <div className="space-y-1.5">
              {(portalMode === 'EMPLOYER' ? employerPersonas : employeePersonas).map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleQuickPersonaLogin(p.email, p.role)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-slate-50/80 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-[#131417] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
                      {p.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          ({p.title})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
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

        {/* Security Badge Footer */}
        <div className="text-center space-y-1 text-[11px] text-slate-400">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Role-Based Access Control & Strict Data Isolation Enforced
          </p>
          <p>Protected by Enterprise TLS 1.3 encryption and Convex backend authorization.</p>
        </div>
      </div>
    </div>
  );
}
