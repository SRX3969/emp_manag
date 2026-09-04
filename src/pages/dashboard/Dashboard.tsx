import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  UserCheck,
  CalendarOff,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Briefcase,
  Megaphone,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { currentUser, role } = useAuth();
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    leaveBalances,
    holidays,
    payrollRuns,
    tasks,
    announcements,
    clockIn,
    clockOut,
    approveLeave,
    rejectLeave,
  } = useData();

  const [clockInMode, setClockInMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('On-site');

  // Computed metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;
  const onLeaveCount = employees.filter((e) => e.status === 'ON_LEAVE').length;
  const probationCount = employees.filter((e) => e.status === 'PROBATION').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((r) => r.date === todayStr);
  const presentToday = todayAttendance.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'PENDING');
  const myAttendanceToday = attendanceRecords.find(
    (r) => r.employeeId === (currentUser.employeeId || 'emp_004') && r.date === todayStr
  );
  const isClockedIn = !!myAttendanceToday?.clockInTime && !myAttendanceToday?.clockOutTime;

  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= new Date(todayStr))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const myTasks = tasks.filter((t) => t.assigneeId === (currentUser.employeeId || 'emp_004'));
  const latestPayroll = payrollRuns[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${currentUser.name}`}
        description={`Here is your enterprise workforce overview for ${new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date())}.`}
        actions={
          role === 'SUPER_ADMIN' || role === 'HR_ADMIN' ? (
            <Link to="/employees/new">
              <Button leftIcon={<UserPlus className="w-4 h-4" />}>Add Employee</Button>
            </Link>
          ) : null
        }
      />

      {/* ========================================================= */}
      {/* VIEW: ADMIN & HR OVERVIEW */}
      {/* ========================================================= */}
      {(role === 'SUPER_ADMIN' || role === 'HR_ADMIN') && (
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Workforce"
              value={totalEmployees}
              subtitle={`${activeEmployees} Active · ${probationCount} Probation`}
              icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              change={{ value: '+4.2% from last month', trend: 'up' }}
            />
            <StatCard
              title="Present Today"
              value={presentToday}
              subtitle={`${Math.round((presentToday / Math.max(1, totalEmployees)) * 100)}% attendance rate`}
              icon={<UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              change={{ value: 'On target', trend: 'neutral' }}
            />
            <StatCard
              title="On Leave Today"
              value={onLeaveCount}
              subtitle={`${pendingLeaves.length} pending review`}
              icon={<CalendarOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            />
            <StatCard
              title="Monthly Payroll (Est)"
              value={formatCurrency(latestPayroll?.totalNet || 683350)}
              subtitle={`Status: ${latestPayroll?.status || 'Active'}`}
              icon={<DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            />
          </div>

          {/* Middle Row: Pending Approvals & Department Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Pending Leave Approvals
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Action required on submitted employee time-off requests
                  </p>
                </div>
                <Link
                  to="/leave"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  All leave requests have been reviewed.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#202227]">
                  {pendingLeaves.slice(0, 4).map((req) => (
                    <div
                      key={req.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={req.employeeName} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {req.employeeName}{' '}
                            <span className="font-normal text-slate-500">
                              ({req.departmentName})
                            </span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {req.leaveTypeName}:
                            </span>{' '}
                            {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays}{' '}
                            {req.totalDays === 1 ? 'day' : 'days'})
                          </p>
                          <p className="text-slate-500 text-[11px] italic mt-0.5">
                            "{req.reason}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => rejectLeave(req.id, 'Declined due to staffing requirements')}
                        >
                          Reject
                        </Button>
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => approveLeave(req.id, 'Approved')}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department Headcount Summary */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Department Headcount
                </h3>
                <Link
                  to="/departments"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Engineering & Technology', count: 28, pct: 39, color: 'bg-emerald-500' },
                  { name: 'Enterprise Sales', count: 16, pct: 22, color: 'bg-blue-500' },
                  { name: 'Operations & IT', count: 9, pct: 12, color: 'bg-slate-500' },
                  { name: 'Human Resources', count: 8, pct: 11, color: 'bg-purple-500' },
                  { name: 'Finance & Accounting', count: 7, pct: 10, color: 'bg-amber-500' },
                  { name: 'Product Design & UX', count: 6, pct: 8, color: 'bg-pink-500' },
                ].map((dept) => (
                  <div key={dept.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {dept.name}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">
                        {dept.count} ({dept.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#202227] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dept.color} rounded-full`}
                        style={{ width: `${dept.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW: MANAGER OVERVIEW */}
      {/* ========================================================= */}
      {role === 'MANAGER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Engineering Team Size"
              value="28 Engineers"
              subtitle="4 Direct Reports"
              icon={<Users className="w-5 h-5 text-blue-600" />}
            />
            <StatCard
              title="Present Today"
              value="26 / 28"
              subtitle="93% Team Attendance"
              icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            />
            <StatCard
              title="Pending Team Approvals"
              value={pendingLeaves.length}
              subtitle="Action required"
              icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
            />
            <StatCard
              title="Quarterly Goals Progress"
              value="78%"
              subtitle="Q3 Sprint Target"
              icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Leave Requests */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Team Leave Approvals
                </h3>
                <Link to="/leave" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  All Requests
                </Link>
              </div>
              {pendingLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No pending team leave requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-md bg-slate-50 dark:bg-[#1D1F23] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {req.employeeName}
                        </p>
                        <p className="text-slate-500">
                          {formatDate(req.startDate)} - {formatDate(req.endDate)} · {req.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="xs" variant="primary" onClick={() => approveLeave(req.id)}>
                          Approve
                        </Button>
                        <Button size="xs" variant="outline" onClick={() => rejectLeave(req.id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Sprint Tasks */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Key Engineering Deliverables
                </h3>
                <Link to="/tasks" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Task Board
                </Link>
              </div>
              <div className="space-y-2.5">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-md border border-slate-100 dark:border-[#202227] bg-white dark:bg-[#131417] text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                      <p className="text-slate-500 mt-0.5">
                        Assigned to {task.assigneeName} · Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <Badge variant={task.priority === 'HIGH' || task.priority === 'URGENT' ? 'danger' : 'default'} size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW: EMPLOYEE SELF-SERVICE */}
      {/* ========================================================= */}
      {role === 'EMPLOYEE' && (
        <div className="space-y-6">
          {/* Clock In / Out & Attendance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clock-In Panel */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Today's Attendance
                  </h3>
                  <Badge variant={isClockedIn ? 'success' : 'neutral'} dot>
                    {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {myAttendanceToday?.clockInTime
                    ? `Clocked in at ${new Date(myAttendanceToday.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Log your shift attendance and work mode for today.'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#202227] space-y-3">
                {!isClockedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Mode:</span>
                      {(['On-site', 'Remote', 'Hybrid'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setClockInMode(mode)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            clockInMode === mode
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-[#202227] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      leftIcon={<Clock className="w-4 h-4" />}
                      onClick={() => clockIn(currentUser.employeeId || 'emp_004', clockInMode)}
                    >
                      Clock In Now
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    className="w-full"
                    leftIcon={<Clock className="w-4 h-4" />}
                    onClick={() => clockOut(currentUser.employeeId || 'emp_004')}
                  >
                    Clock Out Shift
                  </Button>
                )}
              </div>
            </div>

            {/* Leave Balances */}
            <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  My Leave Balances (2026)
                </h3>
                <Link to="/leave" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Apply Leave
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {leaveBalances.map((lb) => (
                  <div
                    key={lb.id}
                    className="p-3 rounded-md border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#131417]"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {lb.leaveTypeName}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-heading">
                      {lb.remainingDays}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        days left
                      </span>
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                      <span>Allocated: {lb.allocatedDays}</span>
                      <span>Used: {lb.usedDays}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Upcoming Holidays & Assigned Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Company Holidays */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upcoming Holidays
                </h3>
                <Link to="/holidays" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Full Calendar
                </Link>
              </div>
              <div className="space-y-2.5">
                {upcomingHolidays.map((hol) => (
                  <div
                    key={hol.id}
                    className="p-3 rounded-md bg-slate-50 dark:bg-[#1D1F23] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold text-center min-w-[48px]">
                        <span className="block text-[10px] uppercase">{hol.dayOfWeek.slice(0, 3)}</span>
                        <span className="text-sm">{new Date(hol.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{hol.name}</p>
                        <p className="text-slate-500">{formatDate(hol.date)}</p>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {hol.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* My Active Tasks */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  My Active Tasks
                </h3>
                <Link to="/tasks" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  View Tasks
                </Link>
              </div>
              {myTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No open tasks assigned.</p>
              ) : (
                <div className="space-y-2.5">
                  {myTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-md border border-slate-100 dark:border-[#202227] bg-white dark:bg-[#131417] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{t.title}</p>
                        <p className="text-slate-500 mt-0.5">Due {formatDate(t.dueDate)}</p>
                      </div>
                      <Badge variant={t.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Company Announcements Card */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#202227] pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Company Announcements
            </h3>
          </div>
          <Link
            to="/announcements"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            All Notices
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-md border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#131417] text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant={ann.category === 'POLICY' ? 'info' : 'warning'} size="sm">
                    {ann.category}
                  </Badge>
                  <span className="text-slate-400 text-[11px]">{formatDate(ann.publishedAt)}</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                  {ann.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
              <p className="text-slate-400 text-[11px] mt-3">
                By {ann.authorName} ({ann.authorDesignation})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
