import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, undefined, args.organizationId);
    const targetYear = args.year || new Date().getFullYear();

    return await ctx.db
      .query("holidays")
      .withIndex("by_org_year", (q) =>
        q.eq("organizationId", organizationId).eq("year", targetYear)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    date: v.string(),
    dayOfWeek: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    const year = new Date(args.date).getFullYear();

    return await ctx.db.insert("holidays", {
      organizationId,
      name: args.name,
      date: args.date,
      dayOfWeek: args.dayOfWeek,
      type: args.type,
      year,
      description: args.description,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("holidays"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "settings.manage", args.organizationId);
    const holiday = await ctx.db.get(args.id);

    if (!holiday || holiday.organizationId !== organizationId) {
      throw new Error("Holiday not found.");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
