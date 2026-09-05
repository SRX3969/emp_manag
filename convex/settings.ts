import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const get = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "settings.manage",
      args.organizationId
    );

    return await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .first();
  },
});

export const update = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    companyName: v.optional(v.string()),
    companyEmail: v.optional(v.string()),
    companyPhone: v.optional(v.string()),
    companyAddress: v.optional(v.string()),
    currency: v.optional(v.string()),
    timezone: v.optional(v.string()),
    workDays: v.optional(v.array(v.string())),
    standardWorkHours: v.optional(v.number()),
    allowRemoteClockIn: v.optional(v.boolean()),
    autoApproveLeaves: v.optional(v.boolean()),
    notifyOnLeaveRequest: v.optional(v.boolean()),
    notifyOnPayrollRun: v.optional(v.boolean()),
    twoFactorRequired: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "settings.manage",
      args.organizationId
    );

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .first();

    const updates: Record<string, any> = {};
    if (args.companyName !== undefined) updates.companyName = args.companyName;
    if (args.companyEmail !== undefined) updates.companyEmail = args.companyEmail;
    if (args.companyPhone !== undefined) updates.companyPhone = args.companyPhone;
    if (args.companyAddress !== undefined) updates.companyAddress = args.companyAddress;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.workDays !== undefined) updates.workDays = args.workDays;
    if (args.standardWorkHours !== undefined) updates.standardWorkHours = args.standardWorkHours;
    if (args.allowRemoteClockIn !== undefined) updates.allowRemoteClockIn = args.allowRemoteClockIn;
    if (args.autoApproveLeaves !== undefined) updates.autoApproveLeaves = args.autoApproveLeaves;
    if (args.notifyOnLeaveRequest !== undefined) updates.notifyOnLeaveRequest = args.notifyOnLeaveRequest;
    if (args.notifyOnPayrollRun !== undefined) updates.notifyOnPayrollRun = args.notifyOnPayrollRun;
    if (args.twoFactorRequired !== undefined) updates.twoFactorRequired = args.twoFactorRequired;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("settings", {
        organizationId,
        companyName: args.companyName || "Company",
        companyEmail: args.companyEmail || "info@company.com",
        companyPhone: args.companyPhone || "+1 (555) 000-0000",
        companyAddress: args.companyAddress || "Headquarters",
        currency: args.currency || "USD",
        timezone: args.timezone || "America/New_York (EST)",
        workDays: args.workDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        standardWorkHours: args.standardWorkHours || 8,
        allowRemoteClockIn: args.allowRemoteClockIn ?? true,
        autoApproveLeaves: args.autoApproveLeaves ?? false,
        notifyOnLeaveRequest: args.notifyOnLeaveRequest ?? true,
        notifyOnPayrollRun: args.notifyOnPayrollRun ?? true,
        twoFactorRequired: args.twoFactorRequired ?? false,
      });
    }

    const now = new Date().toISOString();
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "SETTINGS_UPDATED",
      entity: "SETTINGS",
      details: "Updated company settings and workforce policies",
      timestamp: now,
    });

    return { success: true };
  },
});
