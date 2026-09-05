import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const listRuns = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(ctx, "payroll.view", args.organizationId);

    return await ctx.db
      .query("payrollRuns")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});

export const listPayslips = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    employeeId: v.optional(v.string()),
    payrollRunId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "payroll.view",
      args.organizationId
    );

    let payslips = await ctx.db
      .query("payslips")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    // Security check: Regular employees can only ever view their own payslips
    if (role === "EMPLOYEE") {
      const myEmpId = user?.employeeId;
      if (!myEmpId) return [];
      return payslips.filter((p) => p.employeeId === myEmpId);
    }

    if (args.employeeId) {
      payslips = payslips.filter((p) => p.employeeId === args.employeeId);
    }

    if (args.payrollRunId) {
      payslips = payslips.filter((p) => p.payrollRunId === args.payrollRunId);
    }

    return payslips;
  },
});

export const createRun = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    payPeriodMonth: v.string(), // e.g., "September 2026"
    payPeriodCode: v.string(), // e.g., "PAY-2026-09"
    startDate: v.string(),
    endDate: v.string(),
    disbursementDate: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "payroll.manage",
      args.organizationId
    );

    // Fetch active employees
    const activeEmployees = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.neq(q.field("status"), "INACTIVE"))
      .collect();

    let totalGross = 0;
    let totalDeductions = 0;

    activeEmployees.forEach((emp) => {
      const basic = emp.salary || 0;
      const hra = Math.round(basic * 0.4);
      const conveyance = 1600;
      const medical = 1250;
      const special = Math.round(basic * 0.15);
      const gross = basic + hra + conveyance + medical + special;

      const pf = Math.round(basic * 0.12);
      const tax = Math.round(gross * 0.1);
      const pt = 200;
      const deductions = pf + tax + pt;

      totalGross += gross;
      totalDeductions += deductions;
    });

    const totalNet = totalGross - totalDeductions;
    const now = new Date().toISOString();

    const runId = await ctx.db.insert("payrollRuns", {
      organizationId,
      payPeriodMonth: args.payPeriodMonth,
      payPeriodCode: args.payPeriodCode,
      startDate: args.startDate,
      endDate: args.endDate,
      totalEmployees: activeEmployees.length,
      totalGross,
      totalDeductions,
      totalNet,
      status: "DRAFT",
      processedBy: user?.name || "HR Admin",
      processedAt: now,
      disbursementDate: args.disbursementDate,
    });

    return runId;
  },
});

export const processRun = mutation({
  args: {
    runId: v.id("payrollRuns"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "payroll.manage",
      args.organizationId
    );

    const run = await ctx.db.get(args.runId);
    if (!run || run.organizationId !== organizationId) {
      throw new Error("Payroll run not found.");
    }

    if (run.status === "COMPLETED") {
      throw new Error("Payroll run has already been processed.");
    }

    const now = new Date().toISOString();

    // Fetch active employees to generate payslips
    const activeEmployees = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.neq(q.field("status"), "INACTIVE"))
      .collect();

    for (const emp of activeEmployees) {
      const basic = emp.salary || 0;
      const hra = Math.round(basic * 0.4);
      const conveyance = 1600;
      const medical = 1250;
      const special = Math.round(basic * 0.15);
      const bonus = 0;
      const overtimePay = 0;
      const grossEarnings = basic + hra + conveyance + medical + special + bonus + overtimePay;

      const pf = Math.round(basic * 0.12);
      const tax = Math.round(grossEarnings * 0.1);
      const pt = 200;
      const totalDeductions = pf + tax + pt;
      const netPayable = grossEarnings - totalDeductions;

      await ctx.db.insert("payslips", {
        organizationId,
        payrollRunId: args.runId,
        employeeId: emp._id,
        employeeName: emp.fullName,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        departmentName: emp.departmentName,
        bankAccountNumber: emp.bankAccountNumber || "•••• 4892",
        panNumber: emp.taxIdentificationNumber || "ABCDE1234F",
        payPeriod: run.payPeriodMonth,
        paymentDate: run.disbursementDate,
        paymentStatus: "PAID",
        basicSalary: basic,
        hra,
        conveyanceAllowance: conveyance,
        medicalAllowance: medical,
        specialAllowance: special,
        bonus,
        overtimePay,
        grossEarnings,
        providentFund: pf,
        incomeTax: tax,
        professionalTax: pt,
        otherDeductions: 0,
        totalDeductions,
        netPayable,
        currency: emp.currency || "USD",
        generatedAt: now,
      });

      // Notification for employee
      await ctx.db.insert("notifications", {
        organizationId,
        userId: emp._id,
        title: `Payslip Available - ${run.payPeriodMonth}`,
        message: `Your payslip for ${run.payPeriodMonth} has been disbursed and is available for download.`,
        type: "PAYROLL",
        isRead: false,
        linkUrl: "/payroll/payslips",
        createdAt: now,
      });
    }

    await ctx.db.patch(args.runId, {
      status: "COMPLETED",
      processedAt: now,
      processedBy: user?.name || "HR Admin",
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "system",
      userName: user?.name || "HR Administrator",
      userRole: user?.role || "HR_ADMIN",
      action: "PAYROLL_PROCESSED",
      entity: "PAYROLL",
      entityId: args.runId,
      details: `Processed and disbursed payroll run ${run.payPeriodCode} (${run.payPeriodMonth}) for ${activeEmployees.length} employees`,
      timestamp: now,
    });

    return { success: true };
  },
});
