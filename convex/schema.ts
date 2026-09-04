import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    currency: v.string(),
    fiscalYearStart: v.string(),
    timezone: v.string(),
    createdAt: v.string(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    organizationId: v.id("organizations"),
    clerkUserId: v.optional(v.string()),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("SUPER_ADMIN"),
      v.literal("HR_ADMIN"),
      v.literal("MANAGER"),
      v.literal("EMPLOYEE")
    ),
    employeeId: v.optional(v.string()),
    departmentId: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_org", ["organizationId"])
    .index("by_email", ["email"]),

  departments: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    code: v.string(),
    description: v.string(),
    managerId: v.optional(v.string()),
    managerName: v.optional(v.string()),
    managerEmail: v.optional(v.string()),
    parentDepartmentId: v.optional(v.string()),
    headcount: v.number(),
    annualBudget: v.number(),
    colorHex: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_org", ["organizationId"]),

  employees: defineTable({
    organizationId: v.id("organizations"),
    employeeCode: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    avatarUrl: v.optional(v.string()),
    gender: v.string(),
    dateOfBirth: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    postalCode: v.string(),
    emergencyContact: v.object({
      name: v.string(),
      relationship: v.string(),
      phone: v.string(),
      email: v.optional(v.string()),
    }),
    departmentId: v.string(),
    departmentName: v.string(),
    designation: v.string(),
    managerId: v.optional(v.string()),
    managerName: v.optional(v.string()),
    joiningDate: v.string(),
    employmentType: v.string(), // FULL_TIME, PART_TIME, etc.
    workLocation: v.string(), // On-site, Remote, Hybrid
    status: v.string(), // ACTIVE, ON_LEAVE, PROBATION, NOTICE_PERIOD, INACTIVE, TERMINATED
    salary: v.number(),
    payType: v.string(), // SALARIED, HOURLY
    currency: v.string(),
    bankAccountNumber: v.optional(v.string()),
    taxIdentificationNumber: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_org", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_code", ["employeeCode"])
    .index("by_department", ["departmentId"])
    .index("by_status", ["status"]),

  attendance: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.string(),
    employeeName: v.string(),
    employeeCode: v.string(),
    departmentName: v.string(),
    date: v.string(), // YYYY-MM-DD
    clockInTime: v.optional(v.string()),
    clockOutTime: v.optional(v.string()),
    totalHours: v.number(),
    status: v.string(), // PRESENT, ABSENT, LATE, HALF_DAY, WORK_FROM_HOME, ON_LEAVE, HOLIDAY
    workMode: v.string(),
    notes: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    location: v.optional(v.string()),
  })
    .index("by_org_date", ["organizationId", "date"])
    .index("by_employee_date", ["employeeId", "date"]),

  attendanceCorrections: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.string(),
    employeeName: v.string(),
    date: v.string(),
    requestedClockIn: v.string(),
    requestedClockOut: v.string(),
    reason: v.string(),
    status: v.string(), // PENDING, APPROVED, REJECTED
    approverId: v.optional(v.string()),
    approverNotes: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_org", ["organizationId"]),

  leaveTypes: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    code: v.string(),
    totalDaysPerYear: v.number(),
    carryForwardAllowed: v.boolean(),
    maxCarryForwardDays: v.optional(v.number()),
    isPaid: v.boolean(),
    requiresAttachment: v.boolean(),
    colorHex: v.string(),
  }).index("by_org", ["organizationId"]),

  leaveBalances: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.string(),
    leaveTypeId: v.string(),
    leaveTypeName: v.string(),
    leaveTypeCode: v.string(),
    allocatedDays: v.number(),
    usedDays: v.number(),
    pendingDays: v.number(),
    remainingDays: v.number(),
    year: v.number(),
  })
    .index("by_employee_year", ["employeeId", "year"])
    .index("by_org", ["organizationId"]),

  leaveRequests: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.string(),
    employeeName: v.string(),
    employeeCode: v.string(),
    departmentName: v.string(),
    leaveTypeId: v.string(),
    leaveTypeName: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    isHalfDay: v.boolean(),
    halfDaySession: v.optional(v.string()),
    reason: v.string(),
    status: v.string(), // PENDING, APPROVED, REJECTED, CANCELLED
    appliedOn: v.string(),
    approverId: v.optional(v.string()),
    approverName: v.optional(v.string()),
    approverComment: v.optional(v.string()),
    approvedAt: v.optional(v.string()),
    attachmentUrl: v.optional(v.string()),
  })
    .index("by_org", ["organizationId"])
    .index("by_employee", ["employeeId"])
    .index("by_status", ["status"]),

  holidays: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    date: v.string(),
    dayOfWeek: v.string(),
    type: v.string(), // PUBLIC, OPTIONAL, COMPANY
    year: v.number(),
    description: v.optional(v.string()),
  })
    .index("by_org_year", ["organizationId", "year"])
    .index("by_date", ["date"]),

  payrollRuns: defineTable({
    organizationId: v.id("organizations"),
    payPeriodMonth: v.string(),
    payPeriodCode: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalEmployees: v.number(),
    totalGross: v.number(),
    totalDeductions: v.number(),
    totalNet: numberValue(),
    status: v.string(), // DRAFT, PROCESSING, COMPLETED, CANCELLED
    processedBy: v.optional(v.string()),
    processedAt: v.optional(v.string()),
    disbursementDate: v.string(),
  }).index("by_org", ["organizationId"]),

  payslips: defineTable({
    organizationId: v.id("organizations"),
    payrollRunId: v.string(),
    employeeId: v.string(),
    employeeName: v.string(),
    employeeCode: v.string(),
    designation: v.string(),
    departmentName: v.string(),
    bankAccountNumber: v.optional(v.string()),
    panNumber: v.optional(v.string()),
    payPeriod: v.string(),
    paymentDate: v.string(),
    paymentStatus: v.string(),
    basicSalary: v.number(),
    hra: v.number(),
    conveyanceAllowance: v.number(),
    medicalAllowance: v.number(),
    specialAllowance: v.number(),
    bonus: v.number(),
    overtimePay: v.number(),
    grossEarnings: v.number(),
    providentFund: v.number(),
    incomeTax: v.number(),
    professionalTax: v.number(),
    otherDeductions: v.number(),
    totalDeductions: v.number(),
    netPayable: v.number(),
    currency: v.string(),
    generatedAt: v.string(),
  })
    .index("by_org", ["organizationId"])
    .index("by_employee", ["employeeId"])
    .index("by_payroll_run", ["payrollRunId"]),

  performanceGoals: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.string(),
    employeeName: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    targetDate: v.string(),
    progressPercent: v.number(),
    status: v.string(),
    metrics: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_org", ["organizationId"])
    .index("by_employee", ["employeeId"]),

  performanceReviews: defineTable({
    organizationId: v.id("organizations"),
    cycleName: v.string(),
    employeeId: v.string(),
    employeeName: v.string(),
    employeeCode: v.string(),
    departmentName: v.string(),
    managerId: v.string(),
    managerName: v.string(),
    selfRating: v.optional(v.number()),
    selfFeedback: v.optional(v.string()),
    managerRating: v.optional(v.number()),
    managerFeedback: v.optional(v.string()),
    finalRating: v.optional(v.number()),
    status: v.string(), // PENDING_SELF, PENDING_MANAGER, COMPLETED
    submittedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
  })
    .index("by_org", ["organizationId"])
    .index("by_employee", ["employeeId"]),

  documents: defineTable({
    organizationId: v.id("organizations"),
    employeeId: v.optional(v.string()),
    employeeName: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
    fileSizeFormatted: v.string(),
    fileType: v.string(),
    storageId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    uploadedBy: v.string(),
    uploadedAt: v.string(),
    isConfidential: v.boolean(),
  })
    .index("by_org", ["organizationId"])
    .index("by_employee", ["employeeId"]),

  tasks: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    description: v.string(),
    assigneeId: v.string(),
    assigneeName: v.string(),
    assigneeAvatar: v.optional(v.string()),
    creatorId: v.string(),
    creatorName: v.string(),
    priority: v.string(), // LOW, MEDIUM, HIGH, URGENT
    status: v.string(), // TODO, IN_PROGRESS, COMPLETED, CANCELLED
    dueDate: v.string(),
    tags: v.optional(v.array(v.string())),
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
  })
    .index("by_org", ["organizationId"])
    .index("by_assignee", ["assigneeId"]),

  announcements: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorDesignation: v.string(),
    isPinned: v.boolean(),
    publishedAt: v.string(),
    readCount: v.number(),
    readByUserIds: v.optional(v.array(v.string())),
  }).index("by_org", ["organizationId"]),

  recruitmentJobs: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    departmentId: v.string(),
    departmentName: v.string(),
    location: v.string(),
    employmentType: v.string(),
    openPositions: v.number(),
    status: v.string(),
    experienceLevel: v.string(),
    salaryRange: v.string(),
    description: v.string(),
    createdAt: v.string(),
  }).index("by_org", ["organizationId"]),

  recruitmentCandidates: defineTable({
    organizationId: v.id("organizations"),
    jobId: v.string(),
    jobTitle: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    currentCompany: v.optional(v.string()),
    yearsOfExperience: v.number(),
    stage: v.string(), // APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED
    resumeUrl: v.optional(v.string()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    appliedDate: v.string(),
  })
    .index("by_org", ["organizationId"])
    .index("by_job", ["jobId"]),

  notifications: defineTable({
    organizationId: v.id("organizations"),
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    isRead: v.boolean(),
    linkUrl: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organizationId"]),

  auditLogs: defineTable({
    organizationId: v.id("organizations"),
    userId: v.string(),
    userName: v.string(),
    userRole: v.string(),
    action: v.string(),
    entity: v.string(),
    entityId: v.optional(v.string()),
    details: v.string(),
    ipAddress: v.optional(v.string()),
    timestamp: v.string(),
  }).index("by_org", ["organizationId"]),

  settings: defineTable({
    organizationId: v.id("organizations"),
    companyName: v.string(),
    companyEmail: v.string(),
    companyPhone: v.string(),
    companyAddress: v.string(),
    currency: v.string(),
    timezone: v.string(),
    workDays: v.array(v.string()), // ['Monday', 'Tuesday', ...]
    standardWorkHours: v.number(),
    allowRemoteClockIn: v.boolean(),
    autoApproveLeaves: v.boolean(),
    notifyOnLeaveRequest: v.boolean(),
    notifyOnPayrollRun: v.boolean(),
    twoFactorRequired: v.boolean(),
  }).index("by_org", ["organizationId"]),
});

function numberValue() {
  return v.number();
}
