import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    entity: v.optional(v.string()),
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "audit.view",
      args.organizationId
    );

    let logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (args.entity && args.entity !== "ALL") {
      logs = logs.filter((l) => l.entity === args.entity);
    }

    if (args.action && args.action !== "ALL") {
      logs = logs.filter((l) => l.action === args.action);
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
});

export const log = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    action: v.string(),
    entity: v.string(),
    entityId: v.optional(v.string()),
    details: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      undefined,
      args.organizationId
    );

    const now = new Date().toISOString();
    return await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "system",
      userName: user?.name || "System User",
      userRole: user?.role || "SUPER_ADMIN",
      action: args.action,
      entity: args.entity,
      entityId: args.entityId,
      details: args.details,
      timestamp: now,
    });
  },
});
