import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const getSummaryMetrics = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "reports.view",
      args.organizationId
    );

    const employees = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    const activeEmployees = employees.filter((e) => e.status !== "INACTIVE" && e.status !== "TERMINATED");

    const todayStr = new Date().toISOString().split("T")[0];
    const todayAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_org_date", (q) =>
        q.eq("organizationId", organizationId).eq("date", todayStr)
      )
      .collect();

    const presentToday = todayAttendance.filter((a) => a.clockInTime).length;

    // Approved leaves covering today
    const leaves = await ctx.db
      .query("leaveRequests")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    const onLeaveToday = leaves.filter(
      (l) => l.status === "APPROVED" && l.startDate <= todayStr && l.endDate >= todayStr
    ).length;

    // Departments breakdown
    const departments = await ctx.db
      .query("departments")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    const departmentStats = departments.map((d) => {
      const count = activeEmployees.filter((e) => e.departmentId === d._id).length;
      return {
        departmentId: d._id,
        name: d.name,
        code: d.code,
        headcount: count,
        annualBudget: d.annualBudget,
      };
    });

    // Total monthly payroll liability
    const monthlyPayrollTotal = activeEmployees.reduce((acc, curr) => acc + (curr.salary || 0), 0);

    // Open Jobs
    const jobs = await ctx.db
      .query("recruitmentJobs")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    const openJobsCount = jobs.filter((j) => j.status === "OPEN").length;

    return {
      totalEmployees: activeEmployees.length,
      presentToday,
      onLeaveToday,
      monthlyPayrollTotal,
      openJobsCount,
      departmentStats,
      totalDepartments: departments.length,
    };
  },
});
