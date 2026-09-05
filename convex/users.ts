import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg, getUserAndOrg } from "./lib/auth";

export const getCurrentUser = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    return await getUserAndOrg(ctx, args.organizationId);
  },
});

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    return await ctx.db
      .query("users")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});

export const createOrUpdateUserFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    organizationId: v.id("organizations"),
    role: v.union(
      v.literal("SUPER_ADMIN"),
      v.literal("HR_ADMIN"),
      v.literal("MANAGER"),
      v.literal("EMPLOYEE")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
        role: args.role,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      organizationId: args.organizationId,
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role: args.role,
      createdAt: now,
    });
  },
});

export const invite = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("SUPER_ADMIN"),
      v.literal("HR_ADMIN"),
      v.literal("MANAGER"),
      v.literal("EMPLOYEE")
    ),
    employeeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    const now = new Date().toISOString();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error(`User with email "${args.email}" is already registered in this organization.`);
    }

    const userId = await ctx.db.insert("users", {
      organizationId,
      email: args.email,
      name: args.name,
      role: args.role,
      employeeId: args.employeeId,
      createdAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "USER_INVITED",
      entity: "USER",
      entityId: userId,
      details: `Invited user ${args.name} (${args.email}) with role ${args.role}`,
      timestamp: now,
    });

    return userId;
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("SUPER_ADMIN"),
      v.literal("HR_ADMIN"),
      v.literal("MANAGER"),
      v.literal("EMPLOYEE")
    ),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    const targetUser = await ctx.db.get(args.userId);

    if (!targetUser || targetUser.organizationId !== organizationId) {
      throw new Error("User not found in organization.");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    const now = new Date().toISOString();
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "Administrator",
      userRole: "SUPER_ADMIN",
      action: "ROLE_CHANGED",
      entity: "USER",
      entityId: args.userId,
      details: `Updated role for ${targetUser.name} to ${args.role}`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const linkEmployee = mutation({
  args: {
    userId: v.id("users"),
    employeeId: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    const targetUser = await ctx.db.get(args.userId);

    if (!targetUser || targetUser.organizationId !== organizationId) {
      throw new Error("User not found in organization.");
    }

    await ctx.db.patch(args.userId, {
      employeeId: args.employeeId,
    });

    return { success: true };
  },
});
