import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    status: v.optional(v.string()),
    assigneeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "tasks.view",
      args.organizationId
    );

    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (role === "EMPLOYEE" && user?.employeeId) {
      tasks = tasks.filter((t) => t.assigneeId === user.employeeId);
    } else if (args.assigneeId) {
      tasks = tasks.filter((t) => t.assigneeId === args.assigneeId);
    }

    if (args.status && args.status !== "ALL") {
      tasks = tasks.filter((t) => t.status === args.status);
    }

    return tasks;
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    title: v.string(),
    description: v.string(),
    assigneeId: v.string(),
    assigneeName: v.string(),
    assigneeAvatar: v.optional(v.string()),
    priority: v.string(),
    dueDate: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "tasks.manage",
      args.organizationId
    );

    const now = new Date().toISOString();
    const taskId = await ctx.db.insert("tasks", {
      organizationId,
      title: args.title,
      description: args.description,
      assigneeId: args.assigneeId,
      assigneeName: args.assigneeName,
      assigneeAvatar: args.assigneeAvatar,
      creatorId: user?._id || "system",
      creatorName: user?.name || "Manager",
      priority: args.priority,
      status: "TODO",
      dueDate: args.dueDate,
      tags: args.tags || [],
      createdAt: now,
    });

    // Notify Assignee
    await ctx.db.insert("notifications", {
      organizationId,
      userId: args.assigneeId,
      title: "New Task Assigned",
      message: `You were assigned task: "${args.title}" (Due: ${args.dueDate})`,
      type: "TASK",
      isRead: false,
      linkUrl: "/tasks",
      createdAt: now,
    });

    return taskId;
  },
});

export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "tasks.view",
      args.organizationId
    );

    const task = await ctx.db.get(args.taskId);
    if (!task || task.organizationId !== organizationId) {
      throw new Error("Task not found.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.taskId, {
      status: args.status,
      completedAt: args.status === "COMPLETED" ? now : undefined,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    taskId: v.id("tasks"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "tasks.manage",
      args.organizationId
    );

    const task = await ctx.db.get(args.taskId);
    if (!task || task.organizationId !== organizationId) {
      throw new Error("Task not found.");
    }

    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});
