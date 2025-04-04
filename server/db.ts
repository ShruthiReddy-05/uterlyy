import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create PostgreSQL client
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Create a Drizzle client for the database
export const db = drizzle(client);