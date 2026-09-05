import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "announcements.view",
      args.organizationId
    );

    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    // Sort pinned announcements to top, then by date descending
    return announcements.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    isPinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "announcements.manage",
      args.organizationId
    );

    const now = new Date().toISOString();
    const annId = await ctx.db.insert("announcements", {
      organizationId,
      title: args.title,
      content: args.content,
      category: args.category,
      authorId: user?._id || "hr-admin",
      authorName: user?.name || "HR Department",
      authorDesignation: user?.role === "SUPER_ADMIN" ? "Executive Board" : "Human Resources",
      isPinned: args.isPinned,
      publishedAt: now.split("T")[0],
      readCount: 0,
      readByUserIds: [],
    });

    // Notify all organization members
    await ctx.db.insert("notifications", {
      organizationId,
      userId: "all",
      title: `Company Announcement: ${args.title}`,
      message: args.content.slice(0, 100) + (args.content.length > 100 ? "..." : ""),
      type: "ANNOUNCEMENT",
      isRead: false,
      linkUrl: "/announcements",
      createdAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "system",
      userName: user?.name || "HR Administrator",
      userRole: user?.role || "HR_ADMIN",
      action: "ANNOUNCEMENT_PUBLISHED",
      entity: "ANNOUNCEMENT",
      entityId: annId,
      details: `Published company announcement: "${args.title}"`,
      timestamp: now,
    });

    return annId;
  },
});

export const markAsRead = mutation({
  args: {
    announcementId: v.id("announcements"),
    userId: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "announcements.view",
      args.organizationId
    );

    const ann = await ctx.db.get(args.announcementId);
    if (!ann || ann.organizationId !== organizationId) {
      throw new Error("Announcement not found.");
    }

    const currentReads = ann.readByUserIds || [];
    if (!currentReads.includes(args.userId)) {
      await ctx.db.patch(args.announcementId, {
        readCount: (ann.readCount || 0) + 1,
        readByUserIds: [...currentReads, args.userId],
      });
    }

    return { success: true };
  },
});
