import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export type Role = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";

export type Permission =
  | "employees.view"
  | "employees.create"
  | "employees.update"
  | "employees.delete"
  | "departments.view"
  | "departments.manage"
  | "attendance.view"
  | "attendance.manage"
  | "leave.view"
  | "leave.apply"
  | "leave.approve"
  | "payroll.view"
  | "payroll.manage"
  | "performance.view"
  | "performance.manage"
  | "documents.view"
  | "documents.manage"
  | "tasks.view"
  | "tasks.manage"
  | "announcements.view"
  | "announcements.manage"
  | "reports.view"
  | "recruitment.view"
  | "recruitment.manage"
  | "settings.manage"
  | "audit.view";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "employees.view",
    "employees.create",
    "employees.update",
    "employees.delete",
    "departments.view",
    "departments.manage",
    "attendance.view",
    "attendance.manage",
    "leave.view",
    "leave.apply",
    "leave.approve",
    "payroll.view",
    "payroll.manage",
    "performance.view",
    "performance.manage",
    "documents.view",
    "documents.manage",
    "tasks.view",
    "tasks.manage",
    "announcements.view",
    "announcements.manage",
    "reports.view",
    "recruitment.view",
    "recruitment.manage",
    "settings.manage",
    "audit.view",
  ],
  HR_ADMIN: [
    "employees.view",
    "employees.create",
    "employees.update",
    "departments.view",
    "departments.manage",
    "attendance.view",
    "attendance.manage",
    "leave.view",
    "leave.apply",
    "leave.approve",
    "payroll.view",
    "payroll.manage",
    "performance.view",
    "performance.manage",
    "documents.view",
    "documents.manage",
    "tasks.view",
    "tasks.manage",
    "announcements.view",
    "announcements.manage",
    "reports.view",
    "recruitment.view",
    "recruitment.manage",
    "settings.manage",
    "audit.view",
  ],
  MANAGER: [
    "employees.view",
    "departments.view",
    "attendance.view",
    "attendance.manage",
    "leave.view",
    "leave.apply",
    "leave.approve",
    "performance.view",
    "performance.manage",
    "documents.view",
    "tasks.view",
    "tasks.manage",
    "announcements.view",
    "reports.view",
    "recruitment.view",
  ],
  EMPLOYEE: [
    "attendance.view",
    "leave.view",
    "leave.apply",
    "documents.view",
    "tasks.view",
    "announcements.view",
  ],
};

export async function getUserAndOrg(
  ctx: QueryCtx | MutationCtx,
  overrideOrgId?: Id<"organizations">
): Promise<{
  user: Doc<"users"> | null;
  organizationId: Id<"organizations"> | null;
  role: Role;
  permissions: Permission[];
}> {
  const identity = await ctx.auth.getUserIdentity();

  if (identity) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (user) {
      const role = user.role as Role;
      return {
        user,
        organizationId: user.organizationId,
        role,
        permissions: ROLE_PERMISSIONS[role] || [],
      };
    }
  }

  // Fallback for demo / development context when explicit organizationId is passed
  if (overrideOrgId) {
    const org = await ctx.db.get(overrideOrgId);
    if (org) {
      return {
        user: null,
        organizationId: overrideOrgId,
        role: "SUPER_ADMIN",
        permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
      };
    }
  }

  // Find first organization if available
  const defaultOrg = await ctx.db.query("organizations").first();
  if (defaultOrg) {
    return {
      user: null,
      organizationId: defaultOrg._id,
      role: "SUPER_ADMIN",
      permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    };
  }

  return {
    user: null,
    organizationId: null,
    role: "EMPLOYEE",
    permissions: ROLE_PERMISSIONS.EMPLOYEE,
  };
}

export async function requireAuthAndOrg(
  ctx: QueryCtx | MutationCtx,
  requiredPermission?: Permission,
  overrideOrgId?: Id<"organizations">
): Promise<{
  user: Doc<"users"> | null;
  organizationId: Id<"organizations">;
  role: Role;
}> {
  const authState = await getUserAndOrg(ctx, overrideOrgId);

  if (!authState.organizationId) {
    throw new Error("Unauthorized: No active organization found.");
  }

  if (requiredPermission && !authState.permissions.includes(requiredPermission)) {
    throw new Error(`Forbidden: Missing required permission "${requiredPermission}".`);
  }

  return {
    user: authState.user,
    organizationId: authState.organizationId,
    role: authState.role,
  };
}
