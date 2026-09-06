import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import { ShieldCheck, Check, UserCircle2, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function RoleSwitcherBar() {
  const { role, switchRole, currentUser, logout, portalType } = useAuth();
  const navigate = useNavigate();

  const roles: { role: Role; title: string; desc: string; portal: 'EMPLOYER' | 'EMPLOYEE' }[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin',
      desc: 'Executive workforce governance, payroll disbursement & settings',
      portal: 'EMPLOYER',
    },
    {
      role: 'HR_ADMIN',
      title: 'HR Director',
      desc: 'Employee lifecycle, recruitment ATS, policies & attendance',
      portal: 'EMPLOYER',
    },
    {
      role: 'MANAGER',
      title: 'Manager',
      desc: 'Team overview, leave approvals & goal assignments',
      portal: 'EMPLOYER',
    },
    {
      role: 'EMPLOYEE',
      title: 'Employee',
      desc: 'Personal clock-in/out, leave balance, payslips & tasks',
      portal: 'EMPLOYEE',
    },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-[#0B0C10] text-slate-200 border-b border-[#242838] text-xs px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2.5 select-none z-30 relative shadow-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10.5px] font-bold border border-indigo-500/30 glow-accent">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>PORTAL DEMO MODE</span>
        </div>
        <span className="font-semibold text-white flex items-center gap-1.5 text-xs truncate">
          <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
          {currentUser.name}
          <span className="text-slate-400 text-[11px] font-mono hidden xs:inline">
            ({portalType === 'EMPLOYER' ? `${role.replace('_', ' ')} · Employer View` : 'Employee Self-Service'})
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-slate-400 text-[11px] font-medium hidden md:inline">Test As:</span>
        <div className="flex items-center gap-1">
          {roles.map((r) => {
            const isActive = role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold ring-1 ring-indigo-400'
                    : 'bg-[#161822] text-slate-300 hover:bg-[#1E202E] hover:text-white border border-[#242838]'
                )}
              >
                {isActive && <Check className="w-3 h-3 text-white shrink-0" />}
                <span>{r.title}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-rose-900/40 transition-colors cursor-pointer"
          title="Sign Out to Login Portal"
        >
          <LogOut className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
