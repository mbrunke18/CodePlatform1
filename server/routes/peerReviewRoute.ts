import type { Express } from "express";
import { db } from "../db";
import { peerReviews, peerReviewActions } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export function registerPeerReviewRoute(app: Express) {
  // Submit a peer review (public — no auth required)
  app.post("/api/peer-reviews", async (req, res) => {
    try {
      const data = req.body;
      if (!data.reviewerName || !data.reviewerRole || !data.reviewerOrg) {
        return res.status(400).json({ error: "Name, role, and organization are required." });
      }
      const [row] = await db.insert(peerReviews).values({
        ...data,
        sourceUrl: req.headers.referer || data.sourceUrl || "",
      }).returning();
      res.json({ success: true, id: row.id });
    } catch (err) {
      console.error("[PeerReview] Submit error:", err);
      res.status(500).json({ error: "Failed to save review." });
    }
  });

  // Get all reviews (admin only)
  app.get("/api/peer-reviews", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      const rows = await db.select().from(peerReviews).orderBy(desc(peerReviews.createdAt));
      res.json(rows);
    } catch (err) {
      console.error("[PeerReview] Fetch error:", err);
      res.status(500).json({ error: "Failed to fetch reviews." });
    }
  });

  // Aggregate report (admin only)
  app.get("/api/peer-reviews/report", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      const rows = await db.select().from(peerReviews).orderBy(desc(peerReviews.createdAt));
      if (rows.length === 0) return res.json({ total: 0, rows: [] });

      const avg = (field: string) => {
        const vals = rows.map((r: any) => r[field]).filter((v: any) => v != null && v > 0);
        return vals.length ? +(vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(2) : null;
      };

      const dist = (field: string) => {
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        rows.forEach((r: any) => { if (r[field] && r[field] > 0) counts[r[field]] = (counts[r[field]] || 0) + 1; });
        return counts;
      };

      const multiFreq = (field: string) => {
        const freq: Record<string, number> = {};
        rows.forEach((r: any) => {
          const arr = r[field] || [];
          arr.forEach((v: string) => { freq[v] = (freq[v] || 0) + 1; });
        });
        return Object.entries(freq).sort((a, b) => b[1] - a[1]);
      };

      const singleFreq = (field: string) => {
        const freq: Record<string, number> = {};
        rows.forEach((r: any) => { if (r[field]) freq[r[field]] = (freq[r[field]] || 0) + 1; });
        return Object.entries(freq).sort((a, b) => b[1] - a[1]);
      };

      const textResponses = (field: string) =>
        rows.map((r: any) => ({ id: r.id, name: r.reviewerName, role: r.reviewerRole, org: r.reviewerOrg, text: r[field] }))
          .filter((r: any) => r.text && r.text.trim().length > 0);

      const report = {
        total: rows.length,
        reviewerTypes: singleFreq("reviewerType"),
        submittedAt: rows.map((r: any) => r.createdAt),

        // Scale averages
        scales: {
          q1: { avg: avg("q1Scale"), dist: dist("q1Scale"), label: "Problem significance (strategic trigger gap)" },
          q3: { avg: avg("q3Scale"), dist: dist("q3Scale"), label: "Frequency of missed strategic windows" },
          q4: { avg: avg("q4Scale"), dist: dist("q4Scale"), label: "Pre-staged response maturity" },
          q5: { avg: avg("q5Scale"), dist: dist("q5Scale"), label: "Product clarity" },
          q7: { avg: avg("q7Scale"), dist: dist("q7Scale"), label: "12-minute claim credibility" },
          q8: { avg: avg("q8Scale"), dist: dist("q8Scale"), label: "Value proposition strength" },
          q10: { avg: avg("q10Scale"), dist: dist("q10Scale"), label: "Market need" },
          q21: { avg: avg("q21Scale"), dist: dist("q21Scale"), label: "vs existing tools" },
          q23: { avg: avg("q23Scale"), dist: dist("q23Scale"), label: "Overall product rating" },
          q25: { avg: avg("q25Scale"), dist: dist("q25Scale"), label: "Commercial viability" },
        },

        // Selects
        q2Selection: singleFreq("q2Selection"),
        q9Selections: multiFreq("q9Selections"),
        q11Selection: singleFreq("q11Selection"),
        q12Selections: multiFreq("q12Selections"),
        q13Selection: singleFreq("q13Selection"),
        q20Selection: singleFreq("q20Selection"),
        q24Selection: singleFreq("q24Selection"),
        q26Selection: singleFreq("q26Selection"),

        // Q16 ratings matrix aggregation
        q16Matrix: (() => {
          const dims: Record<string, number[]> = {};
          rows.forEach((r: any) => {
            const m = r.q16Ratings || {};
            Object.entries(m).forEach(([dim, val]: [string, any]) => {
              if (!dims[dim]) dims[dim] = [];
              if (val?.score) dims[dim].push(val.score);
            });
          });
          return Object.entries(dims).map(([dim, scores]) => ({
            dimension: dim,
            avg: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
            n: scores.length,
          })).sort((a, b) => b.avg - a.avg);
        })(),

        // Qualitative responses
        qualitative: {
          q1: textResponses("q1Text"),
          q2: textResponses("q2Text"),
          q3: textResponses("q3Text"),
          q4: textResponses("q4Text"),
          q5: textResponses("q5Text"),
          q6: textResponses("q6Text"),
          q7: textResponses("q7Text"),
          q8: textResponses("q8Text"),
          q10: textResponses("q10Text"),
          q11blocker: textResponses("q11Text"),
          q13: textResponses("q13Text"),
          q15: textResponses("q15Text"),
          q17: textResponses("q17Text"),
          q18: textResponses("q18Text"),
          q19: textResponses("q19Text"),
          q21: textResponses("q21Text"),
          q22: textResponses("q22Text"),
          q25: textResponses("q25Text"),
          q27: textResponses("q27Text"),
          q28: textResponses("q28Text"),
        },

        rows: rows.map((r: any) => ({
          id: r.id,
          createdAt: r.createdAt,
          reviewerName: r.reviewerName,
          reviewerRole: r.reviewerRole,
          reviewerOrg: r.reviewerOrg,
          reviewerType: r.reviewerType,
          q23Scale: r.q23Scale,
          q25Scale: r.q25Scale,
          q24Selection: r.q24Selection,
          q26Selection: r.q26Selection,
        })),
      };

      res.json(report);
    } catch (err) {
      console.error("[PeerReview] Report error:", err);
      res.status(500).json({ error: "Failed to generate report." });
    }
  });

  // --- Improvement Actions (Lessons Applied) ---

  app.get("/api/peer-review-actions", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      const rows = await db.select().from(peerReviewActions).orderBy(desc(peerReviewActions.createdAt));
      res.json(rows);
    } catch (err) {
      console.error("[PeerReviewActions] Fetch error:", err);
      res.status(500).json({ error: "Failed to fetch actions." });
    }
  });

  app.post("/api/peer-review-actions", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      const { category, insight, action, status } = req.body;
      if (!insight?.trim() || !action?.trim()) {
        return res.status(400).json({ error: "Insight and action are required." });
      }
      const [row] = await db.insert(peerReviewActions).values({
        category: category || "general",
        insight: insight.trim(),
        action: action.trim(),
        status: status || "identified",
      }).returning();
      res.json(row);
    } catch (err) {
      console.error("[PeerReviewActions] Create error:", err);
      res.status(500).json({ error: "Failed to create action." });
    }
  });

  app.patch("/api/peer-review-actions/:id", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      const updates: any = {};
      if (req.body.status) updates.status = req.body.status;
      if (req.body.action) updates.action = req.body.action;
      if (req.body.status === "completed") updates.completedAt = new Date();
      const [row] = await db.update(peerReviewActions).set(updates).where(eq(peerReviewActions.id, req.params.id)).returning();
      res.json(row);
    } catch (err) {
      console.error("[PeerReviewActions] Update error:", err);
      res.status(500).json({ error: "Failed to update action." });
    }
  });

  app.delete("/api/peer-review-actions/:id", async (req: any, res) => {
    try {
      if (!req.isAuthenticated?.() || req.user?.claims?.sub !== "martybrunke") {
        return res.status(403).json({ error: "Admin access required." });
      }
      await db.delete(peerReviewActions).where(eq(peerReviewActions.id, req.params.id));
      res.json({ success: true });
    } catch (err) {
      console.error("[PeerReviewActions] Delete error:", err);
      res.status(500).json({ error: "Failed to delete action." });
    }
  });
}
