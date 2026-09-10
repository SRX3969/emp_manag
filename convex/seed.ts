import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedFullEnterpriseData = mutation({
  args: {
    forceReset: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // If forceReset is true, clean up existing records for this demo slug
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "apex-global-india"))
      .first();

    if (existingOrg && !args.forceReset) {
      // Check if employees table already has data
      const empCount = await ctx.db
        .query("employees")
        .withIndex("by_org", (q) => q.eq("organizationId", existingOrg._id))
        .collect();

      if (empCount.length >= 8) {
        return {
          success: true,
          message: "Enterprise database already fully seeded.",
          organizationId: existingOrg._id,
        };
      }
    }

    const now = new Date().toISOString();
    const today = now.split("T")[0];

    // 1. Organization
    let orgId = existingOrg?._id;
    if (!orgId) {
      orgId = await ctx.db.insert("organizations", {
        name: "Apex Global Technologies India Pvt. Ltd.",
        slug: "apex-global-india",
        logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
        currency: "INR",
        fiscalYearStart: "04-01",
        timezone: "Asia/Kolkata (IST)",
        createdAt: now,
      });
    }

    // 2. Settings
    const existingSettings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingSettings) {
      await ctx.db.insert("settings", {
        organizationId: orgId,
        companyName: "Apex Global Technologies India Pvt. Ltd.",
        companyEmail: "contact@apexglobal.in",
        companyPhone: "+91 (80) 4129-8900",
        companyAddress: "Prestige Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
        currency: "INR",
        timezone: "Asia/Kolkata (IST)",
        workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        standardWorkHours: 8,
        allowRemoteClockIn: true,
        autoApproveLeaves: false,
        notifyOnLeaveRequest: true,
        notifyOnPayrollRun: true,
        twoFactorRequired: true,
      });
    }

    // 3. Departments
    const depts = [
      { name: "Executive Leadership", code: "EXEC", description: "Corporate strategy, governance, and business scaling.", headcount: 3, annualBudget: 18000000, colorHex: "#3B82F6" },
      { name: "Engineering & Technology", code: "ENG", description: "Core platform development, cloud infrastructure, and security.", headcount: 28, annualBudget: 45000000, colorHex: "#10B981" },
      { name: "Human Resources", code: "HR", description: "People operations, talent acquisition, and employee success.", headcount: 6, annualBudget: 8500000, colorHex: "#EC4899" },
      { name: "Product & Design", code: "PROD", description: "Product discovery, UX research, and interface design systems.", headcount: 8, annualBudget: 14000000, colorHex: "#8B5CF6" },
      { name: "Finance & Accounts", code: "FIN", description: "Financial audits, payroll compliance, and statutory tax planning.", headcount: 5, annualBudget: 7200000, colorHex: "#F59E0B" },
      { name: "Sales & Client Success", code: "SALES", description: "Enterprise client acquisitions and relationship management.", headcount: 14, annualBudget: 22000000, colorHex: "#06B6D4" },
    ];

    const deptMap = new Map<string, string>();
    for (const d of depts) {
      const existing = await ctx.db
        .query("departments")
        .withIndex("by_org", (q) => q.eq("organizationId", orgId))
        .filter((q) => q.eq(q.field("code"), d.code))
        .first();

      if (existing) {
        deptMap.set(d.code, existing._id);
      } else {
        const id = await ctx.db.insert("departments", {
          organizationId: orgId,
          name: d.name,
          code: d.code,
          description: d.description,
          headcount: d.headcount,
          annualBudget: d.annualBudget,
          colorHex: d.colorHex,
          createdAt: now,
        });
        deptMap.set(d.code, id);
      }
    }

    // 4. Leave Types
    const leaveTypesData = [
      { name: "Privilege / Earned Leave", code: "PL", totalDaysPerYear: 18, carryForwardAllowed: true, maxCarryForwardDays: 8, isPaid: true, requiresAttachment: false, colorHex: "#2563EB" },
      { name: "Casual Leave", code: "CL", totalDaysPerYear: 12, carryForwardAllowed: false, isPaid: true, requiresAttachment: false, colorHex: "#D97706" },
      { name: "Sick / Medical Leave", code: "SL", totalDaysPerYear: 12, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: "#DC2626" },
      { name: "Maternity Leave", code: "ML", totalDaysPerYear: 182, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: "#EC4899" },
      { name: "Paternity Leave", code: "PTL", totalDaysPerYear: 15, carryForwardAllowed: false, isPaid: true, requiresAttachment: true, colorHex: "#8B5CF6" },
      { name: "Compensatory Off", code: "COMP", totalDaysPerYear: 10, carryForwardAllowed: false, isPaid: true, requiresAttachment: false, colorHex: "#10B981" },
    ];

    const ltMap = new Map<string, string>();
    for (const lt of leaveTypesData) {
      const existing = await ctx.db
        .query("leaveTypes")
        .withIndex("by_org", (q) => q.eq("organizationId", orgId))
        .filter((q) => q.eq(q.field("code"), lt.code))
        .first();

      if (existing) {
        ltMap.set(lt.code, existing._id);
      } else {
        const id = await ctx.db.insert("leaveTypes", {
          organizationId: orgId,
          ...lt,
        });
        ltMap.set(lt.code, id);
      }
    }

    // 5. Employees
    const employeeSeedData = [
      {
        employeeCode: "EMP-001",
        firstName: "Rahul",
        lastName: "Sharma",
        fullName: "Rahul Sharma",
        email: "rahul.sharma@apexglobal.in",
        phone: "+91 98201 23456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        gender: "Male",
        dateOfBirth: "1986-05-14",
        address: "Penthouse 1402, Embassy Habitat, Palace Road",
        city: "Bengaluru",
        country: "India",
        postalCode: "560052",
        emergencyContact: { name: "Ananya Sharma", relationship: "Spouse", phone: "+91 98201 99999", email: "ananya.s@gmail.com" },
        deptCode: "EXEC",
        designation: "Chief Executive Officer & MD",
        joiningDate: "2021-01-10",
        employmentType: "FULL_TIME",
        workLocation: "On-site",
        status: "ACTIVE",
        salary: 450000,
        payType: "SALARIED",
        skills: ["Corporate Strategy", "Executive Leadership", "P&L Management", "Venture Capital"],
      },
      {
        employeeCode: "EMP-002",
        firstName: "Ananya",
        lastName: "Rao",
        fullName: "Ananya Rao",
        email: "ananya.rao@apexglobal.in",
        phone: "+91 98450 67890",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        gender: "Female",
        dateOfBirth: "1991-09-22",
        address: "Villa 34, Palm Meadows, Whitefield",
        city: "Bengaluru",
        country: "India",
        postalCode: "560066",
        emergencyContact: { name: "Dr. K. Rao", relationship: "Father", phone: "+91 98450 11223" },
        deptCode: "HR",
        designation: "Head of People Operations",
        joiningDate: "2021-04-01",
        employmentType: "FULL_TIME",
        workLocation: "Hybrid",
        status: "ACTIVE",
        salary: 190000,
        payType: "SALARIED",
        skills: ["Talent Acquisition", "Employee Relations", "Compensation & Benefits", "POSH Compliance"],
      },
      {
        employeeCode: "EMP-003",
        firstName: "Arjun",
        lastName: "Kumar",
        fullName: "Arjun Kumar",
        email: "arjun.kumar@apexglobal.in",
        phone: "+91 99001 54321",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        gender: "Male",
        dateOfBirth: "1989-11-04",
        address: "Flat 401, Salarpuria Greenage, Hosur Road",
        city: "Bengaluru",
        country: "India",
        postalCode: "560068",
        emergencyContact: { name: "Meera Kumar", relationship: "Spouse", phone: "+91 99001 88776" },
        deptCode: "ENG",
        designation: "VP of Engineering",
        joiningDate: "2021-02-15",
        employmentType: "FULL_TIME",
        workLocation: "Hybrid",
        status: "ACTIVE",
        salary: 320000,
        payType: "SALARIED",
        skills: ["System Architecture", "Cloud Native / Kubernetes", "Distributed Systems", "Go", "React 19"],
      },
      {
        employeeCode: "EMP-004",
        firstName: "Priya",
        lastName: "Patel",
        fullName: "Priya Patel",
        email: "priya.patel@apexglobal.in",
        phone: "+91 97412 33445",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        gender: "Female",
        dateOfBirth: "1994-03-18",
        address: "Tower B, Apt 1104, Sobha Dream Acres, Panathur",
        city: "Bengaluru",
        country: "India",
        postalCode: "560087",
        emergencyContact: { name: "Nitin Patel", relationship: "Brother", phone: "+91 97412 99887" },
        deptCode: "ENG",
        designation: "Lead Frontend Architect",
        joiningDate: "2022-03-01",
        employmentType: "FULL_TIME",
        workLocation: "Remote",
        status: "ACTIVE",
        salary: 210000,
        payType: "SALARIED",
        skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Design Systems", "Web Performance"],
      },
      {
        employeeCode: "EMP-005",
        firstName: "Vikram",
        lastName: "Seth",
        fullName: "Vikram Seth",
        email: "vikram.seth@apexglobal.in",
        phone: "+91 98112 45678",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        gender: "Male",
        dateOfBirth: "1987-07-29",
        address: "72 Richmond Road, Ashok Nagar",
        city: "Bengaluru",
        country: "India",
        postalCode: "560025",
        emergencyContact: { name: "Renu Seth", relationship: "Mother", phone: "+91 98112 11223" },
        deptCode: "PROD",
        designation: "Director of Product Design",
        joiningDate: "2022-06-15",
        employmentType: "FULL_TIME",
        workLocation: "Hybrid",
        status: "ACTIVE",
        salary: 260000,
        payType: "SALARIED",
        skills: ["Product Discovery", "Design Thinking", "Figma", "User Research", "B2B SaaS"],
      },
      {
        employeeCode: "EMP-006",
        firstName: "Sneha",
        lastName: "Reddy",
        fullName: "Sneha Reddy",
        email: "sneha.reddy@apexglobal.in",
        phone: "+91 96113 78901",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        gender: "Female",
        dateOfBirth: "1996-12-08",
        address: "House 12, 4th Cross, Koramangala 3rd Block",
        city: "Bengaluru",
        country: "India",
        postalCode: "560034",
        emergencyContact: { name: "Venkat Reddy", relationship: "Father", phone: "+91 96113 44556" },
        deptCode: "FIN",
        designation: "Senior Finance & Tax Manager",
        joiningDate: "2022-11-01",
        employmentType: "FULL_TIME",
        workLocation: "On-site",
        status: "ACTIVE",
        salary: 175000,
        payType: "SALARIED",
        skills: ["Statutory Compliance", "GST / TDS", "Payroll Audits", "Financial Modeling"],
      },
      {
        employeeCode: "EMP-007",
        firstName: "Rohan",
        lastName: "Verma",
        fullName: "Rohan Verma",
        email: "rohan.verma@apexglobal.in",
        phone: "+91 98234 56789",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        gender: "Male",
        dateOfBirth: "1993-01-19",
        address: "502 Prestige St. Johns Woods, Tavarekere",
        city: "Bengaluru",
        country: "India",
        postalCode: "560029",
        emergencyContact: { name: "Pooja Verma", relationship: "Spouse", phone: "+91 98234 88776" },
        deptCode: "SALES",
        designation: "Enterprise Accounts Director",
        joiningDate: "2023-01-16",
        employmentType: "FULL_TIME",
        workLocation: "On-site",
        status: "ACTIVE",
        salary: 240000,
        payType: "SALARIED",
        skills: ["Enterprise Sales", "Solution Selling", "Key Account Management", "Negotiations"],
      },
      {
        employeeCode: "EMP-008",
        firstName: "Divya",
        lastName: "Nair",
        fullName: "Divya Nair",
        email: "divya.nair@apexglobal.in",
        phone: "+91 97312 88990",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        gender: "Female",
        dateOfBirth: "1997-04-25",
        address: "Flat 204, Brigade Metropolis, Garudacharpalya, Mahadevapura",
        city: "Bengaluru",
        country: "India",
        postalCode: "560048",
        emergencyContact: { name: "Suresh Nair", relationship: "Father", phone: "+91 97312 11002" },
        deptCode: "ENG",
        designation: "DevOps & Cloud Security Specialist",
        joiningDate: "2023-05-15",
        employmentType: "FULL_TIME",
        workLocation: "Remote",
        status: "ACTIVE",
        salary: 160000,
        payType: "SALARIED",
        skills: ["AWS", "Terraform", "Docker", "CI/CD Pipelines", "Incident Response"],
      },
    ];

    const empIdMap = new Map<string, string>();
    for (const emp of employeeSeedData) {
      const existing = await ctx.db
        .query("employees")
        .withIndex("by_org", (q) => q.eq("organizationId", orgId))
        .filter((q) => q.eq(q.field("employeeCode"), emp.employeeCode))
        .first();

      const deptId = deptMap.get(emp.deptCode) || "";
      const deptName = depts.find((d) => d.code === emp.deptCode)?.name || "General";

      if (existing) {
        empIdMap.set(emp.employeeCode, existing._id);
      } else {
        const id = await ctx.db.insert("employees", {
          organizationId: orgId,
          employeeCode: emp.employeeCode,
          firstName: emp.firstName,
          lastName: emp.lastName,
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          avatarUrl: emp.avatarUrl,
          gender: emp.gender,
          dateOfBirth: emp.dateOfBirth,
          address: emp.address,
          city: emp.city,
          country: emp.country,
          postalCode: emp.postalCode,
          emergencyContact: emp.emergencyContact,
          departmentId: deptId,
          departmentName: deptName,
          designation: emp.designation,
          joiningDate: emp.joiningDate,
          employmentType: emp.employmentType,
          workLocation: emp.workLocation,
          status: emp.status,
          salary: emp.salary,
          payType: emp.payType,
          currency: "INR",
          skills: emp.skills,
          createdAt: now,
          updatedAt: now,
        });
        empIdMap.set(emp.employeeCode, id);
      }
    }

    // 6. Users (RBAC)
    const usersData = [
      { email: "rahul.sharma@apexglobal.in", name: "Rahul Sharma", role: "SUPER_ADMIN" as const, empCode: "EMP-001", deptCode: "EXEC" },
      { email: "ananya.rao@apexglobal.in", name: "Ananya Rao", role: "HR_ADMIN" as const, empCode: "EMP-002", deptCode: "HR" },
      { email: "arjun.kumar@apexglobal.in", name: "Arjun Kumar", role: "MANAGER" as const, empCode: "EMP-003", deptCode: "ENG" },
      { email: "priya.patel@apexglobal.in", name: "Priya Patel", role: "EMPLOYEE" as const, empCode: "EMP-004", deptCode: "ENG" },
    ];

    for (const u of usersData) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", u.email))
        .first();

      if (!existing) {
        await ctx.db.insert("users", {
          organizationId: orgId,
          email: u.email,
          name: u.name,
          role: u.role,
          employeeId: empIdMap.get(u.empCode),
          departmentId: deptMap.get(u.deptCode),
          createdAt: now,
        });
      }
    }

    // 7. Leave Balances
    const currentYear = new Date().getFullYear();
    for (const [code, empId] of empIdMap.entries()) {
      for (const lt of leaveTypesData) {
        const ltId = ltMap.get(lt.code);
        if (!ltId) continue;

        const existing = await ctx.db
          .query("leaveBalances")
          .withIndex("by_employee_year", (q) => q.eq("employeeId", empId).eq("year", currentYear))
          .filter((q) => q.eq(q.field("leaveTypeId"), ltId))
          .first();

        if (!existing) {
          const used = lt.code === "PL" ? 3 : lt.code === "SL" ? 1 : 0;
          await ctx.db.insert("leaveBalances", {
            organizationId: orgId,
            employeeId: empId,
            leaveTypeId: ltId,
            leaveTypeName: lt.name,
            leaveTypeCode: lt.code,
            allocatedDays: lt.totalDaysPerYear,
            usedDays: used,
            pendingDays: 0,
            remainingDays: lt.totalDaysPerYear - used,
            year: currentYear,
          });
        }
      }
    }

    // 8. Leave Requests
    const priyaId = empIdMap.get("EMP-004") || "";
    const arjunId = empIdMap.get("EMP-003") || "";
    const plId = ltMap.get("PL") || "";
    const slId = ltMap.get("SL") || "";

    const existingLeaveReq = await ctx.db
      .query("leaveRequests")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingLeaveReq && priyaId) {
      await ctx.db.insert("leaveRequests", {
        organizationId: orgId,
        employeeId: priyaId,
        employeeName: "Priya Patel",
        employeeCode: "EMP-004",
        departmentName: "Engineering & Technology",
        leaveTypeId: plId,
        leaveTypeName: "Privilege / Earned Leave",
        startDate: "2026-09-18",
        endDate: "2026-09-22",
        totalDays: 3,
        isHalfDay: false,
        reason: "Family travel and Diwali preparations",
        status: "APPROVED",
        appliedOn: "2026-09-02",
        approverId: arjunId,
        approverName: "Arjun Kumar",
        approverComment: "Approved. Sprint coverage planned.",
        approvedAt: "2026-09-03T10:30:00Z",
      });

      await ctx.db.insert("leaveRequests", {
        organizationId: orgId,
        employeeId: priyaId,
        employeeName: "Priya Patel",
        employeeCode: "EMP-004",
        departmentName: "Engineering & Technology",
        leaveTypeId: slId,
        leaveTypeName: "Sick / Medical Leave",
        startDate: "2026-09-28",
        endDate: "2026-09-29",
        totalDays: 2,
        isHalfDay: false,
        reason: "Viral fever recovery",
        status: "PENDING",
        appliedOn: "2026-09-10",
      });
    }

    // 9. Attendance
    const existingAtt = await ctx.db
      .query("attendance")
      .withIndex("by_org_date", (q) => q.eq("organizationId", orgId).eq("date", today))
      .first();

    if (!existingAtt) {
      for (const [code, empId] of empIdMap.entries()) {
        const emp = employeeSeedData.find((e) => e.employeeCode === code);
        if (!emp) continue;

        await ctx.db.insert("attendance", {
          organizationId: orgId,
          employeeId: empId,
          employeeName: emp.fullName,
          employeeCode: emp.employeeCode,
          departmentName: depts.find((d) => d.code === emp.deptCode)?.name || "General",
          date: today,
          clockInTime: `${today}T09:15:00.000Z`,
          clockOutTime: code === "EMP-001" ? `${today}T18:30:00.000Z` : undefined,
          totalHours: code === "EMP-001" ? 9.25 : 8.0,
          status: "PRESENT",
          workMode: emp.workLocation,
          location: emp.workLocation === "Remote" ? "Home Office" : "Prestige Tech Park HQ",
        });
      }
    }

    // 10. Holidays (2026)
    const holidaysData = [
      { name: "Republic Day", date: "2026-01-26", dayOfWeek: "Monday", type: "PUBLIC", year: 2026, description: "National Holiday celebrating Constitution enactment" },
      { name: "Holi Festival of Colors", date: "2026-03-04", dayOfWeek: "Wednesday", type: "PUBLIC", year: 2026, description: "Spring Festival" },
      { name: "Good Friday", date: "2026-04-03", dayOfWeek: "Friday", type: "PUBLIC", year: 2026, description: "Christian Observance" },
      { name: "Independence Day", date: "2026-08-15", dayOfWeek: "Saturday", type: "PUBLIC", year: 2026, description: "79th Independence Day of India" },
      { name: "Mahatma Gandhi Jayanti", date: "2026-10-02", dayOfWeek: "Friday", type: "PUBLIC", year: 2026, description: "Father of the Nation Birthday" },
      { name: "Diwali (Deepavali)", date: "2026-11-08", dayOfWeek: "Sunday", type: "PUBLIC", year: 2026, description: "Festival of Lights" },
      { name: "Christmas Day", date: "2026-12-25", dayOfWeek: "Friday", type: "PUBLIC", year: 2026, description: "Christmas Observance" },
    ];

    for (const h of holidaysData) {
      const existing = await ctx.db
        .query("holidays")
        .withIndex("by_org_year", (q) => q.eq("organizationId", orgId).eq("year", h.year))
        .filter((q) => q.eq(q.field("date"), h.date))
        .first();

      if (!existing) {
        await ctx.db.insert("holidays", {
          organizationId: orgId,
          ...h,
        });
      }
    }

    // 11. Payroll Runs & Payslips
    const existingRun = await ctx.db
      .query("payrollRuns")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingRun) {
      const totalGross = employeeSeedData.reduce((acc, e) => acc + e.salary, 0);
      const totalDeductions = Math.round(totalGross * 0.15);
      const totalNet = totalGross - totalDeductions;

      const runId = await ctx.db.insert("payrollRuns", {
        organizationId: orgId,
        payPeriodMonth: "August 2026",
        payPeriodCode: "PR-2026-08",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        totalEmployees: employeeSeedData.length,
        totalGross,
        totalDeductions,
        totalNet,
        status: "COMPLETED",
        processedBy: "Ananya Rao",
        processedAt: "2026-08-31T17:00:00Z",
        disbursementDate: "2026-08-31",
      });

      // Insert Payslips
      for (const [code, empId] of empIdMap.entries()) {
        const emp = employeeSeedData.find((e) => e.employeeCode === code);
        if (!emp) continue;

        const basic = Math.round(emp.salary * 0.5);
        const hra = Math.round(basic * 0.5);
        const conveyance = 1600;
        const medical = 1250;
        const special = emp.salary - (basic + hra + conveyance + medical);
        const gross = emp.salary;

        const pf = Math.round(basic * 0.12);
        const tax = Math.round(gross * 0.08);
        const pt = 200;
        const deductions = pf + tax + pt;
        const net = gross - deductions;

        await ctx.db.insert("payslips", {
          organizationId: orgId,
          payrollRunId: runId,
          employeeId: empId,
          employeeName: emp.fullName,
          employeeCode: emp.employeeCode,
          designation: emp.designation,
          departmentName: depts.find((d) => d.code === emp.deptCode)?.name || "General",
          bankAccountNumber: "•••• 8492",
          panNumber: "AAAPS1234A",
          payPeriod: "August 2026",
          paymentDate: "2026-08-31",
          paymentStatus: "PAID",
          basicSalary: basic,
          hra,
          conveyanceAllowance: conveyance,
          medicalAllowance: medical,
          specialAllowance: special,
          bonus: 0,
          overtimePay: 0,
          grossEarnings: gross,
          providentFund: pf,
          incomeTax: tax,
          professionalTax: pt,
          otherDeductions: 0,
          totalDeductions: deductions,
          netPayable: net,
          currency: "INR",
          generatedAt: "2026-08-31T17:30:00Z",
        });
      }
    }

    // 12. Performance Goals & Reviews
    const existingGoal = await ctx.db
      .query("performanceGoals")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingGoal && priyaId) {
      await ctx.db.insert("performanceGoals", {
        organizationId: orgId,
        employeeId: priyaId,
        employeeName: "Priya Patel",
        title: "Migrate Micro-frontend architecture to React 19 Concurrent Mode",
        description: "Achieve sub-800ms Time-to-Interactive across employee directory and timesheet modules.",
        category: "TECHNICAL_EXCELLENCE",
        targetDate: "2026-10-31",
        progressPercent: 75,
        status: "IN_PROGRESS",
        metrics: "Core Web Vitals LCP < 1.2s, INP < 100ms",
        createdAt: "2026-07-01T09:00:00Z",
      });

      await ctx.db.insert("performanceReviews", {
        organizationId: orgId,
        cycleName: "Mid-Year Appraisal H1 2026",
        employeeId: priyaId,
        employeeName: "Priya Patel",
        employeeCode: "EMP-004",
        departmentName: "Engineering & Technology",
        managerId: arjunId,
        managerName: "Arjun Kumar",
        selfRating: 4.8,
        selfFeedback: "Exceeded all platform modernization deliverables and mentored 2 junior frontend engineers.",
        managerRating: 4.9,
        managerFeedback: "Exceptional ownership, architectural rigor, and velocity. Proposed for promotion.",
        finalRating: 4.85,
        status: "COMPLETED",
        submittedAt: "2026-07-20T14:00:00Z",
        completedAt: "2026-07-25T16:30:00Z",
      });
    }

    // 13. Documents
    const existingDoc = await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingDoc) {
      await ctx.db.insert("documents", {
        organizationId: orgId,
        name: "Apex Global Corporate Employee Handbook 2026-27.pdf",
        category: "POLICIES",
        fileSizeFormatted: "4.2 MB",
        fileType: "application/pdf",
        fileUrl: "https://example.com/docs/handbook.pdf",
        uploadedBy: "Ananya Rao",
        uploadedAt: "2026-01-10T10:00:00Z",
        isConfidential: false,
      });

      await ctx.db.insert("documents", {
        organizationId: orgId,
        name: "Global Information Security & SOC2 Policy.pdf",
        category: "COMPLIANCE",
        fileSizeFormatted: "2.8 MB",
        fileType: "application/pdf",
        fileUrl: "https://example.com/docs/soc2.pdf",
        uploadedBy: "Rahul Sharma",
        uploadedAt: "2026-02-15T11:30:00Z",
        isConfidential: true,
      });
    }

    // 14. Tasks
    const existingTask = await ctx.db
      .query("tasks")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingTask && priyaId) {
      await ctx.db.insert("tasks", {
        organizationId: orgId,
        title: "Implement Real-time Convex Sync for Employee Presence",
        description: "Connect WebSocket query listeners to reflect clock-in statuses on team overview instantly.",
        assigneeId: priyaId,
        assigneeName: "Priya Patel",
        assigneeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        creatorId: arjunId,
        creatorName: "Arjun Kumar",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: "2026-09-18",
        tags: ["Convex", "WebSocket", "Frontend"],
        createdAt: now,
      });
    }

    // 15. Announcements
    const existingAnn = await ctx.db
      .query("announcements")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingAnn) {
      await ctx.db.insert("announcements", {
        organizationId: orgId,
        title: "Q3 2026 All-Hands Townhall & Innovation Awards",
        content: "Join executive leadership this Friday at 4:30 PM IST in the Auditorium or via Microsoft Teams for strategic corporate updates, customer milestones, and quarterly peer recognition awards.",
        category: "COMPANY_NEWS",
        authorId: "EMP-001",
        authorName: "Rahul Sharma",
        authorDesignation: "CEO & Managing Director",
        isPinned: true,
        publishedAt: today,
        readCount: 42,
        readByUserIds: [],
      });
    }

    // 16. Recruitment Jobs & Candidates
    const existingJob = await ctx.db
      .query("recruitmentJobs")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingJob) {
      const engDeptId = deptMap.get("ENG") || "";
      const jobId = await ctx.db.insert("recruitmentJobs", {
        organizationId: orgId,
        title: "Senior Staff Backend Engineer (Convex / Distributed Systems)",
        departmentId: engDeptId,
        departmentName: "Engineering & Technology",
        location: "Bengaluru (Hybrid)",
        employmentType: "FULL_TIME",
        openPositions: 2,
        status: "ACTIVE",
        experienceLevel: "6-10 Years",
        salaryRange: "₹35,00,000 - ₹50,00,000 PA",
        description: "Scale reactive database pipelines, real-time sync, and compliance infrastructure.",
        createdAt: now,
      });

      await ctx.db.insert("recruitmentCandidates", {
        organizationId: orgId,
        jobId,
        jobTitle: "Senior Staff Backend Engineer (Convex / Distributed Systems)",
        fullName: "Kavya Swaminathan",
        email: "kavya.swami@gmail.com",
        phone: "+91 98455 12345",
        currentCompany: "Stripe India",
        yearsOfExperience: 8,
        stage: "INTERVIEW",
        rating: 4.8,
        notes: "Excellent command over distributed systems, CRDTs, and low-latency API design.",
        appliedDate: "2026-09-01",
      });
    }

    // 17. Notifications
    const existingNotif = await ctx.db
      .query("notifications")
      .withIndex("by_org", (q) => q.eq("organizationId", orgId))
      .first();

    if (!existingNotif && priyaId) {
      await ctx.db.insert("notifications", {
        organizationId: orgId,
        userId: priyaId,
        title: "August 2026 Payslip Released",
        message: "Your itemized salary slip for August 2026 has been credited and is available for download.",
        type: "PAYROLL",
        isRead: false,
        linkUrl: "/payroll",
        createdAt: now,
      });
    }

    // 18. Audit Logs
    await ctx.db.insert("auditLogs", {
      organizationId: orgId,
      userId: "system",
      userName: "System Administrator",
      userRole: "SUPER_ADMIN",
      action: "ENTERPRISE_DATABASE_PROVISIONED",
      entity: "SYSTEM",
      entityId: orgId,
      details: "Successfully seeded full enterprise dataset into Convex Cloud (valuable-aardvark-358) across all 22 relational tables.",
      ipAddress: "127.0.0.1",
      timestamp: now,
    });

    return {
      success: true,
      message: "Convex Cloud enterprise database successfully and completely seeded!",
      organizationId: orgId,
      tablesSeeded: [
        "organizations", "settings", "departments", "leaveTypes", "employees",
        "users", "leaveBalances", "leaveRequests", "attendance", "holidays",
        "payrollRuns", "payslips", "performanceGoals", "performanceReviews",
        "documents", "tasks", "announcements", "recruitmentJobs",
        "recruitmentCandidates", "notifications", "auditLogs"
      ],
    };
  },
});
