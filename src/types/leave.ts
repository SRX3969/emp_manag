export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveType {
  id: string;
  organizationId: string;
  name: string; // e.g. "Annual Leave", "Casual Leave", "Sick Leave"
  code: string; // "AL", "CL", "SL"
  totalDaysPerYear: number;
  carryForwardAllowed: boolean;
  maxCarryForwardDays?: number;
  isPaid: boolean;
  requiresAttachment: boolean;
  colorHex: string;
}

export interface LeaveBalance {
  id: string;
  organizationId: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  year: number;
}

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  isHalfDay: boolean;
  halfDaySession?: 'FIRST_HALF' | 'SECOND_HALF';
  reason: string;
  status: LeaveRequestStatus;
  appliedOn: string;
  approverId?: string;
  approverName?: string;
  approverComment?: string;
  approvedAt?: string;
  attachmentUrl?: string;
}

export interface Holiday {
  id: string;
  organizationId: string;
  name: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  type: 'PUBLIC' | 'OPTIONAL' | 'COMPANY';
  year: number;
  description?: string;
}
