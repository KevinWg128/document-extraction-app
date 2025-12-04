import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Enable connection caching for better performance in serverless environments
neonConfig.fetchConnectionCache = true;

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle database instance with schema for type-safe queries
export const db = drizzle(sql, { schema });
