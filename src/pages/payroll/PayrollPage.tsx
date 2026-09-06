import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  DollarSign,
  FileSpreadsheet,
  Download,
  Plus,
  CheckCircle2,
  Printer,
  FileText,
  CreditCard,
  Building,
} from 'lucide-react';
import { PayrollRun, Payslip, PayPeriodStatus } from '@/types/payroll';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function PayrollPage() {
  const { payrollRuns, payslips, employees, createPayrollRun, processPayrollRun } = useData();
  const { currentUser, role, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState('runs');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isNewRunOpen, setIsNewRunOpen] = useState(false);
  const [confirmDisburseId, setConfirmDisburseId] = useState<string | null>(null);

  const [newRunForm, setNewRunForm] = useState({
    month: 'October 2026',
    code: '2026-10',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  });

  const canManage = hasPermission('payroll.manage');
  const myEmpId = currentUser.employeeId || 'emp_004';

  // Visible payslips: Admins/HR see all; employees see only their own
  const visiblePayslips = canManage
    ? payslips
    : payslips.filter((p) => p.employeeId === myEmpId);

  const getStatusVariant = (status: PayPeriodStatus): BadgeVariant => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'warning';
      case 'DRAFT':
        return 'info';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    createPayrollRun(
      newRunForm.month,
      newRunForm.code,
      newRunForm.startDate,
      newRunForm.endDate
    );
    setIsNewRunOpen(false);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Payroll & Compensation"
        description="Salary disbursements, tax calculations, pay period processing, and individual payslips."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Payroll' }]}
        actions={
          canManage && (
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewRunOpen(true)}>
              New Payroll Run
            </Button>
          )
        }
      />

      {/* Tabs Navigation */}
      <Tabs
        tabs={[
          ...(canManage ? [{ id: 'runs', label: 'Payroll Runs', count: payrollRuns.length }] : []),
          { id: 'payslips', label: 'Payslips', count: visiblePayslips.length },
          { id: 'structures', label: 'Compensation Structures' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Payroll Runs */}
      {activeTab === 'runs' && canManage && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-[#202227]">
              {payrollRuns.map((run) => (
                <div
                  key={run.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 dark:hover:bg-[#1D1F23]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                        {run.payPeriodMonth}
                      </h4>
                      <Badge variant={getStatusVariant(run.status)} size="sm" dot>
                        {run.status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Period: {formatDate(run.startDate)} to {formatDate(run.endDate)} · {run.totalEmployees} Active Personnel
                    </p>
                    {run.processedBy && (
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Disbursed by {run.processedBy} on {formatDate(run.disbursementDate)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Gross Total</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(run.totalGross)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Deductions</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(run.totalDeductions)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Net Disbursement</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(run.totalNet)}
                      </span>
                    </div>

                    {run.status === 'DRAFT' && (
                      <Button
                        size="xs"
                        variant="primary"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => setConfirmDisburseId(run.id)}
                      >
                        Process Run
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payslips */}
      {activeTab === 'payslips' && (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-[#202227] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Generated Payslips ({visiblePayslips.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#202227]">
            {visiblePayslips.map((slip) => (
              <div
                key={slip.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-[#1D1F23]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {slip.employeeName}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">({slip.employeeCode})</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    {slip.payPeriod} · {slip.departmentName} · Paid via {slip.bankAccountNumber || 'Direct Deposit'}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Net Pay</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(slip.netPayable)}
                    </span>
                  </div>
                  <Button
                    size="xs"
                    variant="outline"
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedPayslip(slip)}
                  >
                    View Payslip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Compensation Structures */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.slice(0, 6).map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm text-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{emp.fullName}</h4>
                  <p className="text-slate-500 text-[11px]">{emp.designation}</p>
                </div>
                <Badge variant="info" size="sm">
                  {emp.payType}
                </Badge>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#202227] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Base Salary (Annual):</span>
                  <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(emp.salary)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Base:</span>
                  <span>{formatCurrency(Math.round(emp.salary / 12))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Account:</span>
                  <span className="font-mono">{emp.bankAccountNumber || '**** 4819'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payslip View Modal (Printable) */}
      <Dialog
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title="Official Monthly Salary Slip"
        description="Formal payslip statement with itemized earnings and statutory tax deductions."
        maxWidth="2xl"
      >
        {selectedPayslip && (
          <div className="space-y-6 text-xs" id="payslip-modal-content">
            {/* Header / Company Branding */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-[#292B30] pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
                  Apex Global Technologies India Pvt. Ltd.
                </h3>
                <p className="text-slate-500">Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103</p>
                <p className="text-slate-500">CIN: U72200KA2023PTC158941 · GSTIN: 29AABCA1234F1Z5 · Ref: {selectedPayslip.id}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                  {selectedPayslip.payPeriod}
                </span>
                <Badge variant="success" size="sm" className="mt-1">
                  {selectedPayslip.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-md bg-slate-50 dark:bg-[#1D1F23]">
              <div>
                <span className="text-slate-400 text-[10px] block">Employee Name</span>
                <strong className="text-slate-900 dark:text-slate-100">{selectedPayslip.employeeName}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Employee Code</span>
                <span className="font-mono font-medium">{selectedPayslip.employeeCode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Department</span>
                <span>{selectedPayslip.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Designation</span>
                <span>{selectedPayslip.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Permanent Account (PAN)</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{selectedPayslip.panNumber || 'AAAPS1234A'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Universal Account (UAN / EPF)</span>
                <span className="font-mono">{selectedPayslip.uanNumber || '100982347101'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Bank Account No.</span>
                <span className="font-mono">{selectedPayslip.bankAccountNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Bank IFSC Code</span>
                <span className="font-mono">{selectedPayslip.ifscCode || 'HDFC0001234'}</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Earnings Column */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#292B30] pb-1">
                  Earnings
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                    <span>{formatCurrency(selectedPayslip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                    <span>{formatCurrency(selectedPayslip.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Special Allowance</span>
                    <span>{formatCurrency(selectedPayslip.specialAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Conveyance Allowance</span>
                    <span>{formatCurrency(selectedPayslip.conveyanceAllowance)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[#202227] font-bold">
                    <span>Total Gross Earnings</span>
                    <span>{formatCurrency(selectedPayslip.grossEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#292B30] pb-1">
                  Statutory Deductions
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Income Tax (TDS / Sec 192)</span>
                    <span>{formatCurrency(selectedPayslip.incomeTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Employee Provident Fund (EPF 12%)</span>
                    <span>{formatCurrency(selectedPayslip.providentFund)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Professional Tax (PT)</span>
                    <span>{formatCurrency(selectedPayslip.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[#202227] font-bold text-red-600 dark:text-red-400">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(selectedPayslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Callout */}
            <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">
                  Net Salary Transferred
                </span>
                <span className="text-[11px] text-slate-500">Disbursed on {formatDate(selectedPayslip.paymentDate)}</span>
              </div>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-heading">
                {formatCurrency(selectedPayslip.netPayable)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-[#292B30]">
              <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />} onClick={handlePrintSlip}>
                Print Payslip
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Process Payroll Run Modal */}
      <Dialog
        isOpen={isNewRunOpen}
        onClose={() => setIsNewRunOpen(false)}
        title="Initialize New Pay Period"
        description="Create a draft payroll run for workforce salary computation."
      >
        <form onSubmit={handleCreateRun} className="space-y-4">
          <Input
            label="Pay Period Name"
            required
            value={newRunForm.month}
            onChange={(e) => setNewRunForm({ ...newRunForm, month: e.target.value })}
            placeholder="e.g. October 2026"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={newRunForm.startDate}
              onChange={(e) => setNewRunForm({ ...newRunForm, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={newRunForm.endDate}
              onChange={(e) => setNewRunForm({ ...newRunForm, endDate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewRunOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Initialize Draft
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Disburse Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDisburseId}
        onClose={() => setConfirmDisburseId(null)}
        onConfirm={() => {
          if (confirmDisburseId) {
            processPayrollRun(confirmDisburseId);
            setConfirmDisburseId(null);
          }
        }}
        title="Disburse Payroll Run"
        message="Are you sure you want to finalize and disburse this payroll run? This will generate official payslips for all active personnel."
        confirmText="Confirm Disbursement"
        variant="primary"
      />
    </PageTransition>
  );
}
