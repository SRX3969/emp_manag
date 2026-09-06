import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, Download, Search } from 'lucide-react';
import { AuditLogItem } from '@/types/system';
import { PageTransition } from '@/components/motion/Motion';

export function AuditLogsPage() {
  const { auditLogs } = useData();
  const [selectedEntity, setSelectedEntity] = useState('ALL');

  const filteredLogs = useMemo(() => {
    if (selectedEntity === 'ALL') return auditLogs;
    return auditLogs.filter((l) => l.entity === selectedEntity);
  }, [auditLogs, selectedEntity]);

  const columns: Column<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      sortable: true,
      render: (log) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {formatDateTime(log.timestamp)}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'Actor / User',
      sortable: true,
      render: (log) => (
        <div>
          <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{log.userName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Event',
      sortable: true,
      render: (log) => (
        <Badge variant="info" size="sm">
          {log.action}
        </Badge>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      sortable: true,
      render: (log) => (
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
          {log.entity}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Activity Details',
      render: (log) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
          {log.details}
        </p>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (log) => (
        <span className="font-mono text-[11px] text-slate-400">
          {log.ipAddress || '198.51.100.42'}
        </span>
      ),
    },
  ];

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Security & System Audit Logs"
        description="Immutable compliance trail capturing all personnel updates, payroll disbursements, and permission modifications."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Audit Logs' }]}
      />

      <DataTable
        data={filteredLogs}
        columns={columns}
        keyExtractor={(l) => l.id}
        searchPlaceholder="Search audit logs by actor, action, or details..."
        searchKeys={['userName', 'action', 'entity', 'details']}
        filterSlot={
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            aria-label="Filter audit logs by entity"
            className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Entities</option>
            <option value="Employee">Employee</option>
            <option value="LeaveRequest">Leave Request</option>
            <option value="PayrollRun">Payroll Run</option>
            <option value="Department">Department</option>
            <option value="Settings">Settings</option>
          </select>
        }
      />
    </PageTransition>
  );
}
