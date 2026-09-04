import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import {
  CalendarDays,
  Plus,
  Check,
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { LeaveRequest, LeaveRequestStatus } from '@/types/leave';

export function LeavePage() {
  const {
    leaveRequests,
    leaveBalances,
    leaveTypes,
    applyLeave,
    approveLeave,
    rejectLeave,
    cancelLeave,
    employees,
  } = useData();
  const { currentUser, role, hasPermission, currentOrg } = useAuth();

  const [activeTab, setActiveTab] = useState('requests');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveTypeId: leaveTypes[0]?.id || 'lt_annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isHalfDay: false,
    reason: '',
  });

  const canApprove = hasPermission('leave.approve');
  const myEmpId = currentUser.employeeId || 'emp_004';

  const myBalances = leaveBalances.filter((b) => b.employeeId === myEmpId);
  const myRequests = leaveRequests.filter((r) => r.employeeId === myEmpId);
  const pendingApprovals = leaveRequests.filter((r) => r.status === 'PENDING');

  const getStatusVariant = (status: LeaveRequestStatus): BadgeVariant => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'CANCELLED':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.reason.trim()) return;

    const selectedType = leaveTypes.find((t) => t.id === applyForm.leaveTypeId);
    const myEmp = employees.find((e) => e.id === myEmpId);

    const start = new Date(applyForm.startDate);
    const end = new Date(applyForm.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = applyForm.isHalfDay
      ? 0.5
      : Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    applyLeave({
      organizationId: currentOrg.id,
      employeeId: myEmpId,
      employeeName: myEmp?.fullName || currentUser.name,
      employeeCode: myEmp?.employeeCode || 'EMP-00104',
      departmentName: myEmp?.departmentName || 'Engineering',
      leaveTypeId: applyForm.leaveTypeId,
      leaveTypeName: selectedType?.name || 'Paid Leave',
      startDate: applyForm.startDate,
      endDate: applyForm.endDate,
      totalDays,
      isHalfDay: applyForm.isHalfDay,
      reason: applyForm.reason.trim(),
    });

    setIsApplyOpen(false);
    setApplyForm({
      leaveTypeId: leaveTypes[0]?.id || 'lt_annual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      isHalfDay: false,
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave & Time-Off Management"
        description="Employee paid time off, sick leave balances, approval workflows, and company absence calendar."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Leave' }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsApplyOpen(true)}>
            Apply for Leave
          </Button>
        }
      />

      {/* Leave Balances Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {myBalances.map((bal) => (
          <div
            key={bal.id}
            className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {bal.leaveTypeName}
              </span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold">
                {bal.leaveTypeCode}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-heading">
              {bal.remainingDays}{' '}
              <span className="text-xs font-normal text-slate-400">days available</span>
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-[#202227]">
              <span>Used: {bal.usedDays}d</span>
              <span>Pending: {bal.pendingDays}d</span>
              <span>Total: {bal.allocatedDays}d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <Tabs
        tabs={[
          { id: 'requests', label: 'All Requests', count: leaveRequests.length },
          ...(canApprove
            ? [{ id: 'approvals', label: 'Pending Approvals', count: pendingApprovals.length }]
            : []),
          { id: 'my_leaves', label: 'My Submissions', count: myRequests.length },
          { id: 'types', label: 'Leave Types & Policies' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: All Requests */}
      {activeTab === 'requests' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-[#202227]">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-[#1D1F23]/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={req.employeeName} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {req.employeeName}
                      </span>
                      <span className="text-slate-400">({req.departmentName})</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                      <strong className="text-slate-800 dark:text-slate-200">
                        {req.leaveTypeName}
                      </strong>{' '}
                      · {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays}{' '}
                      {req.totalDays === 1 ? 'day' : 'days'})
                    </p>
                    <p className="text-slate-500 italic mt-0.5">"{req.reason}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant={getStatusVariant(req.status)} size="sm" dot>
                    {req.status}
                  </Badge>

                  {canApprove && req.status === 'PENDING' && (
                    <div className="flex items-center gap-1.5">
                      <Button size="xs" variant="primary" onClick={() => approveLeave(req.id, 'Approved')}>
                        Approve
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => rejectLeave(req.id, 'Declined')}>
                        Reject
                      </Button>
                    </div>
                  )}

                  {req.employeeId === myEmpId && req.status === 'PENDING' && (
                    <Button size="xs" variant="ghost" onClick={() => cancelLeave(req.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pending Approvals */}
      {activeTab === 'approvals' && canApprove && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Requests Awaiting Decision ({pendingApprovals.length})
          </h3>
          {pendingApprovals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Zero pending leave requests in your approval queue.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#202227]">
              {pendingApprovals.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {req.employeeName} ({req.departmentName})
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {req.leaveTypeName} · {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays}d)
                    </p>
                    <p className="text-slate-500 italic mt-0.5">"{req.reason}"</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="xs" variant="outline" onClick={() => rejectLeave(req.id)}>
                      Reject
                    </Button>
                    <Button size="xs" variant="primary" onClick={() => approveLeave(req.id)}>
                      Approve Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: My Submissions */}
      {activeTab === 'my_leaves' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            My Past Applications ({myRequests.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
            {myRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{req.leaveTypeName}</p>
                  <p className="text-slate-500">
                    {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays}d) · {req.reason}
                  </p>
                </div>
                <Badge variant={getStatusVariant(req.status)} size="sm">
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Leave Types & Policies */}
      {activeTab === 'types' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaveTypes.map((type) => (
            <div
              key={type.id}
              className="p-5 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm text-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {type.name}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-[#202227]">
                  {type.code}
                </span>
              </div>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Yearly Allocation:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{type.totalDaysPerYear} days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Carry Forward:</span>
                  <span>{type.carryForwardAllowed ? `Yes (max ${type.maxCarryForwardDays || 5}d)` : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compensated (Paid):</span>
                  <span>{type.isPaid ? 'Yes (Full Pay)' : 'Unpaid (LWP)'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Leave Modal Dialog */}
      <Dialog
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Apply for Time-Off"
        description="Submit a paid leave or time-off request to your manager."
      >
        <form onSubmit={handleApply} className="space-y-4">
          <Select
            label="Leave Type"
            required
            value={applyForm.leaveTypeId}
            onChange={(e) => setApplyForm({ ...applyForm, leaveTypeId: e.target.value })}
            options={leaveTypes.map((t) => ({ value: t.id, label: `${t.name} (${t.code})` }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={applyForm.startDate}
              onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={applyForm.endDate}
              onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="half-day"
              checked={applyForm.isHalfDay}
              onChange={(e) => setApplyForm({ ...applyForm, isHalfDay: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="half-day" className="text-xs text-slate-700 dark:text-slate-300">
              Half-day leave only (0.5 day)
            </label>
          </div>
          <Input
            label="Reason for Absence"
            required
            placeholder="e.g. Attending family wedding / Doctor appointment"
            value={applyForm.reason}
            onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
