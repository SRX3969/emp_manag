export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskItem {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  creatorId: string;
  creatorName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  tags?: string[];
  createdAt: string;
  completedAt?: string;
}

export interface AnnouncementItem {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'POLICY' | 'EVENT' | 'URGENT';
  authorId: string;
  authorName: string;
  authorDesignation: string;
  isPinned: boolean;
  publishedAt: string;
  readCount: number;
  readByUserIds?: string[];
}

export type CandidateStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export interface JobOpening {
  id: string;
  organizationId: string;
  title: string;
  departmentId: string;
  departmentName: string;
  location: string;
  employmentType: string;
  openPositions: number;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  experienceLevel: string;
  salaryRange: string;
  description: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  organizationId: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  yearsOfExperience: number;
  stage: CandidateStage;
  resumeUrl?: string;
  rating?: number; // 1 to 5
  notes?: string;
  appliedDate: string;
}

export interface AuditLogItem {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "EMPLOYEE_CREATED", "LEAVE_APPROVED", "SALARY_UPDATED"
  entity: string; // "Employee", "LeaveRequest", "Payroll", "Settings"
  entityId?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'LEAVE' | 'PAYROLL' | 'TASK' | 'ANNOUNCEMENT' | 'PERFORMANCE' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}
