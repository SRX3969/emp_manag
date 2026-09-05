import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      undefined,
      args.organizationId
    );

    const targetUserId = args.userId || user?._id || user?.employeeId || "all";

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    return notifications
      .filter((n) => n.userId === "all" || n.userId === targetUserId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
});

export const markAsRead = mutation({
  args: {
    id: v.id("notifications"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      undefined,
      args.organizationId
    );

    const notif = await ctx.db.get(args.id);
    if (!notif || notif.organizationId !== organizationId) {
      throw new Error("Notification not found.");
    }

    await ctx.db.patch(args.id, { isRead: true });
    return { success: true };
  },
});

export const markAllAsRead = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      undefined,
      args.organizationId
    );

    const targetUserId = args.userId || user?._id || user?.employeeId || "all";

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    for (const notif of notifications) {
      if ((notif.userId === "all" || notif.userId === targetUserId) && !notif.isRead) {
        await ctx.db.patch(notif._id, { isRead: true });
      }
    }

    return { success: true };
  },
});
