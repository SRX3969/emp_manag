import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '@/types/employee';
import { Department } from '@/types/department';
import { AttendanceRecord, AttendanceCorrectionRequest } from '@/types/attendance';
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

interface CompanySettings {
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

const defaultSettings: CompanySettings = {
  companyName: 'Apex Global Technologies Ltd.',
  companyEmail: 'contact@apexglobal.com',
  companyPhone: '+1 (555) 019-2834',
  companyAddress: '450 Lexington Avenue, Floor 18, New York, NY 10017',
  currency: 'USD',
  timezone: 'America/New_York (EST)',
  workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  standardWorkHours: 8,
  allowRemoteClockIn: true,
  autoApproveLeaves: false,
  notifyOnLeaveRequest: true,
  notifyOnPayrollRun: true,
  twoFactorRequired: true,
};

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
  const { currentUser } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(mockLeaveTypes);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(mockPayrollRuns);
  const [payslips, setPayslips] = useState<Payslip[]>(mockPayslips);
  const [goals, setGoals] = useState<PerformanceGoal[]>(mockGoals);
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(mockAnnouncements);
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  const logAction = (action: string, entity: string, details: string, entityId?: string) => {
    const newLog: AuditLogItem = {
      id: `audit_${Date.now()}`,
      organizationId: currentUser.organizationId,
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
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees((prev) => [newEmp, ...prev]);
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
    // Soft deactivate per enterprise requirement
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
      organizationId: targetEmp.organizationId,
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
    logAction('ATTENDANCE_CLOCK_OUT', 'Attendance', `Clocked out for employee ID: ${employeeId}`);
  };

  const applyLeave = (reqData: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...reqData,
      id: `lr_${Date.now()}`,
      appliedOn: new Date().toISOString(),
      status: 'PENDING',
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    logAction('LEAVE_APPLIED', 'LeaveRequest', `Submitted ${newReq.leaveTypeName} request (${newReq.startDate} to ${newReq.endDate}) by ${newReq.employeeName}`, newReq.id);
  };

  const approveLeave = (id: string, comment?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              approverId: currentUser.id,
              approverName: currentUser.name,
              approverComment: comment || 'Approved',
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );
    logAction('LEAVE_APPROVED', 'LeaveRequest', `Approved leave request ID: ${id}`, id);
  };

  const rejectLeave = (id: string, comment?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              approverId: currentUser.id,
              approverName: currentUser.name,
              approverComment: comment || 'Rejected',
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );
    logAction('LEAVE_REJECTED', 'LeaveRequest', `Rejected leave request ID: ${id}`, id);
  };

  const cancelLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
    );
    logAction('LEAVE_CANCELLED', 'LeaveRequest', `Cancelled leave request ID: ${id}`, id);
  };

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    const newHol: Holiday = { ...holiday, id: `hol_${Date.now()}` };
    setHolidays((prev) => [...prev, newHol]);
    logAction('HOLIDAY_ADDED', 'Holiday', `Added official holiday: ${newHol.name} on ${newHol.date}`, newHol.id);
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
    const newRun: PayrollRun = {
      id: `pr_${code.replace('-', '_')}`,
      organizationId: currentUser.organizationId,
      payPeriodMonth: month,
      payPeriodCode: code,
      startDate,
      endDate,
      totalEmployees: employees.filter((e) => e.status === 'ACTIVE').length,
      totalGross: 865000,
      totalDeductions: 181650,
      totalNet: 683350,
      status: 'DRAFT',
      disbursementDate: endDate,
    };
    setPayrollRuns((prev) => [newRun, ...prev]);
    logAction('PAYROLL_RUN_CREATED', 'PayrollRun', `Created draft payroll run for ${month}`, newRun.id);
  };

  const processPayrollRun = (runId: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'COMPLETED',
              processedBy: currentUser.name,
              processedAt: new Date().toISOString(),
            }
          : r
      )
    );
    logAction('PAYROLL_DISBURSED', 'PayrollRun', `Processed and disbursed payroll run ID: ${runId}`, runId);
  };

  const addGoal = (goalData: Omit<PerformanceGoal, 'id' | 'createdAt'>) => {
    const newGoal: PerformanceGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    logAction('GOAL_CREATED', 'PerformanceGoal', `Created goal: ${newGoal.title}`, newGoal.id);
  };

  const updateGoal = (id: string, updates: Partial<PerformanceGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    logAction('GOAL_UPDATED', 'PerformanceGoal', `Updated goal ID: ${id}`, id);
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
              finalRating: Number((( (r.selfRating || feedback.rating) + feedback.rating ) / 2).toFixed(1)),
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
            };
          } else {
            return {
              ...r,
              selfRating: feedback.rating,
              selfFeedback: feedback.comments,
              status: 'PENDING_MANAGER',
              submittedAt: new Date().toISOString(),
            };
          }
        }
        return r;
      })
    );
    logAction('PERFORMANCE_REVIEW_SUBMITTED', 'PerformanceReview', `Submitted review evaluation for ID: ${id}`, id);
  };

  const uploadDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAction('DOCUMENT_UPLOADED', 'Document', `Uploaded document: ${newDoc.name} (${newDoc.category})`, newDoc.id);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    logAction('DOCUMENT_DELETED', 'Document', `Deleted document ID: ${id}`, id);
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logAction('TASK_CREATED', 'Task', `Assigned task: ${newTask.title} to ${newTask.assigneeName}`, newTask.id);
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
    logAction('TASK_STATUS_CHANGED', 'Task', `Updated task ID: ${id} status to ${status}`, id);
  };

  const createAnnouncement = (annData: Omit<AnnouncementItem, 'id' | 'publishedAt' | 'readCount'>) => {
    const newAnn: AnnouncementItem = {
      ...annData,
      id: `ann_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      readCount: 0,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAction('ANNOUNCEMENT_PUBLISHED', 'Announcement', `Published notice: ${newAnn.title}`, newAnn.id);
  };

  const markAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, readCount: a.readCount + 1 } : a))
    );
  };

  const addJob = (jobData: Omit<JobOpening, 'id' | 'createdAt'>) => {
    const newJob: JobOpening = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
    logAction('JOB_POSTED', 'JobOpening', `Posted job opening: ${newJob.title}`, newJob.id);
  };

  const updateCandidateStage = (id: string, stage: Candidate['stage']) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
    logAction('CANDIDATE_STAGE_UPDATED', 'Candidate', `Moved candidate ID: ${id} to stage ${stage}`, id);
  };

  const convertCandidateToEmployee = (
    candidateId: string,
    departmentId: string,
    designation: string,
    salary: number
  ) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    const department = departments.find((d) => d.id === departmentId);
    const names = candidate.fullName.split(' ');
    const firstName = names[0] || candidate.fullName;
    const lastName = names.slice(1).join(' ') || 'Employee';

    addEmployee({
      organizationId: currentUser.organizationId,
      employeeCode: `EMP-00${String(employees.length + 101)}`,
      firstName,
      lastName,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      gender: 'PREFER_NOT_TO_SAY',
      dateOfBirth: '1995-01-01',
      address: 'Corporate Headquarters',
      city: 'New York',
      country: 'United States',
      postalCode: '10001',
      emergencyContact: {
        name: 'Contact on file',
        relationship: 'Other',
        phone: candidate.phone,
      },
      departmentId,
      departmentName: department?.name || 'General',
      designation,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'FULL_TIME',
      workLocation: 'Hybrid',
      status: 'PROBATION',
      salary,
      payType: 'SALARIED',
      currency: 'USD',
    });

    updateCandidateStage(candidateId, 'HIRED');
  };

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('SETTINGS_UPDATED', 'Settings', 'Updated organization configuration settings');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
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
