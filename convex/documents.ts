import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthAndOrg } from "./lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    category: v.optional(v.string()),
    employeeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, role, user } = await requireAuthAndOrg(
      ctx,
      "documents.view",
      args.organizationId
    );

    let docs = await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("organizationId", organizationId))
      .collect();

    // Privacy & confidentiality check:
    // If role is EMPLOYEE, filter out confidential docs not belonging to them
    if (role === "EMPLOYEE") {
      const myEmpId = user?.employeeId;
      docs = docs.filter((d) => {
        if (d.isConfidential && d.employeeId !== myEmpId) return false;
        if (d.employeeId && d.employeeId !== myEmpId) return false;
        return true;
      });
    }

    if (args.category && args.category !== "ALL") {
      docs = docs.filter((d) => d.category === args.category);
    }

    if (args.employeeId) {
      docs = docs.filter((d) => d.employeeId === args.employeeId);
    }

    // Attach resolved storage URLs if storageId is present
    return await Promise.all(
      docs.map(async (doc) => {
        if (doc.storageId) {
          const url = await ctx.storage.getUrl(doc.storageId as any);
          return { ...doc, fileUrl: url || doc.fileUrl };
        }
        return doc;
      })
    );
  },
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    category: v.string(),
    fileSizeFormatted: v.string(),
    fileType: v.string(),
    storageId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    employeeId: v.optional(v.string()),
    employeeName: v.optional(v.string()),
    isConfidential: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "documents.manage",
      args.organizationId
    );

    const now = new Date().toISOString();
    const docId = await ctx.db.insert("documents", {
      organizationId,
      name: args.name,
      category: args.category,
      fileSizeFormatted: args.fileSizeFormatted,
      fileType: args.fileType,
      storageId: args.storageId,
      fileUrl: args.fileUrl,
      employeeId: args.employeeId,
      employeeName: args.employeeName,
      uploadedBy: user?.name || "HR Admin",
      uploadedAt: now.split("T")[0],
      isConfidential: args.isConfidential,
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "system",
      userName: user?.name || "HR Administrator",
      userRole: user?.role || "HR_ADMIN",
      action: "DOCUMENT_UPLOADED",
      entity: "DOCUMENT",
      entityId: docId,
      details: `Uploaded document: ${args.name} (${args.category})`,
      timestamp: now,
    });

    return docId;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { organizationId, user } = await requireAuthAndOrg(
      ctx,
      "documents.manage",
      args.organizationId
    );

    const doc = await ctx.db.get(args.id);
    if (!doc || doc.organizationId !== organizationId) {
      throw new Error("Document not found.");
    }

    if (doc.storageId) {
      try {
        await ctx.storage.delete(doc.storageId as any);
      } catch (e) {
        // Continue if storage already deleted
      }
    }

    await ctx.db.delete(args.id);

    const now = new Date().toISOString();
    await ctx.db.insert("auditLogs", {
      organizationId,
      userId: user?._id || "system",
      userName: user?.name || "HR Administrator",
      userRole: user?.role || "HR_ADMIN",
      action: "DOCUMENT_DELETED",
      entity: "DOCUMENT",
      entityId: args.id,
      details: `Deleted document: ${doc.name}`,
      timestamp: now,
    });

    return { success: true };
  },
});
