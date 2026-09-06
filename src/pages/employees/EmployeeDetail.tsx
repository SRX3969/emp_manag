import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  Edit2,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Clock,
  Target,
  Award,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { EmployeeStatus } from '@/types/employee';
import { PageTransition, ProfileReveal } from '@/components/motion/Motion';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    leaveBalances,
    payslips,
    documents,
    goals,
    reviews,
  } = useData();
  const { hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');

  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Employee Record Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested employee record does not exist or has been removed.
        </p>
        <Link to="/employees">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const canEdit = hasPermission('employees.update');
  const canViewPayroll = hasPermission('payroll.view');

  // Associated Data
  const empAttendance = attendanceRecords.filter((a) => a.employeeId === employee.id);
  const empLeaves = leaveRequests.filter((l) => l.employeeId === employee.id);
  const empBalances = leaveBalances.filter((b) => b.employeeId === employee.id);
  const empPayslips = payslips.filter((p) => p.employeeId === employee.id);
  const empDocs = documents.filter((d) => d.employeeId === employee.id || !d.employeeId);
  const empGoals = goals.filter((g) => g.employeeId === employee.id);
  const empReviews = reviews.filter((r) => r.employeeId === employee.id);

  const getStatusVariant = (status: EmployeeStatus): BadgeVariant => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ON_LEAVE':
        return 'warning';
      case 'PROBATION':
        return 'info';
      case 'INACTIVE':
      case 'TERMINATED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal' },
    { id: 'employment', label: 'Employment' },
    { id: 'attendance', label: 'Attendance', count: empAttendance.length },
    { id: 'leave', label: 'Leave', count: empLeaves.length },
    ...(canViewPayroll ? [{ id: 'payroll', label: 'Payroll' }] : []),
    { id: 'documents', label: 'Documents', count: empDocs.length },
    { id: 'performance', label: 'Performance', count: empGoals.length },
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Top Breadcrumbs & Action Bar */}
      <PageHeader
        title={employee.fullName}
        description={`${employee.employeeCode} · ${employee.designation} · ${employee.departmentName}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: employee.fullName },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/employees">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Directory
              </Button>
            </Link>
            {canEdit && (
              <Link to={`/employees/${employee.id}/edit`}>
                <Button size="sm" leftIcon={<Edit2 className="w-4 h-4" />}>
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Main Profile Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar
              src={employee.avatarUrl}
              name={employee.fullName}
              size="xl"
              status={employee.status === 'ACTIVE' ? 'online' : 'offline'}
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {employee.fullName}
                </h2>
                <Badge variant={getStatusVariant(employee.status)} dot>
                  {employee.status.replace('_', ' ')}
                </Badge>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-[#202227] text-slate-600 dark:text-slate-400">
                  {employee.employeeCode}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                {employee.designation}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {employee.departmentName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {employee.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {employee.city}, {employee.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-[#202227]">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Employment Type
              </span>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {employee.employmentType.replace('_', ' ')} ({employee.workLocation})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Joined Organization
              </span>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {formatDate(employee.joiningDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Skills */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Professional Bio
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {employee.bio ||
                  `${employee.fullName} is an active member of the ${employee.departmentName} division, currently serving as ${employee.designation}.`}
              </p>

              {employee.skills && employee.skills.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-[#202227]">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Core Competencies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {employee.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-[#202227] text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Logged Attendance</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {empAttendance.length} records
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Active Goals</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {empGoals.length} tracked
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Documents Stored</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {empDocs.length} files
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Reporting & Hierarchy */}
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
                Reporting Structure
              </h3>
              <div className="text-xs space-y-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Direct Manager</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employee.managerName || 'Chief Executive Officer (Direct)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department Head</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employee.departmentName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Work Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {employee.workLocation} ({employee.city})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personal Information */}
      {activeTab === 'personal' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-[#202227] pb-2">
                Personal Identity
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {formatDate(employee.dateOfBirth)}
                </span>
                <span className="text-slate-400">Gender:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium capitalize">
                  {employee.gender.toLowerCase()}
                </span>
                <span className="text-slate-400">Address:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {employee.address}, {employee.city}, {employee.country} ({employee.postalCode})
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-[#202227] pb-2">
                Emergency Contact Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Contact Name:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {employee.emergencyContact.name}
                </span>
                <span className="text-slate-400">Relationship:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {employee.emergencyContact.relationship}
                </span>
                <span className="text-slate-400">Contact Phone:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium font-mono">
                  {employee.emergencyContact.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employment Information */}
      {activeTab === 'employment' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-[#202227] pb-2">
                Organizational Placement
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.departmentName}
                </span>
                <span className="text-slate-400">Designation:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.designation}
                </span>
                <span className="text-slate-400">Reporting Manager:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.managerName || 'None (Direct Executive)'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-[#202227] pb-2">
                Contract & Timeline
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Date of Joining:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(employee.joiningDate)}
                </span>
                <span className="text-slate-400">Employment Type:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.employmentType.replace('_', ' ')}
                </span>
                <span className="text-slate-400">Work Setup:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {employee.workLocation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Attendance Log */}
      {activeTab === 'attendance' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Shift Attendance History
            </h3>
            <span className="text-xs text-slate-500">{empAttendance.length} records recorded</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
            {empAttendance.map((rec) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDate(rec.date)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Clock In: {rec.clockInTime ? new Date(rec.clockInTime).toLocaleTimeString() : '—'} · Work Mode: {rec.workMode}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {rec.totalHours} hrs
                  </span>
                  <Badge variant={rec.status === 'PRESENT' ? 'success' : 'warning'} size="sm">
                    {rec.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Leave */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {empBalances.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm text-xs"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">{b.leaveTypeName}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-heading">
                  {b.remainingDays} days
                </p>
                <p className="text-slate-400 mt-1">Used {b.usedDays} of {b.allocatedDays} allocated</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Leave Requests History
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
              {empLeaves.map((l) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {l.leaveTypeName} ({l.totalDays} {l.totalDays === 1 ? 'day' : 'days'})
                    </p>
                    <p className="text-slate-500">
                      {formatDate(l.startDate)} to {formatDate(l.endDate)} · {l.reason}
                    </p>
                  </div>
                  <Badge
                    variant={
                      l.status === 'APPROVED' ? 'success' : l.status === 'PENDING' ? 'warning' : 'danger'
                    }
                    size="sm"
                  >
                    {l.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Payroll */}
      {activeTab === 'payroll' && canViewPayroll && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3 mb-4">
              Annual Compensation Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded bg-slate-50 dark:bg-[#1D1F23]">
                <span className="text-slate-500">Base Annual CTC / Salary</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-heading">
                  {formatCurrency(employee.salary)}
                </p>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-[#1D1F23]">
                <span className="text-slate-500">Monthly Gross (Approx)</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-heading">
                  {formatCurrency(Math.round(employee.salary / 12))}
                </p>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-[#1D1F23]">
                <span className="text-slate-500">Disbursement Currency</span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-heading">
                  {employee.currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
                </p>
              </div>
            </div>

            {/* Statutory & Compliance Details */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#202227] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#18191C]">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Permanent Account (PAN)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {employee.panNumber || employee.taxIdentificationNumber || 'AAAPS1234A'}
                </span>
              </div>
              <div className="p-2.5 rounded border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#18191C]">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Universal Account (UAN / EPF)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {employee.uanNumber || '100982347101'}
                </span>
              </div>
              <div className="p-2.5 rounded border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#18191C]">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Bank IFSC Code</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {employee.ifscCode || 'HDFC0001234'}
                </span>
              </div>
              <div className="p-2.5 rounded border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#18191C]">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Bank Account Mask</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {employee.bankAccountNumber || '•••• 4819'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Generated Payslips
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
              {empPayslips.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{p.payPeriod}</p>
                    <p className="text-slate-500">
                      Disbursed on {formatDate(p.paymentDate)} · Net: {formatCurrency(p.netPayable)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">
                      {p.paymentStatus}
                    </Badge>
                    <Link to="/payroll/payslips">
                      <Button size="xs" variant="outline" leftIcon={<Download className="w-3 h-3" />}>
                        Download Slip
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Documents */}
      {activeTab === 'documents' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Employee Documents & Contracts
            </h3>
            <Link to="/documents">
              <Button size="xs" variant="outline">
                Upload New Document
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#202227] text-xs">
            {empDocs.map((doc) => (
              <div key={doc.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{doc.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {doc.category} · {doc.fileSizeFormatted} · Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <Button size="xs" variant="outline" leftIcon={<Download className="w-3 h-3" />}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
              Performance Goals & KPIs
            </h3>
            <div className="space-y-3">
              {empGoals.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-md border border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#131417] text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{g.title}</p>
                    <Badge variant="info" size="sm">
                      {g.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500">{g.description}</p>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span>Progress</span>
                      <span>{g.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#202227] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${g.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
