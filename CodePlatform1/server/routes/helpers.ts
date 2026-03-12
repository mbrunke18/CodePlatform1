import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export function getUserId(req: any): string | undefined {
  if (req.isAuthenticated() && req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  return undefined;
}

export async function getOrgIdForUser(userId: string): Promise<string | undefined> {
  const orgs = await storage.getUserOrganizations(userId);
  return orgs[0]?.id;
}

export async function requireOrgAccess(req: any, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const orgId = await getOrgIdForUser(userId);
  if (!orgId) {
    return res.status(403).json({ message: "Forbidden - User has no organization" });
  }

  const requestedOrgId =
    req.params.orgId ||
    req.params.organizationId ||
    req.query.organizationId ||
    req.body.organizationId;
  if (requestedOrgId && requestedOrgId !== "default" && requestedOrgId !== orgId) {
    return res.status(403).json({
      message: "Forbidden - Insufficient permissions for this organization",
    });
  }

  req.userId = userId;
  req.orgId = orgId;
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized - Please sign in" });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userRole = await storage.getUserRole(userId);

      if (!userRole) {
        return res.status(403).json({
          message:
            "Forbidden - Role required for this action. Your current access is read-only.",
        });
      }

      const roleName = userRole.name.toLowerCase();
      const isAllowed = allowedRoles.some(
        (role) => role.toLowerCase() === roleName
      );

      if (!isAllowed) {
        return res.status(403).json({
          message: `Forbidden - This action requires one of the following roles: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Error in requireRole middleware:", error);
      res.status(500).json({ message: "Internal server error during role validation" });
    }
  };
}

export function requireAuth(req: any, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }
  req.userId = userId;
  next();
}

export async function optionalAuth(req: any, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  req.userId = userId;
  if (userId) {
    req.orgId = await getOrgIdForUser(userId);
  }
  next();
}
