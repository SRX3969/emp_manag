import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Building2, UserCheck, DollarSign, Users, Mail, Phone } from 'lucide-react';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { departments, employees } = useData();

  const department = departments.find((d) => d.id === id);

  if (!department) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Department record not found.</p>
        <Link to="/departments" className="mt-4 inline-block">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Departments
          </Button>
        </Link>
      </div>
    );
  }

  const deptMembers = employees.filter((e) => e.departmentId === department.id);
  const manager = employees.find((e) => e.id === department.managerId);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title={department.name}
        description={`Code: ${department.code} · ${deptMembers.length} Team Members · Annual Budget: ${formatCurrency(department.annualBudget)}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Departments', href: '/departments' },
          { label: department.name },
        ]}
        actions={
          <Link to="/departments">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              All Departments
            </Button>
          </Link>
        }
      />

      {/* Top Details Card */}
      <RevealCard delayMs={30} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Department Mandate & Overview
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {department.description}
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#1D1F23] text-xs space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Department Leadership</h4>
            {manager ? (
              <div className="flex items-center gap-3">
                <Avatar src={manager.avatarUrl} name={manager.fullName} size="sm" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{manager.fullName}</p>
                  <p className="text-slate-500 text-[11px]">{manager.designation}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No designated department manager.</p>
            )}
          </div>
        </div>
      </RevealCard>

      {/* Members Roster */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#292B30] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Assigned Personnel ({deptMembers.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#202227]">
          {deptMembers.map((emp) => (
            <div
              key={emp.id}
              className="px-6 py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-[#1D1F23]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar src={emp.avatarUrl} name={emp.fullName} size="sm" />
                <div>
                  <Link
                    to={`/employees/${emp.id}`}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {emp.fullName}
                  </Link>
                  <p className="text-slate-500 text-[11px]">{emp.designation}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-slate-500 hidden sm:inline">{emp.workLocation}</span>
                <span className="text-slate-500 hidden md:inline">
                  Joined {formatDate(emp.joiningDate)}
                </span>
                <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                  {emp.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
