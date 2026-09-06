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
  Sparkles,
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
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-[#242838]">
              {payrollRuns.map((run) => (
                <div
                  key={run.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 dark:hover:bg-[#1A1C26]/40 transition-colors"
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
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Gross Total</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(run.totalGross)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Deductions</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        -{formatCurrency(run.totalDeductions)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Net Disbursed</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
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
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-[#242838] flex items-center justify-between bg-slate-50/50 dark:bg-[#161822]/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
              Generated Payslips ({visiblePayslips.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#242838]">
            {visiblePayslips.map((slip) => (
              <div
                key={slip.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-[#1A1C26]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
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
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Net Pay</span>
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
              className="p-5 rounded-2xl border border-slate-200 bg-white dark:border-[#242838] dark:bg-[#12131A] shadow-sm text-xs space-y-3 hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 font-heading">{emp.fullName}</h4>
                  <p className="text-slate-500 text-[11px]">{emp.designation}</p>
                </div>
                <Badge variant="info" size="sm">
                  {emp.payType}
                </Badge>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#242838] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Base Salary (Annual):</span>
                  <strong className="text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(emp.salary)}</strong>
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-[#242838] pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
                  Apex Global Technologies India Pvt. Ltd.
                </h3>
                <p className="text-slate-500">Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103</p>
                <p className="text-slate-500 break-words">CIN: U72200KA2023PTC158941 · GSTIN: 29AABCA1234F1Z5 · Ref: {selectedPayslip.id}</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block font-heading">
                  {selectedPayslip.payPeriod}
                </span>
                <Badge variant="success" size="sm" className="mt-1" dot>
                  {selectedPayslip.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838]">
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Employee Name</span>
                <strong className="text-slate-900 dark:text-slate-100">{selectedPayslip.employeeName}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Employee Code</span>
                <span className="font-mono font-medium">{selectedPayslip.employeeCode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Department</span>
                <span>{selectedPayslip.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Designation</span>
                <span>{selectedPayslip.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Permanent Account (PAN)</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{selectedPayslip.panNumber || 'AAAPS1234A'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Universal Account (UAN / EPF)</span>
                <span className="font-mono">{selectedPayslip.uanNumber || '100982347101'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Bank Account No.</span>
                <span className="font-mono">{selectedPayslip.bankAccountNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono uppercase">Bank IFSC Code</span>
                <span className="font-mono">{selectedPayslip.ifscCode || 'HDFC0001234'}</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Earnings Column */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#242838] pb-1 font-heading">
                  Earnings
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Special Allowance</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.specialAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Conveyance Allowance</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.conveyanceAllowance)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[#242838] font-bold text-slate-900 dark:text-white">
                    <span>Total Gross Earnings</span>
                    <span>{formatCurrency(selectedPayslip.grossEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#242838] pb-1 font-heading">
                  Statutory Deductions
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Income Tax (TDS / Sec 192)</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.incomeTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Employee Provident Fund (EPF 12%)</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.providentFund)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Professional Tax (PT)</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[#242838] font-bold text-rose-600 dark:text-rose-400">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(selectedPayslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Callout */}
            <div className="p-4.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold block">
                  Net Salary Transferred
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Disbursed on {formatDate(selectedPayslip.paymentDate)}</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 font-heading">
                {formatCurrency(selectedPayslip.netPayable)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-[#242838]">
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

      {/* New Payroll Run Modal */}
      <Dialog
        isOpen={isNewRunOpen}
        onClose={() => setIsNewRunOpen(false)}
        title="Initialize New Payroll Run"
        description="Compile monthly earnings, calculate statutory deductions, and generate payslips for all active employees."
        maxWidth="md"
      >
        <form onSubmit={handleCreateRun} className="space-y-4">
          <Input
            label="Pay Period Description"
            value={newRunForm.month}
            onChange={(e) => setNewRunForm({ ...newRunForm, month: e.target.value })}
            placeholder="e.g. October 2026"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Period Code"
              value={newRunForm.code}
              onChange={(e) => setNewRunForm({ ...newRunForm, code: e.target.value })}
              placeholder="2026-10"
              required
            />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Headcount
              </label>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-[#242838] bg-slate-50 dark:bg-[#1A1C26] text-xs font-semibold text-slate-800 dark:text-slate-200">
                {employees.filter((e) => e.status !== 'INACTIVE').length} Active Employees
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newRunForm.startDate}
              onChange={(e) => setNewRunForm({ ...newRunForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newRunForm.endDate}
              onChange={(e) => setNewRunForm({ ...newRunForm, endDate: e.target.value })}
              required
            />
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-300">
            <p className="font-semibold mb-0.5">Automated Deduction Audit:</p>
            <p>
              EPF (12%), Professional Tax (₹200), and Income Tax TDS bands will be calculated based on each employee's salary structure.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#242838]">
            <Button variant="outline" type="button" onClick={() => setIsNewRunOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Generate Draft Run
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Disburse Run Modal */}
      <ConfirmDialog
        isOpen={!!confirmDisburseId}
        onClose={() => setConfirmDisburseId(null)}
        onConfirm={() => {
          if (confirmDisburseId) {
            processPayrollRun(confirmDisburseId);
            setConfirmDisburseId(null);
          }
        }}
        title="Authorize Salary Disbursement"
        message="Are you sure you want to mark this payroll run as completed and disburse salaries? Individual payslips will be made available to all active personnel."
        confirmText="Authorize & Disburse"
        variant="primary"
      />
    </PageTransition>
  );
}
