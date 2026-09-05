import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const listJobs = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "recruitment.view",
      args.organizationId
    );

    return await ctx.db
      .query("recruitmentJobs")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});

export const createJob = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    title: v.string(),
    departmentId: v.string(),
    departmentName: v.string(),
    location: v.string(),
    employmentType: v.string(),
    openPositions: v.number(),
    experienceLevel: v.string(),
    salaryRange: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "recruitment.manage",
      args.organizationId
    );

    const now = new Date().toISOString();
    return await ctx.db.insert("recruitmentJobs", {
      ...args,
      organizationId,
      status: "OPEN",
      createdAt: now.split("T")[0],
    });
  },
});

export const listCandidates = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    jobId: v.optional(v.string()),
    stage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "recruitment.view",
      args.organizationId
    );

    let candidates = await ctx.db
      .query("recruitmentCandidates")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    if (args.jobId && args.jobId !== "ALL") {
      candidates = candidates.filter((c) => c.jobId === args.jobId);
    }

    if (args.stage && args.stage !== "ALL") {
      candidates = candidates.filter((c) => c.stage === args.stage);
    }

    return candidates;
  },
});

export const addCandidate = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    jobId: v.string(),
    jobTitle: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    currentCompany: v.optional(v.string()),
    yearsOfExperience: v.number(),
    stage: v.string(),
    resumeUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "recruitment.manage",
      args.organizationId
    );

    const now = new Date().toISOString();
    return await ctx.db.insert("recruitmentCandidates", {
      ...args,
      organizationId,
      appliedDate: now.split("T")[0],
    });
  },
});

export const updateCandidateStage = mutation({
  args: {
    candidateId: v.id("recruitmentCandidates"),
    stage: v.string(),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "recruitment.manage",
      args.organizationId
    );

    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate || candidate.organizationId !== organizationId) {
      throw new Error("Candidate not found.");
    }

    const updates: Record<string, any> = { stage: args.stage };
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.candidateId, updates);
    return { success: true };
  },
});

export const convertToEmployee = mutation({
  args: {
    candidateId: v.id("recruitmentCandidates"),
    employeeCode: v.string(),
    departmentId: v.string(),
    departmentName: v.string(),
    designation: v.string(),
    salary: v.number(),
    joiningDate: v.string(),
    employmentType: v.string(),
    workLocation: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "employees.create",
      args.organizationId
    );

    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate || candidate.organizationId !== organizationId) {
      throw new Error("Candidate not found.");
    }

    const [firstName, ...rest] = candidate.fullName.split(" ");
    const lastName = rest.join(" ") || "Employee";

    const now = new Date().toISOString();

    const empId = await ctx.db.insert("employees", {
      organizationId,
      employeeCode: args.employeeCode,
      firstName,
      lastName,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      gender: "Prefer not to say",
      dateOfBirth: "1995-01-01",
      address: "Address on file",
      city: "City",
      country: "United States",
      postalCode: "10001",
      emergencyContact: {
        name: "Primary Contact",
        relationship: "Family",
        phone: candidate.phone,
      },
      departmentId: args.departmentId,
      departmentName: args.departmentName,
      designation: args.designation,
      joiningDate: args.joiningDate,
      employmentType: args.employmentType,
      workLocation: args.workLocation,
      status: "ACTIVE",
      salary: args.salary,
      payType: "SALARIED",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    });

    // Mark candidate as HIRED
    await ctx.db.patch(args.candidateId, {
      stage: "HIRED",
      notes: `Converted to employee ${args.employeeCode} on ${now.split("T")[0]}`,
    });

    // Create default leave balances
    const leaveTypes = await ctx.db
      .query("leaveTypes")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    const currentYear = new Date().getFullYear();
    for (const lt of leaveTypes) {
      await ctx.db.insert("leaveBalances", {
        organizationId,
        employeeId: empId,
        leaveTypeId: lt._id,
        leaveTypeName: lt.name,
        leaveTypeCode: lt.code,
        allocatedDays: lt.totalDaysPerYear,
        usedDays: 0,
        pendingDays: 0,
        remainingDays: lt.totalDaysPerYear,
        year: currentYear,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: "system",
      userName: "HR Administrator",
      userRole: "HR_ADMIN",
      action: "CANDIDATE_HIRED",
      entity: "EMPLOYEE",
      entityId: empId,
      details: `Hired candidate ${candidate.fullName} as ${args.designation} (${args.employeeCode})`,
      timestamp: now,
    });

    return empId;
  },
});
