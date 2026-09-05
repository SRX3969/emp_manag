import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "departments.view", args.organizationId);

    const departments = await ctx.db
      .query("departments")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    // Dynamically compute active headcount for each department
    const employees = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    return departments.map((dept) => {
      const activeCount = employees.filter(
        (emp) => emp.departmentId === dept._id && emp.status !== "INACTIVE" && emp.status !== "TERMINATED"
      ).length;

      return {
        ...dept,
        headcount: activeCount || dept.headcount || 0,
      };
    });
  },
});

export const getById = query({
  args: { id: v.id("departments"), organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "departments.view", args.organizationId);
    const dept = await ctx.db.get(args.id);
    if (!dept || dept.organizationId !== organizationId) {
      throw new Error("Department not found in organization.");
    }
    return dept;
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    code: v.string(),
    description: v.string(),
    managerId: v.optional(v.string()),
    managerName: v.optional(v.string()),
    managerEmail: v.optional(v.string()),
    parentDepartmentId: v.optional(v.string()),
    annualBudget: v.number(),
    colorHex: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "departments.manage", args.organizationId);
    const now = new Date().toISOString();

    const deptId = await ctx.db.insert("departments", {
      organizationId,
      name: args.name,
      code: args.code.toUpperCase(),
      description: args.description,
      managerId: args.managerId,
      managerName: args.managerName,
      managerEmail: args.managerEmail,
      parentDepartmentId: args.parentDepartmentId,
      headcount: 0,
      annualBudget: args.annualBudget,
      colorHex: args.colorHex || "#2563EB",
      createdAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "DEPARTMENT_CREATED",
      entity: "DEPARTMENT",
      entityId: deptId,
      details: `Created department ${args.name} (${args.code})`,
      timestamp: now,
    });

    return deptId;
  },
});

export const update = mutation({
  args: {
    id: v.id("departments"),
    organizationId: v.optional(v.id("organizations")),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    managerId: v.optional(v.string()),
    managerName: v.optional(v.string()),
    managerEmail: v.optional(v.string()),
    parentDepartmentId: v.optional(v.string()),
    annualBudget: v.optional(v.number()),
    colorHex: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "departments.manage", args.organizationId);
    const dept = await ctx.db.get(args.id);

    if (!dept || dept.organizationId !== organizationId) {
      throw new Error("Department not found in organization.");
    }

    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.code !== undefined) updates.code = args.code.toUpperCase();
    if (args.description !== undefined) updates.description = args.description;
    if (args.managerId !== undefined) updates.managerId = args.managerId;
    if (args.managerName !== undefined) updates.managerName = args.managerName;
    if (args.managerEmail !== undefined) updates.managerEmail = args.managerEmail;
    if (args.parentDepartmentId !== undefined) updates.parentDepartmentId = args.parentDepartmentId;
    if (args.annualBudget !== undefined) updates.annualBudget = args.annualBudget;
    if (args.colorHex !== undefined) updates.colorHex = args.colorHex;

    await ctx.db.patch(args.id, updates);

    const now = new Date().toISOString();
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "DEPARTMENT_UPDATED",
      entity: "DEPARTMENT",
      entityId: args.id,
      details: `Updated department ${dept.name}`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("departments"), organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "departments.manage", args.organizationId);
    const dept = await ctx.db.get(args.id);

    if (!dept || dept.organizationId !== organizationId) {
      throw new Error("Department not found in organization.");
    }

    // Ensure no active employees exist in department
    const activeEmployees = await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("departmentId", args.id))
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .collect();

    if (activeEmployees.length > 0) {
      throw new Error(`Cannot delete department with ${activeEmployees.length} assigned employees. Reassign employees first.`);
    }

    await ctx.db.delete(args.id);

    const now = new Date().toISOString();
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "DEPARTMENT_DELETED",
      entity: "DEPARTMENT",
      entityId: args.id,
      details: `Deleted department ${dept.name} (${dept.code})`,
      timestamp: now,
    });

    return { success: true };
  },
});
