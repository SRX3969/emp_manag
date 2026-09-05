import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const listTypes = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "leave.view", args.organizationId);
    return await ctx.db
      .query("leaveTypes")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});

export const getBalances = query({
  args: {
    employeeId: v.string(),
    year: v.optional(v.number()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "leave.view", args.organizationId);
    const targetYear = args.year || new Date().getFullYear();

    return await ctx.db
      .query("leaveBalances")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", args.employeeId).eq("year", targetYear)
      )
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .collect();
  },
});

export const listRequests = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    status: v.optional(v.string()),
    employeeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(ctx, "leave.view", args.organizationId);

    let requests = await ctx.db
      .query("leaveRequests")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    // If regular employee, only show their own requests
    if (role === "EMPLOYEE" && user?.employeeId) {
      requests = requests.filter((r) => r.employeeId === user.employeeId);
    } else if (args.employeeId) {
      requests = requests.filter((r) => r.employeeId === args.employeeId);
    }

    if (args.status && args.status !== "ALL") {
      requests = requests.filter((r) => r.status === args.status);
    }

    return requests;
  },
});

export const apply = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    employeeId: v.string(),
    leaveTypeId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    isHalfDay: v.boolean(),
    halfDaySession: v.optional(v.string()),
    reason: v.string(),
    attachmentUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "leave.apply", args.organizationId);

    const emp = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("_id"), args.employeeId))
      .first();

    if (!emp) throw new Error("Employee not found.");

    const leaveType = await ctx.db.get(args.leaveTypeId as any);
    const leaveTypeName = (leaveType as any)?.name || "Leave";

    const currentYear = new Date(args.startDate).getFullYear() || new Date().getFullYear();

    // Check balance
    const balance = await ctx.db
      .query("leaveBalances")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", args.employeeId).eq("year", currentYear)
      )
      .filter((q) => q.eq(q.field("leaveTypeId"), args.leaveTypeId))
      .first();

    if (balance && balance.remainingDays < args.totalDays) {
      throw new Error(
        `Insufficient leave balance. You have ${balance.remainingDays} days remaining, but requested ${args.totalDays} days.`
      );
    }

    const now = new Date().toISOString();
    const requestId = await ctx.db.insert("leaveRequests", {
      organizationId,
      employeeId: args.employeeId,
      employeeName: emp.fullName,
      employeeCode: emp.employeeCode,
      departmentName: emp.departmentName,
      leaveTypeId: args.leaveTypeId,
      leaveTypeName,
      startDate: args.startDate,
      endDate: args.endDate,
      totalDays: args.totalDays,
      isHalfDay: args.isHalfDay,
      halfDaySession: args.halfDaySession,
      reason: args.reason,
      status: "PENDING",
      appliedOn: now.split("T")[0],
      attachmentUrl: args.attachmentUrl,
    });

    // Update pending balance
    if (balance) {
      await ctx.db.patch(balance._id, {
        pendingDays: balance.pendingDays + args.totalDays,
      });
    }

    // Create Notification for Manager / HR
    await ctx.db.insert("notifications", {
      organizationId,
      userId: emp.managerId || "admin",
      title: "New Leave Application",
      message: `${emp.fullName} applied for ${args.totalDays} day(s) of ${leaveTypeName}.`,
      type: "LEAVE",
      isRead: false,
      linkUrl: "/leave/requests",
      createdAt: now,
    });

    return requestId;
  },
});

export const approve = mutation({
  args: {
    requestId: v.id("leaveRequests"),
    organizationId: v.optional(v.id("organizations")),
    comment: v.optional(string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(ctx, "leave.approve", args.organizationId);

    const req = await ctx.db.get(args.requestId);
    if (!req || req.organizationId !== organizationId) {
      throw new Error("Leave request not found.");
    }

    if (req.status !== "PENDING") {
      throw new Error(`Request is already ${req.status.toLowerCase()}.`);
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.requestId, {
      status: "APPROVED",
      approverId: user?._id || "manager",
      approverName: user?.name || "Manager",
      approverComment: args.comment || "Approved",
      approvedAt: now,
    });

    // Deduct from leave balance
    const currentYear = new Date(req.startDate).getFullYear() || new Date().getFullYear();
    const balance = await ctx.db
      .query("leaveBalances")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", req.employeeId).eq("year", currentYear)
      )
      .filter((q) => q.eq(q.field("leaveTypeId"), req.leaveTypeId))
      .first();

    if (balance) {
      await ctx.db.patch(balance._id, {
        usedDays: balance.usedDays + req.totalDays,
        pendingDays: Math.max(0, balance.pendingDays - req.totalDays),
        remainingDays: Math.max(0, balance.remainingDays - req.totalDays),
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "manager",
      userName: user?.name || "Manager",
      userRole: user?.role || "MANAGER",
      action: "LEAVE_APPROVED",
      entity: "LEAVE",
      entityId: args.requestId,
      details: `Approved ${req.totalDays} day(s) ${req.leaveTypeName} for ${req.employeeName}`,
      timestamp: now,
    });

    // Notification to employee
    await ctx.db.insert("notifications", {
      organizationId,
      userId: req.employeeId,
      title: "Leave Request Approved",
      message: `Your leave request for ${req.startDate} to ${req.endDate} has been approved.`,
      type: "LEAVE",
      isRead: false,
      linkUrl: "/leave",
      createdAt: now,
    });

    return { success: true };
  },
});

export const reject = mutation({
  args: {
    requestId: v.id("leaveRequests"),
    organizationId: v.optional(v.id("organizations")),
    comment: v.optional(string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(ctx, "leave.approve", args.organizationId);

    const req = await ctx.db.get(args.requestId);
    if (!req || req.organizationId !== organizationId) {
      throw new Error("Leave request not found.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.requestId, {
      status: "REJECTED",
      approverId: user?._id || "manager",
      approverName: user?.name || "Manager",
      approverComment: args.comment || "Rejected",
      approvedAt: now,
    });

    // Restore pending balance
    const currentYear = new Date(req.startDate).getFullYear() || new Date().getFullYear();
    const balance = await ctx.db
      .query("leaveBalances")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", req.employeeId).eq("year", currentYear)
      )
      .filter((q) => q.eq(q.field("leaveTypeId"), req.leaveTypeId))
      .first();

    if (balance) {
      await ctx.db.patch(balance._id, {
        pendingDays: Math.max(0, balance.pendingDays - req.totalDays),
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "manager",
      userName: user?.name || "Manager",
      userRole: user?.role || "MANAGER",
      action: "LEAVE_REJECTED",
      entity: "LEAVE",
      entityId: args.requestId,
      details: `Rejected leave request for ${req.employeeName}. Note: ${args.comment || "None"}`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const cancel = mutation({
  args: {
    requestId: v.id("leaveRequests"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "leave.apply", args.organizationId);

    const req = await ctx.db.get(args.requestId);
    if (!req || req.organizationId !== organizationId) {
      throw new Error("Leave request not found.");
    }

    if (req.status === "CANCELLED") {
      throw new Error("Request is already cancelled.");
    }

    const wasApproved = req.status === "APPROVED";
    const wasPending = req.status === "PENDING";

    await ctx.db.patch(args.requestId, {
      status: "CANCELLED",
    });

    // Revert balance
    const currentYear = new Date(req.startDate).getFullYear() || new Date().getFullYear();
    const balance = await ctx.db
      .query("leaveBalances")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", req.employeeId).eq("year", currentYear)
      )
      .filter((q) => q.eq(q.field("leaveTypeId"), req.leaveTypeId))
      .first();

    if (balance) {
      if (wasApproved) {
        await ctx.db.patch(balance._id, {
          usedDays: Math.max(0, balance.usedDays - req.totalDays),
          remainingDays: balance.remainingDays + req.totalDays,
        });
      } else if (wasPending) {
        await ctx.db.patch(balance._id, {
          pendingDays: Math.max(0, balance.pendingDays - req.totalDays),
        });
      }
    }

    return { success: true };
  },
});

function string() {
  return v.string();
}
