import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDevelopmentOrg = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if demo org already exists
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "apex-technologies-demo"))
      .first();

    if (existingOrg) {
      return { message: "Demo organization already seeded.", organizationId: existingOrg._id };
    }

    const now = new Date().toISOString();

    // 1. Create Demo Organization
    const orgId = await ctx.db.insert("organizations", {
      name: "Apex Global Technologies (Demo)",
      slug: "apex-technologies-demo",
      currency: "USD",
      fiscalYearStart: "January",
      timezone: "America/New_York (EST)",
      createdAt: now,
    });

    // 2. Settings
    await ctx.db.insert("settings", {
      organizationId: orgId,
      companyName: "Apex Global Technologies",
      companyEmail: "admin@apexglobal.demo",
      companyPhone: "+1 (555) 019-2834",
      companyAddress: "450 Lexington Avenue, Floor 18, New York, NY 10017",
      currency: "USD",
      timezone: "America/New_York (EST)",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      standardWorkHours: 8,
      allowRemoteClockIn: true,
      autoApproveLeaves: false,
      notifyOnLeaveRequest: true,
      notifyOnPayrollRun: true,
      twoFactorRequired: true,
    });

    // 3. Departments
    const engDeptId = await ctx.db.insert("departments", {
      organizationId: orgId,
      name: "Engineering",
      code: "ENG",
      description: "Software engineering and infrastructure",
      headcount: 3,
      annualBudget: 650000,
      colorHex: "#2563EB",
      createdAt: now,
    });

    const hrDeptId = await ctx.db.insert("departments", {
      organizationId: orgId,
      name: "Human Resources",
      code: "HR",
      description: "People operations and talent acquisition",
      headcount: 2,
      annualBudget: 280000,
      colorHex: "#10B981",
      createdAt: now,
    });

    const productDeptId = await ctx.db.insert("departments", {
      organizationId: orgId,
      name: "Product & Design",
      code: "PROD",
      description: "Product strategy and UI/UX design",
      headcount: 2,
      annualBudget: 420000,
      colorHex: "#8B5CF6",
      createdAt: now,
    });

    // 4. Leave Types
    const alId = await ctx.db.insert("leaveTypes", {
      organizationId: orgId,
      name: "Annual / Paid Leave",
      code: "AL",
      totalDaysPerYear: 20,
      carryForwardAllowed: true,
      maxCarryForwardDays: 5,
      isPaid: true,
      requiresAttachment: false,
      colorHex: "#2563EB",
    });

    const slId = await ctx.db.insert("leaveTypes", {
      organizationId: orgId,
      name: "Sick Leave",
      code: "SL",
      totalDaysPerYear: 12,
      carryForwardAllowed: false,
      isPaid: true,
      requiresAttachment: true,
      colorHex: "#DC2626",
    });

    // 5. Sample Employees
    const emp1 = await ctx.db.insert("employees", {
      organizationId: orgId,
      employeeCode: "EMP-001",
      firstName: "Rahul",
      lastName: "Sharma",
      fullName: "Rahul Sharma",
      email: "rahul.sharma@apexglobal.demo",
      phone: "+1 (555) 234-5678",
      gender: "Male",
      dateOfBirth: "1988-04-12",
      address: "124 Park Avenue",
      city: "New York",
      country: "United States",
      postalCode: "10016",
      emergencyContact: { name: "Ananya Sharma", relationship: "Spouse", phone: "+1 (555) 987-6543" },
      departmentId: engDeptId,
      departmentName: "Engineering",
      designation: "VP of Engineering",
      joiningDate: "2021-03-15",
      employmentType: "FULL_TIME",
      workLocation: "Hybrid",
      status: "ACTIVE",
      salary: 165000,
      payType: "SALARIED",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    });

    const emp2 = await ctx.db.insert("employees", {
      organizationId: orgId,
      employeeCode: "EMP-002",
      firstName: "Priya",
      lastName: "Patel",
      fullName: "Priya Patel",
      email: "priya.patel@apexglobal.demo",
      phone: "+1 (555) 345-6789",
      gender: "Female",
      dateOfBirth: "1992-08-23",
      address: "560 Hudson Street",
      city: "New York",
      country: "United States",
      postalCode: "10014",
      emergencyContact: { name: "Kavita Patel", relationship: "Mother", phone: "+1 (555) 876-5432" },
      departmentId: hrDeptId,
      departmentName: "Human Resources",
      designation: "HR Director",
      joiningDate: "2021-06-01",
      employmentType: "FULL_TIME",
      workLocation: "On-site",
      status: "ACTIVE",
      salary: 125000,
      payType: "SALARIED",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    });

    const emp3 = await ctx.db.insert("employees", {
      organizationId: orgId,
      employeeCode: "EMP-003",
      firstName: "Alex",
      lastName: "Morgan",
      fullName: "Alex Morgan",
      email: "alex.morgan@apexglobal.demo",
      phone: "+1 (555) 456-7890",
      gender: "Non-binary",
      dateOfBirth: "1995-11-05",
      address: "88 Pine Street",
      city: "New York",
      country: "United States",
      postalCode: "10005",
      emergencyContact: { name: "Sam Morgan", relationship: "Sibling", phone: "+1 (555) 765-4321" },
      departmentId: engDeptId,
      departmentName: "Engineering",
      designation: "Lead Frontend Architect",
      joiningDate: "2022-01-10",
      employmentType: "FULL_TIME",
      workLocation: "Remote",
      status: "ACTIVE",
      salary: 135000,
      payType: "SALARIED",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    });

    // 6. Leave Balances for seeded employees
    const currentYear = new Date().getFullYear();
    for (const emp of [emp1, emp2, emp3]) {
      await ctx.db.insert("leaveBalances", {
        organizationId: orgId,
        employeeId: emp,
        leaveTypeId: alId,
        leaveTypeName: "Annual / Paid Leave",
        leaveTypeCode: "AL",
        allocatedDays: 20,
        usedDays: 3,
        pendingDays: 0,
        remainingDays: 17,
        year: currentYear,
      });

      await ctx.db.insert("leaveBalances", {
        organizationId: orgId,
        employeeId: emp,
        leaveTypeId: slId,
        leaveTypeName: "Sick Leave",
        leaveTypeCode: "SL",
        allocatedDays: 12,
        usedDays: 1,
        pendingDays: 0,
        remainingDays: 11,
        year: currentYear,
      });
    }

    // 7. Seed Tasks
    await ctx.db.insert("tasks", {
      organizationId: orgId,
      title: "Complete Q3 Security Audit & SOC2 Review",
      description: "Perform quarterly infrastructure security audit and verify access control policies.",
      assigneeId: emp1,
      assigneeName: "Rahul Sharma",
      creatorId: emp2,
      creatorName: "Priya Patel",
      priority: "HIGH",
      status: "IN_PROGRESS",
      dueDate: "2026-09-30",
      tags: ["Security", "Compliance"],
      createdAt: now,
    });

    // 8. Seed Announcement
    await ctx.db.insert("announcements", {
      organizationId: orgId,
      title: "Annual Health & Benefits Open Enrollment 2026",
      content: "Open enrollment for company medical, dental, and vision insurance begins next Monday.",
      category: "BENEFITS",
      authorId: emp2,
      authorName: "Priya Patel",
      authorDesignation: "HR Director",
      isPinned: true,
      publishedAt: now.split("T")[0],
      readCount: 3,
      readByUserIds: [emp1, emp2, emp3],
    });

    // 9. Seed Audit Log
    await ctx.db.insert("auditLogs", {
      organizationId: orgId,
      userId: "system",
      userName: "System Administrator",
      userRole: "SUPER_ADMIN",
      action: "DEMO_SEEDED",
      entity: "ORGANIZATION",
      entityId: orgId,
      details: "Initialized Development Demo Organization (Apex Global Technologies)",
      timestamp: now,
    });

    return { success: true, organizationId: orgId };
  },
});
