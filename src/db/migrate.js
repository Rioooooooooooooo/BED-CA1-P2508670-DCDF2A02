import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import "dotenv/config";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./borderland.db",
});

const db = drizzle(client);

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations complete.");
  client.close();
}

main().catch(console.error);