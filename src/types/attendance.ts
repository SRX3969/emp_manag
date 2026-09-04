export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'HALF_DAY'
  | 'WORK_FROM_HOME'
  | 'ON_LEAVE'
  | 'HOLIDAY';

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  clockInTime?: string; // ISO string
  clockOutTime?: string; // ISO string
  totalHours: number;
  status: AttendanceStatus;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  notes?: string;
  ipAddress?: string;
  location?: string;
}

export interface AttendanceCorrectionRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  requestedClockIn: string;
  requestedClockOut: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverId?: string;
  approverNotes?: string;
  createdAt: string;
}
