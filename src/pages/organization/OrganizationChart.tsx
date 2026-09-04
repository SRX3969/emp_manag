import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ChevronDown,
  ChevronRight,
  Building,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { Employee } from '@/types/employee';

interface OrgCardProps {
  employee: Employee;
  directReports?: Employee[];
  allEmployees: Employee[];
}

function OrgCard({ employee, directReports = [], allEmployees }: OrgCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="relative rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-4 shadow-sm w-64 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all text-left">
        <div className="flex items-start gap-3">
          <Avatar src={employee.avatarUrl} name={employee.fullName} size="md" />
          <div className="min-w-0 flex-1">
            <Link
              to={`/employees/${employee.id}`}
              className="font-bold text-xs text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 block truncate"
            >
              {employee.fullName}
            </Link>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {employee.designation}
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#202227] text-slate-600 dark:text-slate-400">
                {employee.departmentName.split(' ')[0]}
              </span>
              {directReports.length > 0 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  {directReports.length} reports
                </span>
              )}
            </div>
          </div>
        </div>

        {directReports.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#1D1F23] border border-slate-300 dark:border-[#292B30] flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xs transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Children Nodes */}
      {isExpanded && directReports.length > 0 && (
        <div className="flex flex-col items-center pt-6 relative">
          {/* Vertical Connecting Stem */}
          <div className="w-px h-6 bg-slate-300 dark:bg-[#292B30] absolute top-0" />

          {/* Horizontal Branch Bar */}
          {directReports.length > 1 && (
            <div
              className="h-px bg-slate-300 dark:bg-[#292B30] absolute top-6"
              style={{
                width: `calc(100% - ${256 / directReports.length}px)`,
              }}
            />
          )}

          {/* Direct Reports Row */}
          <div className="flex gap-8 items-start pt-6">
            {directReports.map((report) => {
              const subReports = allEmployees.filter((e) => e.managerId === report.id);
              return (
                <div key={report.id} className="relative flex flex-col items-center">
                  <div className="w-px h-6 bg-slate-300 dark:bg-[#292B30] absolute -top-6" />
                  <OrgCard
                    employee={report}
                    directReports={subReports}
                    allEmployees={allEmployees}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrganizationChart() {
  const { employees } = useData();

  // Find Root (CEO / No manager or Rahul Sharma)
  const rootLeader =
    employees.find((e) => e.designation.includes('CEO') || !e.managerId) || employees[0];
  const directReports = employees.filter((e) => e.managerId === rootLeader?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Hierarchy"
        description="Interactive corporate reporting lines, executive hierarchy, and department leadership map."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Organization' }]}
      />

      {/* Chart Canvas Area */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-8 shadow-sm overflow-x-auto min-h-[600px] flex items-start justify-center">
        {rootLeader ? (
          <div className="py-4">
            <OrgCard
              employee={rootLeader}
              directReports={directReports}
              allEmployees={employees}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">No organizational records found.</p>
        )}
      </div>
    </div>
  );
}
