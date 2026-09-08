import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

// Design: openspec/changes/admin-panel/design.md — Decision: Supabase
// connection — pooler URL, not the direct DB URL.
//
// Next.js server actions/route handlers are short-lived serverless
// invocations; Supabase's pooler (pgBouncer, port 6543) handles that
// connection churn, the direct DB URL does not. `prepare: false` is
// required for pgBouncer — prepared statements aren't safe across pooled
// connections.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required — set it in .env.local to your Supabase pooler connection string (port 6543). See README."
  );
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema: { ...schema, ...authSchema } });
