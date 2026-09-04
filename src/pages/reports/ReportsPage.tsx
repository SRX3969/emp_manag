import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BarChart3,
  Download,
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export function ReportsPage() {
  const { employees, departments, attendanceRecords, leaveRequests, payrollRuns, goals } = useData();

  const [activeReport, setActiveReport] = useState('workforce');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const filteredEmployees =
    selectedDept === 'ALL'
      ? employees
      : employees.filter((e) => e.departmentId === selectedDept);

  const totalPayrollGross = payrollRuns.reduce((sum, r) => sum + r.totalGross, 0);
  const avgAttendance = 94.2;

  const handleExport = (reportName: string) => {
    let rows: string[][] = [];
    let headers: string[] = [];

    if (reportName === 'workforce') {
      headers = ['Employee Code', 'Full Name', 'Department', 'Designation', 'Status', 'Salary'];
      rows = filteredEmployees.map((e) => [
        e.employeeCode,
        `"${e.fullName}"`,
        `"${e.departmentName}"`,
        `"${e.designation}"`,
        e.status,
        String(e.salary),
      ]);
    } else if (reportName === 'attendance') {
      headers = ['Date', 'Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'];
      rows = attendanceRecords.map((r) => [
        r.date,
        `"${r.employeeName}"`,
        `"${r.departmentName}"`,
        r.clockInTime || '—',
        r.clockOutTime || '—',
        String(r.totalHours),
        r.status,
      ]);
    } else {
      headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
      rows = leaveRequests.map((l) => [
        `"${l.employeeName}"`,
        `"${l.leaveTypeName}"`,
        l.startDate,
        l.endDate,
        String(l.totalDays),
        l.status,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_report_${reportName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Analytics & Reports"
        description="Comprehensive workforce intelligence, headcount distribution, attendance analytics, and payroll exports."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter report by department"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => handleExport(activeReport)}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Headcount"
          value={filteredEmployees.length}
          subtitle="Across active departments"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Punctuality Rate"
          value={`${avgAttendance}%`}
          subtitle="Avg on-time arrival"
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Leave Requests"
          value={leaveRequests.length}
          subtitle="Total submitted YTD"
          icon={<Calendar className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Disbursed Payroll YTD"
          value={formatCurrency(totalPayrollGross)}
          subtitle="Gross company expenses"
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
        />
      </div>

      <Tabs
        tabs={[
          { id: 'workforce', label: 'Workforce Demographics' },
          { id: 'attendance', label: 'Attendance & Utilization' },
          { id: 'leave', label: 'Leave & Absence Trends' },
        ]}
        activeTab={activeReport}
        onChange={setActiveReport}
      />

      {/* Tab: Workforce Demographics */}
      {activeReport === 'workforce' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Departmental Breakdown & Compensation Statistics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#292B30] text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Headcount</th>
                  <th className="py-2.5">Annual Budget</th>
                  <th className="py-2.5">Avg Salary</th>
                  <th className="py-2.5 text-right">Budget Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#202227]">
                {departments.map((dept) => {
                  const deptEmps = employees.filter((e) => e.departmentId === dept.id);
                  const totalSal = deptEmps.reduce((sum, e) => sum + e.salary, 0);
                  const avgSal = deptEmps.length > 0 ? Math.round(totalSal / deptEmps.length) : 0;
                  const utilPct = Math.min(100, Math.round((totalSal / Math.max(1, dept.annualBudget)) * 100));

                  return (
                    <tr key={dept.id} className="text-slate-800 dark:text-slate-200">
                      <td className="py-3 font-semibold">{dept.name}</td>
                      <td className="py-3">{deptEmps.length} members</td>
                      <td className="py-3">{formatCurrency(dept.annualBudget)}</td>
                      <td className="py-3">{formatCurrency(avgSal)}</td>
                      <td className="py-3 text-right font-medium">
                        <span className={utilPct > 85 ? 'text-amber-600' : 'text-emerald-600'}>
                          {utilPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeReport === 'attendance' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Logged Attendance History
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
            {attendanceRecords.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {r.employeeName}
                  </span>
                  <span className="text-slate-400 ml-2">({r.departmentName})</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDate(r.date)} · Mode: {r.workMode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{r.totalHours} hrs</span>
                  <span className="text-slate-400 block text-[10px]">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Leave */}
      {activeReport === 'leave' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Leave Utilization Roster
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
            {leaveRequests.map((l) => (
              <div key={l.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {l.employeeName}
                  </span>
                  <span className="text-slate-400 ml-2">({l.leaveTypeName})</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDate(l.startDate)} - {formatDate(l.endDate)} ({l.totalDays}d) · {l.reason}
                  </p>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
