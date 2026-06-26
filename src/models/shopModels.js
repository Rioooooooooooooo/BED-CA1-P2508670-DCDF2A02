import { db } from "../db/client.js";
import { shop_items, user_inventory, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function getAllItems() {
  return await db.select().from(shop_items);
}

export async function getItemsBySuit(suit) {
  return await db.select().from(shop_items).where(eq(shop_items.suit, suit));
}

export async function getItemById(item_id) {
  const result = await db.select().from(shop_items).where(eq(shop_items.item_id, item_id));
  return result[0] || null;
}

export async function getUserInventory(user_id) {
  return await db
    .select({
      inventory_id: user_inventory.inventory_id,
      quantity: user_inventory.quantity,
      item_id: shop_items.item_id,
      name: shop_items.name,
      description: shop_items.description,
      suit: shop_items.suit,
      stamina_bonus: shop_items.stamina_bonus,
    })
    .from(user_inventory)
    .innerJoin(shop_items, eq(user_inventory.item_id, shop_items.item_id))
    .where(eq(user_inventory.user_id, user_id));
}

export async function getInventoryItemById(inventory_id) {
  const result = await db
    .select()
    .from(user_inventory)
    .where(eq(user_inventory.inventory_id, inventory_id));
  return result[0] || null;
}

export async function getOwnedItem(user_id, item_id) {
  const result = await db
    .select()
    .from(user_inventory)
    .where(eq(user_inventory.user_id, user_id));
  return result.find((i) => i.item_id === item_id) || null;
}

export async function addItemToInventory(user_id, item_id) {
  await db.insert(user_inventory).values({
    inventory_id: randomUUID(),
    user_id,
    item_id,
    quantity: 1,
  });
}

export async function incrementItemQuantity(inventory_id, quantity) {
  await db
    .update(user_inventory)
    .set({ quantity })
    .where(eq(user_inventory.inventory_id, inventory_id));
}

export async function deleteInventoryItem(inventory_id) {
  await db.delete(user_inventory).where(eq(user_inventory.inventory_id, inventory_id));
}

export async function deductVisaDays(user_id, amount, currentDays) {
  await db
    .update(users)
    .set({ visa_days: currentDays - amount })
    .where(eq(users.user_id, user_id));
}