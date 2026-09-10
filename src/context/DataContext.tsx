import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { AttendanceRecord } from '@/types/attendance';
import { LeaveType, LeaveBalance, LeaveRequest, Holiday } from '@/types/leave';
import { PayrollRun, Payslip } from '@/types/payroll';
import { PerformanceGoal, PerformanceReview } from '@/types/performance';
import { DocumentItem } from '@/types/document';
import { TaskItem, AnnouncementItem, JobOpening, Candidate, AuditLogItem, NotificationItem } from '@/types/system';
import {
  mockEmployees,
  mockDepartments,
  mockAttendanceRecords,
  mockLeaveTypes,
  mockLeaveBalances,
  mockLeaveRequests,
  mockHolidays,
  mockPayrollRuns,
  mockPayslips,
  mockGoals,
  mockReviews,
  mockDocuments,
  mockTasks,
  mockAnnouncements,
  mockJobs,
  mockCandidates,
  mockAuditLogs,
  mockNotifications,
} from '@/data/mockData';
import { useAuth } from './AuthContext';

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  currency: string;
  timezone: string;
  workDays: string[];
  standardWorkHours: number;
  allowRemoteClockIn: boolean;
  autoApproveLeaves: boolean;
  notifyOnLeaveRequest: boolean;
  notifyOnPayrollRun: boolean;
  twoFactorRequired: boolean;
}

const defaultDemoSettings: CompanySettings = {
  companyName: 'Apex Global Technologies India Pvt. Ltd.',
  companyEmail: 'contact@apexglobal.in',
  companyPhone: '+91 (80) 4129-8900',
  companyAddress: 'Prestige Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
  currency: 'INR',
  timezone: 'Asia/Kolkata (IST)',
  workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  standardWorkHours: 8,
  allowRemoteClockIn: true,
  autoApproveLeaves: false,
  notifyOnLeaveRequest: true,
  notifyOnPayrollRun: true,
  twoFactorRequired: true,
};

const defaultCleanLeaveTypes: LeaveType[] = [
  { id: 'lt_1', organizationId: 'org_prod_clean', name: 'Privilege / Earned Leave', code: 'PL', totalDaysPerYear: 18, carryForwardAllowed: true, maxCarryForwardDays: 8, isPaid: true, requiresAttachment: false, colorHex: '#2563EB' },
  { id: 'lt_2', organizationId: 'org_prod_clean', name: 'Casual Leave', code: 'CL', totalDaysPerYear: 12, carryForwardAllowed: false, isPaid: true, requiresAttachment: false, colorHex: '#D97706' },
  { id: 'lt_3', organizationId: 'org_prod_clean', name: 'Sick / Medical Leave', code: 'SL', totalDaysPerYear: 12, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: '#DC2626' },
  { id: 'lt_4', organizationId: 'org_prod_clean', name: 'Maternity Leave', code: 'ML', totalDaysPerYear: 182, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: '#EC4899' },
  { id: 'lt_5', organizationId: 'org_prod_clean', name: 'Paternity Leave', code: 'PTL', totalDaysPerYear: 15, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: '#8B5CF6' },
  { id: 'lt_6', organizationId: 'org_prod_clean', name: 'Compensatory Off', code: 'COMP', totalDaysPerYear: 10, carryForwardAllowed: false, isPaid: true, requiresAttachment: false, colorHex: '#10B981' },
];

interface DataContextType {
  employees: Employee[];
  departments: Department[];
  attendanceRecords: AttendanceRecord[];
  leaveTypes: LeaveType[];
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  holidays: Holiday[];
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  goals: PerformanceGoal[];
  reviews: PerformanceReview[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  announcements: AnnouncementItem[];
  jobs: JobOpening[];
  candidates: Candidate[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  settings: CompanySettings;

  // Actions
  addEmployee: (emp: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addDepartment: (dept: Omit<Department, 'id' | 'createdAt' | 'headcount'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;

  clockIn: (employeeId: string, workMode?: 'On-site' | 'Remote' | 'Hybrid') => void;
  clockOut: (employeeId: string) => void;

  applyLeave: (req: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => void;
  approveLeave: (id: string, comment?: string) => void;
  rejectLeave: (id: string, comment?: string) => void;
  cancelLeave: (id: string) => void;

  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;

  createPayrollRun: (month: string, code: string, startDate: string, endDate: string) => void;
  processPayrollRun: (runId: string) => void;

  addGoal: (goal: Omit<PerformanceGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<PerformanceGoal>) => void;
  submitReview: (id: string, feedback: { rating: number; comments: string; isManager: boolean }) => void;

  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;

  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (id: string, status: TaskItem['status']) => void;

  createAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'publishedAt' | 'readCount'>) => void;
  markAnnouncementRead: (id: string) => void;

  addJob: (job: Omit<JobOpening, 'id' | 'createdAt'>) => void;
  updateCandidateStage: (id: string, stage: Candidate['stage']) => void;
  convertCandidateToEmployee: (candidateId: string, departmentId: string, designation: string, salary: number) => void;

  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, currentOrg } = useAuth();

  const getStorageKey = (key: string) => `emp_data_${currentOrg.id}_${key}`;

  const isDemoOrg = currentOrg.isDemo ?? (currentOrg.id === 'org_001');

  // Load state per organization
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(getStorageKey('employees'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockEmployees : [];
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(getStorageKey('departments'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockDepartments : [];
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(getStorageKey('attendance'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockAttendanceRecords : [];
  });

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(() => {
    const saved = localStorage.getItem(getStorageKey('leaveTypes'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockLeaveTypes : defaultCleanLeaveTypes;
  });

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(() => {
    const saved = localStorage.getItem(getStorageKey('leaveBalances'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockLeaveBalances : [];
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(getStorageKey('leaveRequests'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockLeaveRequests : [];
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem(getStorageKey('holidays'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockHolidays : [];
  });

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => {
    const saved = localStorage.getItem(getStorageKey('payrollRuns'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockPayrollRuns : [];
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem(getStorageKey('payslips'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockPayslips : [];
  });

  const [goals, setGoals] = useState<PerformanceGoal[]>(() => {
    const saved = localStorage.getItem(getStorageKey('goals'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockGoals : [];
  });

  const [reviews, setReviews] = useState<PerformanceReview[]>(() => {
    const saved = localStorage.getItem(getStorageKey('reviews'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockReviews : [];
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('documents'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockDocuments : [];
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('tasks'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockTasks : [];
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('announcements'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockAnnouncements : [];
  });

  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem(getStorageKey('jobs'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockJobs : [];
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(getStorageKey('candidates'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockCandidates : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('auditLogs'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockAuditLogs : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('notifications'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg ? mockNotifications : [];
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem(getStorageKey('settings'));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return isDemoOrg
      ? defaultDemoSettings
      : {
          companyName: currentOrg.name,
          companyEmail: `admin@${currentOrg.slug}.com`,
          companyPhone: '+1 (555) 000-0000',
          companyAddress: 'Corporate Headquarters',
          currency: currentOrg.currency,
          timezone: currentOrg.timezone,
          workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          standardWorkHours: 8,
          allowRemoteClockIn: true,
          autoApproveLeaves: false,
          notifyOnLeaveRequest: true,
          notifyOnPayrollRun: true,
          twoFactorRequired: false,
        };
  });

  // When switching organization, reload state cleanly
  useEffect(() => {
    const savedEmp = localStorage.getItem(getStorageKey('employees'));
    setEmployees(savedEmp ? JSON.parse(savedEmp) : isDemoOrg ? mockEmployees : []);

    const savedDept = localStorage.getItem(getStorageKey('departments'));
    setDepartments(savedDept ? JSON.parse(savedDept) : isDemoOrg ? mockDepartments : []);

    const savedAtt = localStorage.getItem(getStorageKey('attendance'));
    setAttendanceRecords(savedAtt ? JSON.parse(savedAtt) : isDemoOrg ? mockAttendanceRecords : []);

    const savedLt = localStorage.getItem(getStorageKey('leaveTypes'));
    setLeaveTypes(savedLt ? JSON.parse(savedLt) : isDemoOrg ? mockLeaveTypes : defaultCleanLeaveTypes);

    const savedLb = localStorage.getItem(getStorageKey('leaveBalances'));
    setLeaveBalances(savedLb ? JSON.parse(savedLb) : isDemoOrg ? mockLeaveBalances : []);

    const savedLr = localStorage.getItem(getStorageKey('leaveRequests'));
    setLeaveRequests(savedLr ? JSON.parse(savedLr) : isDemoOrg ? mockLeaveRequests : []);

    const savedHol = localStorage.getItem(getStorageKey('holidays'));
    setHolidays(savedHol ? JSON.parse(savedHol) : isDemoOrg ? mockHolidays : []);

    const savedPr = localStorage.getItem(getStorageKey('payrollRuns'));
    setPayrollRuns(savedPr ? JSON.parse(savedPr) : isDemoOrg ? mockPayrollRuns : []);

    const savedPs = localStorage.getItem(getStorageKey('payslips'));
    setPayslips(savedPs ? JSON.parse(savedPs) : isDemoOrg ? mockPayslips : []);

    const savedG = localStorage.getItem(getStorageKey('goals'));
    setGoals(savedG ? JSON.parse(savedG) : isDemoOrg ? mockGoals : []);

    const savedRev = localStorage.getItem(getStorageKey('reviews'));
    setReviews(savedRev ? JSON.parse(savedRev) : isDemoOrg ? mockReviews : []);

    const savedDoc = localStorage.getItem(getStorageKey('documents'));
    setDocuments(savedDoc ? JSON.parse(savedDoc) : isDemoOrg ? mockDocuments : []);

    const savedTasks = localStorage.getItem(getStorageKey('tasks'));
    setTasks(savedTasks ? JSON.parse(savedTasks) : isDemoOrg ? mockTasks : []);

    const savedAnn = localStorage.getItem(getStorageKey('announcements'));
    setAnnouncements(savedAnn ? JSON.parse(savedAnn) : isDemoOrg ? mockAnnouncements : []);

    const savedJobs = localStorage.getItem(getStorageKey('jobs'));
    setJobs(savedJobs ? JSON.parse(savedJobs) : isDemoOrg ? mockJobs : []);

    const savedCand = localStorage.getItem(getStorageKey('candidates'));
    setCandidates(savedCand ? JSON.parse(savedCand) : isDemoOrg ? mockCandidates : []);

    const savedAudit = localStorage.getItem(getStorageKey('auditLogs'));
    setAuditLogs(savedAudit ? JSON.parse(savedAudit) : isDemoOrg ? mockAuditLogs : []);

    const savedNotif = localStorage.getItem(getStorageKey('notifications'));
    setNotifications(savedNotif ? JSON.parse(savedNotif) : isDemoOrg ? mockNotifications : []);

    const savedSet = localStorage.getItem(getStorageKey('settings'));
    setSettings(
      savedSet
        ? JSON.parse(savedSet)
        : isDemoOrg
        ? defaultDemoSettings
        : {
            companyName: currentOrg.name,
            companyEmail: `admin@${currentOrg.slug}.com`,
            companyPhone: '+1 (555) 000-0000',
            companyAddress: 'Corporate Headquarters',
            currency: currentOrg.currency,
            timezone: currentOrg.timezone,
            workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            standardWorkHours: 8,
            allowRemoteClockIn: true,
            autoApproveLeaves: false,
            notifyOnLeaveRequest: true,
            notifyOnPayrollRun: true,
            twoFactorRequired: false,
          }
    );
  }, [currentOrg.id]);

  // Save changes to localStorage per organization cleanly
  useEffect(() => {
    localStorage.setItem(`emp_data_${currentOrg.id}_employees`, JSON.stringify(employees));
    localStorage.setItem(`emp_data_${currentOrg.id}_departments`, JSON.stringify(departments));
    localStorage.setItem(`emp_data_${currentOrg.id}_attendance`, JSON.stringify(attendanceRecords));
    localStorage.setItem(`emp_data_${currentOrg.id}_leaveTypes`, JSON.stringify(leaveTypes));
    localStorage.setItem(`emp_data_${currentOrg.id}_leaveBalances`, JSON.stringify(leaveBalances));
    localStorage.setItem(`emp_data_${currentOrg.id}_leaveRequests`, JSON.stringify(leaveRequests));
    localStorage.setItem(`emp_data_${currentOrg.id}_holidays`, JSON.stringify(holidays));
    localStorage.setItem(`emp_data_${currentOrg.id}_payrollRuns`, JSON.stringify(payrollRuns));
    localStorage.setItem(`emp_data_${currentOrg.id}_payslips`, JSON.stringify(payslips));
    localStorage.setItem(`emp_data_${currentOrg.id}_goals`, JSON.stringify(goals));
    localStorage.setItem(`emp_data_${currentOrg.id}_reviews`, JSON.stringify(reviews));
    localStorage.setItem(`emp_data_${currentOrg.id}_documents`, JSON.stringify(documents));
    localStorage.setItem(`emp_data_${currentOrg.id}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`emp_data_${currentOrg.id}_announcements`, JSON.stringify(announcements));
    localStorage.setItem(`emp_data_${currentOrg.id}_jobs`, JSON.stringify(jobs));
    localStorage.setItem(`emp_data_${currentOrg.id}_candidates`, JSON.stringify(candidates));
    localStorage.setItem(`emp_data_${currentOrg.id}_auditLogs`, JSON.stringify(auditLogs));
    localStorage.setItem(`emp_data_${currentOrg.id}_notifications`, JSON.stringify(notifications));
    localStorage.setItem(`emp_data_${currentOrg.id}_settings`, JSON.stringify(settings));
  }, [
    currentOrg.id,
    employees,
    departments,
    attendanceRecords,
    leaveTypes,
    leaveBalances,
    leaveRequests,
    holidays,
    payrollRuns,
    payslips,
    goals,
    reviews,
    documents,
    tasks,
    announcements,
    jobs,
    candidates,
    auditLogs,
    notifications,
    settings,
  ]);

  const logAction = (action: string, entity: string, details: string, entityId?: string) => {
    const newLog: AuditLogItem = {
      id: `audit_${Date.now()}`,
      organizationId: currentOrg.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `emp_${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      organizationId: currentOrg.id,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees((prev) => [newEmp, ...prev]);

    // Setup leave balances
    const currentYear = new Date().getFullYear();
    const newBalances: LeaveBalance[] = leaveTypes.map((lt) => ({
      id: `bal_${newId}_${lt.id}`,
      organizationId: currentOrg.id,
      employeeId: newId,
      leaveTypeId: lt.id,
      leaveTypeName: lt.name,
      leaveTypeCode: lt.code,
      allocatedDays: lt.totalDaysPerYear,
      usedDays: 0,
      pendingDays: 0,
      remainingDays: lt.totalDaysPerYear,
      year: currentYear,
    }));
    setLeaveBalances((prev) => [...prev, ...newBalances]);

    logAction('EMPLOYEE_CREATED', 'Employee', `Created employee profile for ${newEmp.fullName} (${newEmp.employeeCode})`, newId);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...updates, updatedAt: new Date().toISOString() } : emp
      )
    );
    logAction('EMPLOYEE_UPDATED', 'Employee', `Updated employee profile details for ID: ${id}`, id);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status: 'INACTIVE', updatedAt: new Date().toISOString() } : emp
      )
    );
    logAction('EMPLOYEE_DEACTIVATED', 'Employee', `Deactivated employee profile ID: ${id}`, id);
  };

  const addDepartment = (deptData: Omit<Department, 'id' | 'createdAt' | 'headcount'>) => {
    const newDept: Department = {
      ...deptData,
      organizationId: currentOrg.id,
      id: `dept_${Date.now()}`,
      headcount: 0,
      createdAt: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    logAction('DEPARTMENT_CREATED', 'Department', `Created new department ${newDept.name}`, newDept.id);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === id ? { ...dept, ...updates } : dept))
    );
    logAction('DEPARTMENT_UPDATED', 'Department', `Updated department details for ID: ${id}`, id);
  };

  const clockIn = (employeeId: string, workMode: 'On-site' | 'Remote' | 'Hybrid' = 'On-site') => {
    const targetEmp = employees.find((e) => e.id === employeeId);
    if (!targetEmp) return;
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      organizationId: currentOrg.id,
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      employeeCode: targetEmp.employeeCode,
      departmentName: targetEmp.departmentName,
      date: today,
      clockInTime: new Date().toISOString(),
      totalHours: 0,
      status: 'PRESENT',
      workMode,
      location: workMode === 'Remote' ? 'Remote Office' : 'HQ Building',
    };
    setAttendanceRecords((prev) => [newRecord, ...prev.filter((r) => !(r.employeeId === employeeId && r.date === today))]);
    logAction('ATTENDANCE_CLOCK_IN', 'Attendance', `${targetEmp.fullName} clocked in (${workMode})`, newRecord.id);
  };

  const clockOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.employeeId === employeeId && r.date === today && r.clockInTime) {
          const clockInDate = new Date(r.clockInTime);
          const now = new Date();
          const diffHours = Math.max(0.1, Number(((now.getTime() - clockInDate.getTime()) / (1000 * 60 * 60)).toFixed(1)));
          return {
            ...r,
            clockOutTime: now.toISOString(),
            totalHours: diffHours,
          };
        }
        return r;
      })
    );
    logAction('ATTENDANCE_CLOCK_OUT', 'Attendance', `Employee ID: ${employeeId} clocked out`);
  };

  const applyLeave = (reqData: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...reqData,
      organizationId: currentOrg.id,
      id: `lr_${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    setLeaveRequests((prev) => [newReq, ...prev]);

    // Update pending balance
    setLeaveBalances((prev) =>
      prev.map((b) =>
        b.employeeId === reqData.employeeId && b.leaveTypeId === reqData.leaveTypeId
          ? { ...b, pendingDays: b.pendingDays + reqData.totalDays }
          : b
      )
    );

    logAction('LEAVE_APPLIED', 'Leave', `Leave request submitted by ${reqData.employeeName} (${reqData.totalDays} days)`, newReq.id);
  };

  const approveLeave = (id: string, comment?: string) => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              approverId: currentUser.id,
              approverName: currentUser.name,
              approverComment: comment || 'Approved by Manager',
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );

    // Deduct balance
    setLeaveBalances((prev) =>
      prev.map((b) =>
        b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId
          ? {
              ...b,
              usedDays: b.usedDays + req.totalDays,
              pendingDays: Math.max(0, b.pendingDays - req.totalDays),
              remainingDays: Math.max(0, b.remainingDays - req.totalDays),
            }
          : b
      )
    );

    // Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      organizationId: currentOrg.id,
      userId: req.employeeId,
      title: 'Leave Request Approved',
      message: `Your ${req.leaveTypeName} request for ${req.startDate} to ${req.endDate} was approved.`,
      type: 'LEAVE',
      isRead: false,
      linkUrl: '/leave',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAction('LEAVE_APPROVED', 'Leave', `Approved leave request for ${req.employeeName}`, id);
  };

  const rejectLeave = (id: string, comment?: string) => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              approverId: currentUser.id,
              approverName: currentUser.name,
              approverComment: comment || 'Rejected by Manager',
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setLeaveBalances((prev) =>
      prev.map((b) =>
        b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId
          ? { ...b, pendingDays: Math.max(0, b.pendingDays - req.totalDays) }
          : b
      )
    );

    logAction('LEAVE_REJECTED', 'Leave', `Rejected leave request for ${req.employeeName}`, id);
  };

  const cancelLeave = (id: string) => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r)));

    setLeaveBalances((prev) =>
      prev.map((b) => {
        if (b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId) {
          if (req.status === 'APPROVED') {
            return {
              ...b,
              usedDays: Math.max(0, b.usedDays - req.totalDays),
              remainingDays: b.remainingDays + req.totalDays,
            };
          }
          return { ...b, pendingDays: Math.max(0, b.pendingDays - req.totalDays) };
        }
        return b;
      })
    );

    logAction('LEAVE_CANCELLED', 'Leave', `Cancelled leave request for ${req.employeeName}`, id);
  };

  const addHoliday = (holidayData: Omit<Holiday, 'id'>) => {
    const newHol: Holiday = {
      ...holidayData,
      organizationId: currentOrg.id,
      id: `hol_${Date.now()}`,
    };
    setHolidays((prev) => [...prev, newHol]);
    logAction('HOLIDAY_ADDED', 'Holiday', `Added holiday: ${newHol.name} (${newHol.date})`, newHol.id);
  };

  const updateHoliday = (id: string, updates: Partial<Holiday>) => {
    setHolidays((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    logAction('HOLIDAY_UPDATED', 'Holiday', `Updated holiday ID: ${id}`, id);
  };

  const deleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    logAction('HOLIDAY_DELETED', 'Holiday', `Deleted holiday ID: ${id}`, id);
  };

  const createPayrollRun = (month: string, code: string, startDate: string, endDate: string) => {
    const activeEmployees = employees.filter((e) => e.status !== 'INACTIVE');
    const totalGross = activeEmployees.reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const totalDeductions = Math.round(totalGross * 0.15);
    const totalNet = totalGross - totalDeductions;

    const newRun: PayrollRun = {
      id: `run_${Date.now()}`,
      organizationId: currentOrg.id,
      payPeriodMonth: month,
      payPeriodCode: code,
      startDate,
      endDate,
      totalEmployees: activeEmployees.length,
      totalGross,
      totalDeductions,
      totalNet,
      status: 'DRAFT',
      processedBy: currentUser.name,
      processedAt: new Date().toISOString(),
      disbursementDate: endDate,
    };
    setPayrollRuns((prev) => [newRun, ...prev]);
    logAction('PAYROLL_RUN_CREATED', 'Payroll', `Created draft payroll run ${code} for ${month}`, newRun.id);
  };

  const processPayrollRun = (runId: string) => {
    const run = payrollRuns.find((r) => r.id === runId);
    if (!run) return;

    setPayrollRuns((prev) =>
      prev.map((r) => (r.id === runId ? { ...r, status: 'COMPLETED', processedAt: new Date().toISOString() } : r))
    );

    // Generate payslips
    const activeEmployees = employees.filter((e) => e.status !== 'INACTIVE');
    const newPayslips: Payslip[] = activeEmployees.map((emp) => {
      const basic = emp.salary || 50000;
      const hra = Math.round(basic * 0.4);
      const conveyance = 1600;
      const medical = 1250;
      const special = Math.round(basic * 0.15);
      const gross = basic + hra + conveyance + medical + special;

      const pf = Math.round(basic * 0.12);
      const tax = Math.round(gross * 0.1);
      const pt = 200;
      const deductions = pf + tax + pt;
      const net = gross - deductions;

      return {
        id: `ps_${Date.now()}_${emp.id}`,
        organizationId: currentOrg.id,
        payrollRunId: runId,
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        departmentName: emp.departmentName,
        bankAccountNumber: emp.bankAccountNumber || '•••• 8921',
        panNumber: emp.panNumber || emp.taxIdentificationNumber || 'AAAPS1234A',
        uanNumber: emp.uanNumber || '100982347101',
        ifscCode: emp.ifscCode || 'HDFC0001234',
        payPeriod: run.payPeriodMonth,
        paymentDate: run.disbursementDate,
        paymentStatus: 'PAID',
        basicSalary: basic,
        hra,
        conveyanceAllowance: conveyance,
        medicalAllowance: medical,
        specialAllowance: special,
        bonus: 0,
        overtimePay: 0,
        grossEarnings: gross,
        providentFund: pf,
        incomeTax: tax,
        professionalTax: pt,
        otherDeductions: 0,
        totalDeductions: deductions,
        netPayable: net,
        currency: emp.currency || 'INR',
        generatedAt: new Date().toISOString(),
      };
    });

    setPayslips((prev) => [...newPayslips, ...prev]);

    // Send notifications to all active employees
    const notificationsToAdd: NotificationItem[] = activeEmployees.map((emp) => ({
      id: `notif_pay_${Date.now()}_${emp.id}`,
      organizationId: currentOrg.id,
      userId: emp.id,
      title: `Payslip Disbursed: ${run.payPeriodMonth}`,
      message: `Your payslip for ${run.payPeriodMonth} is now available in your personal portal.`,
      type: 'PAYROLL',
      isRead: false,
      linkUrl: '/payroll',
      createdAt: new Date().toISOString(),
    }));
    setNotifications((prev) => [...notificationsToAdd, ...prev]);

    logAction('PAYROLL_DISBURSED', 'Payroll', `Disbursed payroll for run ${run.payPeriodCode} to ${activeEmployees.length} employees`, runId);
  };

  const addGoal = (goalData: Omit<PerformanceGoal, 'id' | 'createdAt'>) => {
    const newGoal: PerformanceGoal = {
      ...goalData,
      organizationId: currentOrg.id,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    logAction('GOAL_CREATED', 'Performance', `Created performance goal: "${newGoal.title}" for ${newGoal.employeeName}`, newGoal.id);
  };

  const updateGoal = (id: string, updates: Partial<PerformanceGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    logAction('GOAL_UPDATED', 'Performance', `Updated goal progress/status for ID: ${id}`, id);
  };

  const submitReview = (id: string, feedback: { rating: number; comments: string; isManager: boolean }) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (feedback.isManager) {
            return {
              ...r,
              managerRating: feedback.rating,
              managerFeedback: feedback.comments,
              finalRating: feedback.rating,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
            };
          }
          return {
            ...r,
            selfRating: feedback.rating,
            selfFeedback: feedback.comments,
            status: 'PENDING_MANAGER',
            submittedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    logAction('REVIEW_SUBMITTED', 'Performance', `Submitted ${feedback.isManager ? 'manager' : 'self'} review for ID: ${id}`, id);
  };

  const uploadDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      organizationId: currentOrg.id,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAction('DOCUMENT_UPLOADED', 'Document', `Uploaded ${newDoc.category} document: ${newDoc.name}`, newDoc.id);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    logAction('DOCUMENT_DELETED', 'Document', `Deleted document ID: ${id}`, id);
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      organizationId: currentOrg.id,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // Send notification to assignee
    const newNotif: NotificationItem = {
      id: `notif_task_${Date.now()}`,
      organizationId: currentOrg.id,
      userId: newTask.assigneeId,
      title: 'New Task Assigned',
      message: `You were assigned: "${newTask.title}" (Due: ${newTask.dueDate})`,
      type: 'TASK',
      isRead: false,
      linkUrl: '/tasks',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAction('TASK_CREATED', 'Task', `Created task: "${newTask.title}" assigned to ${newTask.assigneeName}`, newTask.id);
  };

  const updateTaskStatus = (id: string, status: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    logAction('TASK_STATUS_UPDATED', 'Task', `Updated task ${id} status to ${status}`, id);
  };

  const createAnnouncement = (annData: Omit<AnnouncementItem, 'id' | 'publishedAt' | 'readCount'>) => {
    const newAnn: AnnouncementItem = {
      ...annData,
      organizationId: currentOrg.id,
      id: `ann_${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      readCount: 0,
      readByUserIds: [],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Notify all
    const newNotif: NotificationItem = {
      id: `notif_ann_${Date.now()}`,
      organizationId: currentOrg.id,
      userId: 'all',
      title: `Announcement: ${newAnn.title}`,
      message: newAnn.content.slice(0, 90) + '...',
      type: 'ANNOUNCEMENT',
      isRead: false,
      linkUrl: '/announcements',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAction('ANNOUNCEMENT_PUBLISHED', 'Announcement', `Published company announcement: "${newAnn.title}"`, newAnn.id);
  };

  const markAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const reads = a.readByUserIds || [];
          if (!reads.includes(currentUser.id)) {
            return {
              ...a,
              readCount: a.readCount + 1,
              readByUserIds: [...reads, currentUser.id],
            };
          }
        }
        return a;
      })
    );
  };

  const addJob = (jobData: Omit<JobOpening, 'id' | 'createdAt'>) => {
    const newJob: JobOpening = {
      ...jobData,
      organizationId: currentOrg.id,
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    logAction('JOB_POSTED', 'Recruitment', `Posted new job opening: "${newJob.title}" in ${newJob.departmentName}`, newJob.id);
  };

  const updateCandidateStage = (id: string, stage: Candidate['stage']) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
    logAction('CANDIDATE_STAGE_UPDATED', 'Recruitment', `Updated candidate ${id} stage to ${stage}`, id);
  };

  const convertCandidateToEmployee = (candidateId: string, departmentId: string, designation: string, salary: number) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const dept = departments.find((d) => d.id === departmentId);
    const [firstName, ...rest] = cand.fullName.split(' ');
    const lastName = rest.join(' ') || 'Employee';

    const empCode = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      organizationId: currentOrg.id,
      employeeCode: empCode,
      firstName,
      lastName,
      fullName: cand.fullName,
      email: cand.email,
      phone: cand.phone,
      gender: 'PREFER_NOT_TO_SAY',
      dateOfBirth: '1995-01-01',
      address: 'On file',
      city: 'Headquarters City',
      country: 'United States',
      postalCode: '10001',
      emergencyContact: {
        name: 'Primary Contact',
        relationship: 'Family',
        phone: cand.phone,
      },
      departmentId,
      departmentName: dept?.name || 'Engineering',
      designation,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'FULL_TIME',
      workLocation: 'On-site',
      status: 'ACTIVE',
      salary,
      payType: 'SALARIED',
      currency: currentOrg.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, stage: 'HIRED' } : c)));

    // Setup leave balances
    const currentYear = new Date().getFullYear();
    const newBalances: LeaveBalance[] = leaveTypes.map((lt) => ({
      id: `bal_${newEmp.id}_${lt.id}`,
      organizationId: currentOrg.id,
      employeeId: newEmp.id,
      leaveTypeId: lt.id,
      leaveTypeName: lt.name,
      leaveTypeCode: lt.code,
      allocatedDays: lt.totalDaysPerYear,
      usedDays: 0,
      pendingDays: 0,
      remainingDays: lt.totalDaysPerYear,
      year: currentYear,
    }));
    setLeaveBalances((prev) => [...prev, ...newBalances]);

    logAction('CANDIDATE_CONVERTED', 'Employee', `Converted candidate ${cand.fullName} into employee ${empCode}`, newEmp.id);
  };

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('SETTINGS_UPDATED', 'Settings', 'Updated company settings and workplace policies');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        departments,
        attendanceRecords,
        leaveTypes,
        leaveBalances,
        leaveRequests,
        holidays,
        payrollRuns,
        payslips,
        goals,
        reviews,
        documents,
        tasks,
        announcements,
        jobs,
        candidates,
        auditLogs,
        notifications,
        settings,

        addEmployee,
        updateEmployee,
        deleteEmployee,

        addDepartment,
        updateDepartment,

        clockIn,
        clockOut,

        applyLeave,
        approveLeave,
        rejectLeave,
        cancelLeave,

        addHoliday,
        updateHoliday,
        deleteHoliday,

        createPayrollRun,
        processPayrollRun,

        addGoal,
        updateGoal,
        submitReview,

        uploadDocument,
        deleteDocument,

        addTask,
        updateTaskStatus,

        createAnnouncement,
        markAnnouncementRead,

        addJob,
        updateCandidateStage,
        convertCandidateToEmployee,

        updateSettings,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
