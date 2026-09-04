export type EmployeeStatus =
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'PROBATION'
  | 'NOTICE_PERIOD'
  | 'INACTIVE'
  | 'TERMINATED';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERN'
  | 'FREELANCER';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type PayType = 'SALARIED' | 'HOURLY';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Employee {
  id: string;
  organizationId: string;
  employeeCode: string; // e.g. EMP-00104
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  emergencyContact: EmergencyContact;

  departmentId: string;
  departmentName: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  joiningDate: string;
  employmentType: EmploymentType;
  workLocation: 'On-site' | 'Remote' | 'Hybrid';
  status: EmployeeStatus;

  salary: number;
  payType: PayType;
  currency: string;
  bankAccountNumber?: string;
  taxIdentificationNumber?: string;

  skills?: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilterParams {
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus | 'ALL';
  employmentType?: EmploymentType | 'ALL';
  managerId?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof Employee;
  sortOrder?: 'asc' | 'desc';
}
