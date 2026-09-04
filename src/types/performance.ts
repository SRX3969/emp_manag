export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
export type ReviewCycleStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED';
export type ReviewStatus = 'PENDING_SELF' | 'PENDING_MANAGER' | 'COMPLETED';

export interface PerformanceGoal {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: 'INDIVIDUAL' | 'DEPARTMENTAL' | 'STRATEGIC';
  targetDate: string;
  progressPercent: number;
  status: GoalStatus;
  metrics?: string;
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  organizationId: string;
  cycleName: string; // e.g. "Q3 2026 Appraisal"
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  managerId: string;
  managerName: string;
  selfRating?: number; // 1 to 5
  selfFeedback?: string;
  managerRating?: number; // 1 to 5
  managerFeedback?: string;
  finalRating?: number; // 1 to 5
  status: ReviewStatus;
  submittedAt?: string;
  completedAt?: string;
}
