import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import { ShieldCheck, UserCheck, Check, UserCircle2, LogOut, Building2 } from 'lucide-react';
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
      title: 'HR Admin',
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
      title: 'Employee Portal',
      desc: 'Personal clock-in/out, leave balance, payslips & tasks',
      portal: 'EMPLOYEE',
    },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-slate-900 text-slate-100 dark:bg-black/90 border-b border-slate-800 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-mono text-[11px] font-semibold border border-blue-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>PORTAL SIMULATOR</span>
        </div>
        <span className="font-semibold text-white flex items-center gap-1.5">
          <UserCircle2 className="w-3.5 h-3.5 text-slate-300" />
          {currentUser.name}
          <span className="text-slate-400 text-[11px] font-mono">
            ({portalType === 'EMPLOYER' ? `${role} · Employer Portal` : 'Employee Self-Service'})
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-slate-400 text-[11px] hidden md:inline">Switch Persona:</span>
        <div className="flex items-center gap-1">
          {roles.map((r) => {
            const isActive = role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold ring-1 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                )}
              >
                {isActive && <Check className="w-3 h-3 text-white" />}
                <span>{r.title}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-900/40 transition-colors cursor-pointer"
          title="Sign Out to Login Portal"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
