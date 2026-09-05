import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    status: v.optional(v.string()),
    departmentId: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "employees.view",
      args.organizationId
    );

    let employees = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (args.status && args.status !== "ALL") {
      employees = employees.filter((emp) => emp.status === args.status);
    }

    if (args.departmentId && args.departmentId !== "ALL") {
      employees = employees.filter((emp) => emp.departmentId === args.departmentId);
    }

    if (args.search && args.search.trim() !== "") {
      const q = args.search.toLowerCase().trim();
      employees = employees.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.employeeCode.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.departmentName.toLowerCase().includes(q)
      );
    }

    // Enforce salary privacy: If role is EMPLOYEE, hide salary unless it matches their own employee record
    if (role === "EMPLOYEE") {
      return employees.map((emp) => {
        if (user?.employeeId && user.employeeId === emp._id) {
          return emp;
        }
        return {
          ...emp,
          salary: 0,
          bankAccountNumber: undefined,
          taxIdentificationNumber: undefined,
        };
      });
    }

    return employees;
  },
});

export const getById = query({
  args: {
    id: v.id("employees"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "employees.view",
      args.organizationId
    );

    const emp = await ctx.db.get(args.id);
    if (!emp || emp.organizationId !== organizationId) {
      throw new Error("Employee not found in organization.");
    }

    // Privacy check
    if (role === "EMPLOYEE" && user?.employeeId !== emp._id) {
      return {
        ...emp,
        salary: 0,
        bankAccountNumber: undefined,
        taxIdentificationNumber: undefined,
      };
    }

    return emp;
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
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
    employmentType: v.string(),
    workLocation: v.string(),
    status: v.string(),
    salary: v.number(),
    payType: v.string(),
    currency: v.string(),
    bankAccountNumber: v.optional(v.string()),
    taxIdentificationNumber: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "employees.create",
      args.organizationId
    );

    // Validate unique employee code in organization
    const existingCode = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("employeeCode"), args.employeeCode))
      .first();

    if (existingCode) {
      throw new Error(`Employee ID "${args.employeeCode}" already exists.`);
    }

    // Validate email
    const existingEmail = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingEmail) {
      throw new Error(`Employee with email "${args.email}" already exists.`);
    }

    const now = new Date().toISOString();
    const empId = await ctx.db.insert("employees", {
      ...args,
      organizationId,
      createdAt: now,
      updatedAt: now,
    });

    // Create default leave balances for current year
    const currentYear = new Date().getFullYear();
    const leaveTypes = await ctx.db
      .query("leaveTypes")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    for (const lt of leaveTypes) {
      await ctx.db.insert("leaveBalances", {
        organizationId,
        employeeId: empId,
        leaveTypeId: lt._id,
        leaveTypeName: lt.name,
        leaveTypeCode: lt.code,
        allocatedDays: lt.totalDaysPerYear,
        usedDays: 0,
        pendingDays: 0,
        remainingDays: lt.totalDaysPerYear,
        year: currentYear,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "HR Administrator",
      userRole: "HR_ADMIN",
      action: "EMPLOYEE_CREATED",
      entity: "EMPLOYEE",
      entityId: empId,
      details: `Added new employee: ${args.fullName} (${args.employeeCode}) in ${args.departmentName}`,
      timestamp: now,
    });

    return empId;
  },
});

export const update = mutation({
  args: {
    id: v.id("employees"),
    organizationId: v.optional(v.id("organizations")),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "employees.update",
      args.organizationId
    );

    const emp = await ctx.db.get(args.id);
    if (!emp || emp.organizationId !== organizationId) {
      throw new Error("Employee not found in organization.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "HR Administrator",
      userRole: "HR_ADMIN",
      action: "EMPLOYEE_UPDATED",
      entity: "EMPLOYEE",
      entityId: args.id,
      details: `Updated details for employee ${emp.fullName} (${emp.employeeCode})`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const deactivate = mutation({
  args: {
    id: v.id("employees"),
    organizationId: v.optional(v.id("organizations")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "employees.delete",
      args.organizationId
    );

    const emp = await ctx.db.get(args.id);
    if (!emp || emp.organizationId !== organizationId) {
      throw new Error("Employee not found in organization.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: "INACTIVE",
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "HR Administrator",
      userRole: "HR_ADMIN",
      action: "EMPLOYEE_DEACTIVATED",
      entity: "EMPLOYEE",
      entityId: args.id,
      details: `Deactivated employee ${emp.fullName} (${emp.employeeCode}). Reason: ${args.reason || "Offboarding"}`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const reactivate = mutation({
  args: {
    id: v.id("employees"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "employees.update",
      args.organizationId
    );

    const emp = await ctx.db.get(args.id);
    if (!emp || emp.organizationId !== organizationId) {
      throw new Error("Employee not found in organization.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: "ACTIVE",
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "HR Administrator",
      userRole: "HR_ADMIN",
      action: "EMPLOYEE_REACTIVATED",
      entity: "EMPLOYEE",
      entityId: args.id,
      details: `Reactivated employee ${emp.fullName} (${emp.employeeCode})`,
      timestamp: now,
    });

    return { success: true };
  },
});
