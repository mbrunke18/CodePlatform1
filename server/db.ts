import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const isProduction = process.env.NODE_ENV === "production";

// In development, prefer DATABASE_URL_DEV to protect production data from
// accidental schema pushes or seed operations. Falls back to DATABASE_URL with
// a visible warning so engineers know they are touching the production database.
let connectionString: string;

if (isProduction) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set in production.");
  }
  connectionString = process.env.DATABASE_URL;
} else {
  if (process.env.DATABASE_URL_DEV) {
    connectionString = process.env.DATABASE_URL_DEV;
  } else if (process.env.DATABASE_URL) {
    console.warn(
      "\n⚠️  DEV WARNING: DATABASE_URL_DEV is not set. " +
      "The development server is connecting to the PRODUCTION database.\n" +
      "   To protect production data, create a Neon database branch and set DATABASE_URL_DEV.\n" +
      "   See developer-reference.md Section 6 for setup instructions.\n"
    );
    connectionString = process.env.DATABASE_URL;
  } else {
    throw new Error(
      "No database connection string found. Set DATABASE_URL or DATABASE_URL_DEV."
    );
  }
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });

// Keep the Neon connection alive — ping every 4 minutes to prevent idle connection drops
// that cascade into 500 errors on all DB-touching middleware and bring down the server.
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await pool.query("SELECT 1");
    } catch {
      // Silently swallow — the pool will reconnect on the next real query
    }
  }, 4 * 60 * 1000);
}
