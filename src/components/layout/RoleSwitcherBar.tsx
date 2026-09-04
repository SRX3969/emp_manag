import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import { ShieldCheck, UserCheck, ChevronDown, Check, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RoleSwitcherBar() {
  const { role, switchRole, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: Role; title: string; persona: string; desc: string }[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin',
      persona: 'Rahul Sharma (CEO)',
      desc: 'Full unrestricted system access, payroll disbursement, audit logs & org settings.',
    },
    {
      role: 'HR_ADMIN',
      title: 'HR Admin',
      persona: 'Ananya Rao (VP of HR)',
      desc: 'Manage employees, leave approvals, recruitment pipeline, policies & attendance.',
    },
    {
      role: 'MANAGER',
      title: 'Manager',
      persona: 'Arjun Kumar (VP of Eng)',
      desc: 'Team overview, direct report approvals, performance reviews & goal assignments.',
    },
    {
      role: 'EMPLOYEE',
      title: 'Employee',
      persona: 'Priya Patel (Sr Engineer)',
      desc: 'Self-service clock in/out, leave applications, personal payslips & task board.',
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 dark:bg-black/90 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-mono text-[11px] font-semibold border border-blue-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>RBAC SIMULATOR</span>
        </div>
        <span className="text-slate-400 hidden sm:inline">Active persona:</span>
        <span className="font-semibold text-white flex items-center gap-1.5">
          <UserCircle2 className="w-3.5 h-3.5 text-slate-300" />
          {currentUser.name}
          <span className="text-slate-400 text-[11px]">({role})</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="text-slate-400 text-[11px] hidden md:inline">Switch Role:</span>
        {roles.map((r) => {
          const isActive = role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              title={r.desc}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 shrink-0',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold ring-1 ring-blue-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              )}
            >
              {isActive && <Check className="w-3 h-3 text-white" />}
              <span>{r.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
