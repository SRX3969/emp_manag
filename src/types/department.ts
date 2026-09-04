export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description: string;
  managerId?: string;
  managerName?: string;
  managerEmail?: string;
  parentDepartmentId?: string;
  headcount: number;
  annualBudget: number;
  colorHex?: string;
  createdAt: string;
}

export interface OrgNode {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  avatarUrl?: string;
  email: string;
  directReports?: OrgNode[];
}
