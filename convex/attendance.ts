import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const getToday = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    date: v.optional(v.string()), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.view",
      args.organizationId
    );

    const targetDate = args.date || new Date().toISOString().split("T")[0];

    return await ctx.db
      .query("attendance")
      .withIndex("by_org_date", (q) =>
        q.eq("organizationId", organizationId).eq("date", targetDate)
      )
      .collect();
  },
});

export const getByEmployee = query({
  args: {
    employeeId: v.string(),
    organizationId: v.optional(v.id("organizations")),
    month: v.optional(v.string()), // YYYY-MM
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.view",
      args.organizationId
    );

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_employee_date", (q) => q.eq("employeeId", args.employeeId))
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .collect();

    if (args.month) {
      return records.filter((r) => r.date.startsWith(args.month!));
    }

    return records;
  },
});

export const clockIn = mutation({
  args: {
    employeeId: v.string(),
    organizationId: v.optional(v.id("organizations")),
    workMode: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.view",
      args.organizationId
    );

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("_id"), args.employeeId))
      .first();

    if (!employee) {
      throw new Error("Employee not found.");
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const nowTimeStr = new Date().toTimeString().slice(0, 8); // HH:MM:SS

    // Check if attendance already exists for today
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_employee_date", (q) =>
        q.eq("employeeId", args.employeeId).eq("date", todayStr)
      )
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();

    if (existing) {
      if (existing.clockInTime && !existing.clockOutTime) {
        throw new Error(`Already clocked in at ${existing.clockInTime}. Please clock out first.`);
      }
      if (existing.clockInTime && existing.clockOutTime) {
        throw new Error(`Already completed attendance for today (${existing.clockInTime} - ${existing.clockOutTime}).`);
      }
    }

    // Determine status (LATE if past 09:30 AM)
    const [hours, minutes] = nowTimeStr.split(":").map(Number);
    const isLate = hours > 9 || (hours === 9 && minutes > 30);
    const initialStatus = isLate ? "LATE" : "PRESENT";

    if (existing) {
      await ctx.db.patch(existing._id, {
        clockInTime: nowTimeStr,
        status: initialStatus,
        workMode: args.workMode || "On-site",
        location: args.location || "Office HQ",
      });
      return existing._id;
    }

    return await ctx.db.insert("attendance", {
      organizationId,
      employeeId: args.employeeId,
      employeeName: employee.fullName,
      employeeCode: employee.employeeCode,
      departmentName: employee.departmentName,
      date: todayStr,
      clockInTime: nowTimeStr,
      clockOutTime: undefined,
      totalHours: 0,
      status: initialStatus,
      workMode: args.workMode || "On-site",
      location: args.location || "Office HQ",
    });
  },
});

export const clockOut = mutation({
  args: {
    employeeId: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.view",
      args.organizationId
    );

    const todayStr = new Date().toISOString().split("T")[0];
    const nowTimeStr = new Date().toTimeString().slice(0, 8); // HH:MM:SS

    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_employee_date", (q) =>
        q.eq("employeeId", args.employeeId).eq("date", todayStr)
      )
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();

    if (!existing || !existing.clockInTime) {
      throw new Error("Cannot clock out: No clock-in record found for today.");
    }

    if (existing.clockOutTime) {
      throw new Error(`Already clocked out at ${existing.clockOutTime}.`);
    }

    // Compute working hours
    const [inH, inM, inS] = existing.clockInTime.split(":").map(Number);
    const [outH, outM, outS] = nowTimeStr.split(":").map(Number);

    const inTotalMinutes = inH * 60 + inM;
    const outTotalMinutes = outH * 60 + outM;
    const diffMinutes = Math.max(0, outTotalMinutes - inTotalMinutes);
    const workedHours = Number((diffMinutes / 60).toFixed(2));

    const finalStatus = workedHours < 4 ? "HALF_DAY" : existing.status;

    await ctx.db.patch(existing._id, {
      clockOutTime: nowTimeStr,
      totalHours: workedHours,
      status: finalStatus,
    });

    return {
      success: true,
      clockIn: existing.clockInTime,
      clockOut: nowTimeStr,
      totalHours: workedHours,
    };
  },
});

export const requestCorrection = mutation({
  args: {
    employeeId: v.string(),
    organizationId: v.optional(v.id("organizations")),
    date: v.string(),
    requestedClockIn: v.string(),
    requestedClockOut: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.view",
      args.organizationId
    );

    const emp = await ctx.db
      .query("employees")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("_id"), args.employeeId))
      .first();

    if (!emp) throw new Error("Employee not found.");

    const now = new Date().toISOString();
    return await ctx.db.insert("attendanceCorrections", {
      organizationId,
      employeeId: args.employeeId,
      employeeName: emp.fullName,
      date: args.date,
      requestedClockIn: args.requestedClockIn,
      requestedClockOut: args.requestedClockOut,
      reason: args.reason,
      status: "PENDING",
      createdAt: now,
    });
  },
});

export const approveCorrection = mutation({
  args: {
    correctionId: v.id("attendanceCorrections"),
    organizationId: v.optional(v.id("organizations")),
    approved: v.boolean(),
    approverNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuthAndOrg(
      ctx,
      "attendance.manage",
      args.organizationId
    );

    const corr = await ctx.db.get(args.correctionId);
    if (!corr || corr.organizationId !== organizationId) {
      throw new Error("Correction request not found.");
    }

    await ctx.db.patch(args.correctionId, {
      status: args.approved ? "APPROVED" : "REJECTED",
      approverNotes: args.approverNotes,
    });

    if (args.approved) {
      // Find and update or insert attendance record
      const existing = await ctx.db
        .query("attendance")
        .withIndex("by_employee_date", (q) =>
          q.eq("employeeId", corr.employeeId).eq("date", corr.date)
        )
        .first();

      const [inH, inM] = corr.requestedClockIn.split(":").map(Number);
      const [outH, outM] = corr.requestedClockOut.split(":").map(Number);
      const workedHours = Number((Math.max(0, (outH * 60 + outM) - (inH * 60 + inM)) / 60).toFixed(2));

      if (existing) {
        await ctx.db.patch(existing._id, {
          clockInTime: corr.requestedClockIn,
          clockOutTime: corr.requestedClockOut,
          totalHours: workedHours,
          status: "PRESENT",
          notes: `Corrected via request: ${corr.reason}`,
        });
      }
    }

    return { success: true };
  },
});
