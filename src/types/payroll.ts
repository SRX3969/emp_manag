export type PayPeriodStatus = 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface SalaryStructure {
  employeeId: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  specialAllowance: number;
  bonus: number;
  providentFund: number;
  taxDeduction: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  currency: string;
}

export interface PayrollRun {
  id: string;
  organizationId: string;
  payPeriodMonth: string; // e.g. "October 2026"
  payPeriodCode: string; // e.g. "2026-10"
  startDate: string;
  endDate: string;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: PayPeriodStatus;
  processedBy?: string;
  processedAt?: string;
  disbursementDate: string;
}

export interface Payslip {
  id: string;
  organizationId: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  departmentName: string;
  bankAccountNumber?: string;
  panNumber?: string;
  payPeriod: string;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  
  // Earnings
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  bonus: number;
  overtimePay: number;
  grossEarnings: number;

  // Deductions
  providentFund: number;
  incomeTax: number;
  professionalTax: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net Pay
  netPayable: number;
  currency: string;
  generatedAt: string;
}
