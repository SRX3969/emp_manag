import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCircle } from 'lucide-react';
import { Role } from '@/types/auth';

export function LoginPage() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rahul.sharma@apexglobal.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickPersona = (role: Role) => {
    switchRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] dark:bg-[#101113] dark:text-[#F5F5F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            A
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
            Apex Global Technologies
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Workforce & HR Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Corporate Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@apexglobal.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>
          </form>

          {/* Quick Role Personas Selection */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#202227] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                1-Click Role Login Demo
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickPersona('SUPER_ADMIN')}
                className="p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-slate-50 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all"
              >
                <strong className="block text-slate-900 dark:text-slate-100">Super Admin</strong>
                <span className="text-[10px] text-slate-400">Rahul Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('HR_ADMIN')}
                className="p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-slate-50 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all"
              >
                <strong className="block text-slate-900 dark:text-slate-100">HR Admin</strong>
                <span className="text-[10px] text-slate-400">Ananya Rao</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('MANAGER')}
                className="p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-slate-50 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all"
              >
                <strong className="block text-slate-900 dark:text-slate-100">Manager</strong>
                <span className="text-[10px] text-slate-400">Arjun Kumar</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('EMPLOYEE')}
                className="p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-slate-50 dark:border-[#292B30] dark:hover:bg-[#1D1F23] text-left transition-all"
              >
                <strong className="block text-slate-900 dark:text-slate-100">Employee</strong>
                <span className="text-[10px] text-slate-400">Priya Patel</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          Protected by Enterprise SSO & TLS 1.3 Encryption.
        </p>
      </div>
    </div>
  );
}
