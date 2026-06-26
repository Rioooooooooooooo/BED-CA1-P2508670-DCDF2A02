import { db } from "../db/client.js";
import { arenas, arena_attempts, users, user_inventory, shop_items } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function getAllArenas() {
  return await db.select().from(arenas);
}

export async function getArenasBySuit(suit) {
  return await db.select().from(arenas).where(eq(arenas.suit, suit));
}

export async function getArenaById(arena_id) {
  const result = await db.select().from(arenas).where(eq(arenas.arena_id, arena_id));
  return result[0] || null;
}

export async function getUserInventoryForGame(user_id) {
  return await db
    .select({
      inventory_id: user_inventory.inventory_id,
      item_id: user_inventory.item_id,
      quantity: user_inventory.quantity,
      suit: shop_items.suit,
      stamina_bonus: shop_items.stamina_bonus,
    })
    .from(user_inventory)
    .innerJoin(shop_items, eq(user_inventory.item_id, shop_items.item_id))
    .where(eq(user_inventory.user_id, user_id));
}

export async function saveAttempt(user_id, arena_id, outcome, visa_days_change, details) {
  await db.insert(arena_attempts).values({
    attempt_id: randomUUID(),
    user_id,
    arena_id,
    outcome,
    visa_days_change,
    details: JSON.stringify(details),
  });
}

export async function updateUserVisaDays(user_id, newVisaDays) {
  await db.update(users).set({ visa_days: newVisaDays }).where(eq(users.user_id, user_id));
}

export async function getUserHistory(user_id) {
  return await db
    .select({
      attempt_id: arena_attempts.attempt_id,
      outcome: arena_attempts.outcome,
      visa_days_change: arena_attempts.visa_days_change,
      details: arena_attempts.details,
      played_at: arena_attempts.played_at,
      arena_name: arenas.name,
      arena_suit: arenas.suit,
      card_number: arenas.card_number,
    })
    .from(arena_attempts)
    .innerJoin(arenas, eq(arena_attempts.arena_id, arenas.arena_id))
    .where(eq(arena_attempts.user_id, user_id));
}