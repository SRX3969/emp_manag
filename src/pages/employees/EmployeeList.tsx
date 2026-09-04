import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Employee, EmployeeStatus, EmploymentType } from '@/types/employee';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import {
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  Building,
  UserCheck,
  UserX,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/Dialog';

export function EmployeeList() {
  const { employees, departments, deleteEmployee } = useData();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const canManage = hasPermission('employees.create') || hasPermission('employees.update');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDept !== 'ALL' && emp.departmentId !== selectedDept) return false;
      if (selectedStatus !== 'ALL' && emp.status !== selectedStatus) return false;
      if (selectedType !== 'ALL' && emp.employmentType !== selectedType) return false;
      return true;
    });
  }, [employees, selectedDept, selectedStatus, selectedType]);

  const getStatusBadgeVariant = (status: EmployeeStatus): BadgeVariant => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ON_LEAVE':
        return 'warning';
      case 'PROBATION':
        return 'info';
      case 'NOTICE_PERIOD':
        return 'warning';
      case 'INACTIVE':
      case 'TERMINATED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'fullName',
      header: 'Employee',
      sortable: true,
      render: (emp) => (
        <div className="flex items-center gap-3">
          <Avatar src={emp.avatarUrl} name={emp.fullName} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {emp.fullName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {emp.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCode',
      header: 'ID',
      sortable: true,
      render: (emp) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {emp.employeeCode}
        </span>
      ),
    },
    {
      key: 'departmentName',
      header: 'Department',
      sortable: true,
      render: (emp) => (
        <span className="text-xs text-slate-800 dark:text-slate-200">{emp.departmentName}</span>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      sortable: true,
      render: (emp) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{emp.designation}</span>
      ),
    },
    {
      key: 'managerName',
      header: 'Manager',
      render: (emp) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {emp.managerName || '—'}
        </span>
      ),
    },
    {
      key: 'employmentType',
      header: 'Type',
      render: (emp) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {emp.employmentType.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      sortable: true,
      render: (emp) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(emp.joiningDate)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (emp) => (
        <Badge variant={getStatusBadgeVariant(emp.status)} size="sm" dot>
          {emp.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (emp) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/employees/${emp.id}`)}
            title="View Profile"
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {canManage && (
            <>
              <button
                onClick={() => navigate(`/employees/${emp.id}/edit`)}
                title="Edit Employee"
                className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              {emp.status === 'ACTIVE' && (
                <button
                  onClick={() => setDeactivateId(emp.id)}
                  title="Deactivate Profile"
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  const handleExportCSV = () => {
    const headers = ['Employee Code', 'Full Name', 'Email', 'Department', 'Designation', 'Status', 'Joining Date', 'Salary'];
    const rows = filteredEmployees.map((e) => [
      e.employeeCode,
      `"${e.fullName}"`,
      e.email,
      `"${e.departmentName}"`,
      `"${e.designation}"`,
      e.status,
      e.joiningDate,
      e.salary,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_employees_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Comprehensive directory of all organization personnel, team assignments, and employment records."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Employees' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            {canManage && (
              <Link to="/employees/new">
                <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Add Employee
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <DataTable
        data={filteredEmployees}
        columns={columns}
        keyExtractor={(e) => e.id}
        searchPlaceholder="Search employees by name, code, designation, or email..."
        searchKeys={['fullName', 'employeeCode', 'email', 'designation', 'departmentName']}
        onRowClick={(emp) => navigate(`/employees/${emp.id}`)}
        filterSlot={
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter by department"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by status"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="PROBATION">Probation</option>
              <option value="INACTIVE">Inactive</option>
              <option value="TERMINATED">Terminated</option>
            </select>

            {/* Employment Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by employment type"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none hidden sm:inline-block"
            >
              <option value="ALL">All Employment Types</option>
              <option value="FULL_TIME">Full-Time</option>
              <option value="PART_TIME">Part-Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>
        }
      />

      {/* Deactivate Employee Dialog */}
      <ConfirmDialog
        isOpen={!!deactivateId}
        onClose={() => setDeactivateId(null)}
        onConfirm={() => {
          if (deactivateId) {
            deleteEmployee(deactivateId);
            setDeactivateId(null);
          }
        }}
        title="Deactivate Employee Profile"
        message="Are you sure you want to mark this employee as inactive? Inactive employees will no longer have system access, but their historic payroll, attendance, and audit records will remain preserved."
        confirmText="Deactivate Profile"
        variant="danger"
      />
    </div>
  );
}
