import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const get = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, undefined, args.organizationId);
    return await ctx.db.get(organizationId);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("organizations").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    currency: v.string(),
    fiscalYearStart: v.string(),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    // Check if slug exists
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Organization slug "${args.slug}" is already taken.`);
    }

    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      logoUrl: args.logoUrl,
      currency: args.currency || "USD",
      fiscalYearStart: args.fiscalYearStart || "January",
      timezone: args.timezone || "America/New_York (EST)",
      createdAt: now,
    });

    // Create default settings
    await ctx.db.insert("settings", {
      organizationId: orgId,
      companyName: args.name,
      companyEmail: `admin@${args.slug}.com`,
      companyPhone: "+1 (555) 000-0000",
      companyAddress: "Corporate Headquarters",
      currency: args.currency || "USD",
      timezone: args.timezone || "America/New_York (EST)",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      standardWorkHours: 8,
      allowRemoteClockIn: true,
      autoApproveLeaves: false,
      notifyOnLeaveRequest: true,
      notifyOnPayrollRun: true,
      twoFactorRequired: false,
    });

    // Create default leave types
    const defaultLeaves = [
      { name: "Annual / Paid Leave", code: "AL", totalDaysPerYear: 20, carryForwardAllowed: true, maxCarryForwardDays: 5, isPaid: true, requiresAttachment: false, colorHex: "#2563EB" },
      { name: "Sick Leave", code: "SL", totalDaysPerYear: 12, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: "#DC2626" },
      { name: "Casual Leave", code: "CL", totalDaysPerYear: 8, carryForwardAllowed: false, isPaid: true, requiresAttachment: false, colorHex: "#D97706" },
    ];

    for (const lt of defaultLeaves) {
      await ctx.db.insert("leaveTypes", {
        organizationId: orgId,
        ...lt,
      });
    }

    return orgId;
  },
});

export const update = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    currency: v.optional(v.string()),
    fiscalYearStart: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    
    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.logoUrl !== undefined) updates.logoUrl = args.logoUrl;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.fiscalYearStart !== undefined) updates.fiscalYearStart = args.fiscalYearStart;
    if (args.timezone !== undefined) updates.timezone = args.timezone;

    await ctx.db.patch(organizationId, updates);

    return { success: true };
  },
});
