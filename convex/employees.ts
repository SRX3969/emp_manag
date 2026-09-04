import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.string()),
    departmentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId));

    const employees = await q.collect();

    return employees.filter((emp) => {
      if (args.status && args.status !== "ALL" && emp.status !== args.status) return false;
      if (args.departmentId && args.departmentId !== "ALL" && emp.departmentId !== args.departmentId) return false;
      return true;
    });
  },
});

export const getById = query({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    employeeCode: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    avatarUrl: v.optional(v.string()),
    gender: v.string(),
    dateOfBirth: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    postalCode: v.string(),
    emergencyContact: v.object({
      name: v.string(),
      relationship: v.string(),
      phone: v.string(),
      email: v.optional(v.string()),
    }),
    departmentId: v.string(),
    departmentName: v.string(),
    designation: v.string(),
    managerId: v.optional(v.string()),
    managerName: v.optional(v.string()),
    joiningDate: v.string(),
    employmentType: v.string(),
    workLocation: v.string(),
    status: v.string(),
    salary: v.number(),
    payType: v.string(),
    currency: v.string(),
    bankAccountNumber: v.optional(v.string()),
    taxIdentificationNumber: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("employees", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("employees"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: now,
    });
  },
});

export const deactivate = mutation({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.patch(args.id, {
      status: "INACTIVE",
      updatedAt: now,
    });
  },
});
