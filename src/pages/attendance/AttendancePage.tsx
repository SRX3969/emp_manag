import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  MapPin,
  Download,
  Filter,
  Plus,
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function AttendancePage() {
  const { attendanceRecords, employees, clockIn, clockOut } = useData();
  const { currentUser, role, hasPermission } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:00',
    clockOut: '17:30',
    reason: '',
  });

  const canManage = hasPermission('attendance.manage');
  const myEmpId = currentUser.employeeId || 'emp_004';
  const myTodayRecord = attendanceRecords.find(
    (r) => r.employeeId === myEmpId && r.date === new Date().toISOString().split('T')[0]
  );
  const isClockedIn = !!myTodayRecord?.clockInTime && !myTodayRecord?.clockOutTime;

  // Filter records by selected date
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((r) => {
      if (selectedDate && r.date !== selectedDate) return false;
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [attendanceRecords, selectedDate, selectedStatus]);

  const getAttendanceBadgeVariant = (status: AttendanceStatus): BadgeVariant => {
    switch (status) {
      case 'PRESENT':
        return 'success';
      case 'LATE':
      case 'HALF_DAY':
        return 'warning';
      case 'ABSENT':
        return 'danger';
      case 'WORK_FROM_HOME':
        return 'info';
      case 'ON_LEAVE':
        return 'neutral';
      case 'HOLIDAY':
        return 'default';
      default:
        return 'neutral';
    }
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeName',
      header: 'Employee',
      sortable: true,
      render: (rec) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={rec.employeeName} size="xs" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{rec.employeeName}</p>
            <p className="text-[10px] text-slate-400 font-mono">{rec.employeeCode}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'departmentName',
      header: 'Department',
      sortable: true,
      render: (rec) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{rec.departmentName}</span>
      ),
    },
    {
      key: 'clockInTime',
      header: 'Check In',
      render: (rec) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {rec.clockInTime
            ? new Date(rec.clockInTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </span>
      ),
    },
    {
      key: 'clockOutTime',
      header: 'Check Out',
      render: (rec) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {rec.clockOutTime
            ? new Date(rec.clockOutTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </span>
      ),
    },
    {
      key: 'totalHours',
      header: 'Working Hours',
      sortable: true,
      render: (rec) => (
        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          {rec.totalHours > 0 ? `${rec.totalHours} hrs` : '—'}
        </span>
      ),
    },
    {
      key: 'workMode',
      header: 'Work Mode',
      render: (rec) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">{rec.workMode}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (rec) => (
        <Badge variant={getAttendanceBadgeVariant(rec.status)} size="sm" dot>
          {rec.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
  ];

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCorrectionModalOpen(false);
  };

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Attendance & Timesheets"
        description="Shift tracking, clock-in logs, timesheet verification, and punctuality monitoring."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Attendance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Clock className="w-4 h-4" />}
              onClick={() => setIsCorrectionModalOpen(true)}
            >
              Request Correction
            </Button>
          </div>
        }
      />

      {/* Clock In / Out Quick Terminal */}
      <RevealCard delayMs={30} className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Daily Clock Terminal
                </h3>
                <Badge variant={isClockedIn ? 'success' : 'neutral'} dot>
                  {isClockedIn ? 'Active Shift' : 'Off Shift'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {myTodayRecord?.clockInTime
                  ? `Clocked in at ${new Date(myTodayRecord.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Your shift has not been started today.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isClockedIn ? (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Clock className="w-4 h-4" />}
                onClick={() => clockIn(myEmpId, 'On-site')}
              >
                Clock In Shift
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Clock className="w-4 h-4" />}
                onClick={() => clockOut(myEmpId)}
              >
                Clock Out Shift
              </Button>
            )}
          </div>
        </div>
      </RevealCard>

      {/* Data Table with Date Selector */}
      <DataTable
        data={filteredRecords}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search by employee name or code..."
        searchKeys={['employeeName', 'employeeCode', 'departmentName']}
        filterSlot={
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Filter by date"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by attendance status"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="WORK_FROM_HOME">Work From Home</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
        }
      />

      {/* Attendance Correction Modal */}
      <Dialog
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Request Attendance Correction"
        description="Submit a verified correction request for your supervisor or HR administrator."
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            required
            value={correctionForm.date}
            onChange={(e) => setCorrectionForm({ ...correctionForm, date: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Clock In Time"
              type="time"
              required
              value={correctionForm.clockIn}
              onChange={(e) => setCorrectionForm({ ...correctionForm, clockIn: e.target.value })}
            />
            <Input
              label="Clock Out Time"
              type="time"
              required
              value={correctionForm.clockOut}
              onChange={(e) => setCorrectionForm({ ...correctionForm, clockOut: e.target.value })}
            />
          </div>
          <Input
            label="Reason for Correction"
            required
            placeholder="e.g. Card reader was offline at security desk"
            value={correctionForm.reason}
            onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
          />
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </Dialog>
    </PageTransition>
  );
}
