import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const listGoals = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    employeeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "performance.view",
      args.organizationId
    );

    let goals = await ctx.db
      .query("performanceGoals")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (role === "EMPLOYEE" && user?.employeeId) {
      return goals.filter((g) => g.employeeId === user.employeeId);
    }

    if (args.employeeId) {
      return goals.filter((g) => g.employeeId === args.employeeId);
    }

    return goals;
  },
});

export const createGoal = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    employeeId: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    targetDate: v.string(),
    metrics: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "performance.manage",
      args.organizationId
    );

    const emp = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("_id"), args.employeeId))
      .first();

    if (!emp) throw new Error("Employee not found.");

    const now = new Date().toISOString();
    return await ctx.db.insert("performanceGoals", {
      organizationId,
      employeeId: args.employeeId,
      employeeName: emp.fullName,
      title: args.title,
      description: args.description,
      category: args.category,
      targetDate: args.targetDate,
      progressPercent: 0,
      status: "IN_PROGRESS",
      metrics: args.metrics,
      createdAt: now,
    });
  },
});

export const updateGoalProgress = mutation({
  args: {
    goalId: v.id("performanceGoals"),
    progressPercent: v.number(),
    status: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "performance.view",
      args.organizationId
    );

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.organizationId !== organizationId) {
      throw new Error("Goal not found.");
    }

    await ctx.db.patch(args.goalId, {
      progressPercent: Math.min(100, Math.max(0, args.progressPercent)),
      status: args.progressPercent >= 100 ? "COMPLETED" : args.status,
    });

    return { success: true };
  },
});

export const listReviews = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    employeeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "performance.view",
      args.organizationId
    );

    let reviews = await ctx.db
      .query("performanceReviews")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (role === "EMPLOYEE" && user?.employeeId) {
      return reviews.filter((r) => r.employeeId === user.employeeId);
    }

    if (args.employeeId) {
      return reviews.filter((r) => r.employeeId === args.employeeId);
    }

    return reviews;
  },
});

export const submitSelfReview = mutation({
  args: {
    reviewId: v.id("performanceReviews"),
    selfRating: v.number(),
    selfFeedback: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "performance.view",
      args.organizationId
    );

    const review = await ctx.db.get(args.reviewId);
    if (!review || review.organizationId !== organizationId) {
      throw new Error("Review not found.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.reviewId, {
      selfRating: args.selfRating,
      selfFeedback: args.selfFeedback,
      status: "PENDING_MANAGER",
      submittedAt: now,
    });

    return { success: true };
  },
});

export const submitManagerReview = mutation({
  args: {
    reviewId: v.id("performanceReviews"),
    managerRating: v.number(),
    managerFeedback: v.string(),
    finalRating: v.number(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "performance.manage",
      args.organizationId
    );

    const review = await ctx.db.get(args.reviewId);
    if (!review || review.organizationId !== organizationId) {
      throw new Error("Review not found.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.reviewId, {
      managerRating: args.managerRating,
      managerFeedback: args.managerFeedback,
      finalRating: args.finalRating,
      status: "COMPLETED",
      completedAt: now,
    });

    return { success: true };
  },
});
