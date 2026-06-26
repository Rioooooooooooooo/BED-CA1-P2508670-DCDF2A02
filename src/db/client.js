import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import "dotenv/config";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./borderland.db",
});

export const db = drizzle(client, { schema });