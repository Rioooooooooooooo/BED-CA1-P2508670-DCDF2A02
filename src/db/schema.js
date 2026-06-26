import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  user_id: text("user_id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  visa_days: integer("visa_days").notNull().default(7),
  level: integer("level").notNull().default(1),
  stamina: integer("stamina").notNull().default(50),
  suit_affinity: text("suit_affinity").default(null), // spades, diamonds, clubs, hearts
  created_at: text("created_at").default(sql`(datetime('now'))`),
});

export const shop_items = sqliteTable("shop_items", {
  item_id: text("item_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  suit: text("suit").notNull(), // spades, diamonds, clubs, hearts, any
  cost: integer("cost").notNull(),
  stamina_bonus: integer("stamina_bonus").notNull().default(0),
});

export const user_inventory = sqliteTable("user_inventory", {
  inventory_id: text("inventory_id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  item_id: text("item_id")
    .notNull()
    .references(() => shop_items.item_id),
  quantity: integer("quantity").notNull().default(1),
});

export const arenas = sqliteTable("arenas", {
  arena_id: text("arena_id").primaryKey(),
  name: text("name").notNull(),
  suit: text("suit").notNull(),       // spades, diamonds, clubs, hearts
  card_number: integer("card_number").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  visa_reward: integer("visa_reward").notNull(),
  visa_penalty: integer("visa_penalty").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, cleared, locked
});

export const arena_attempts = sqliteTable("arena_attempts", {
  attempt_id: text("attempt_id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  arena_id: text("arena_id")
    .notNull()
    .references(() => arenas.arena_id),
  outcome: text("outcome").notNull(), // win, lose
  visa_days_change: integer("visa_days_change").notNull(),
  details: text("details").notNull(), // JSON string with game-specific result info
  played_at: text("played_at").default(sql`(datetime('now'))`),
});