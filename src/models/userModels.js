import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function getAllUsers() {
  return await db
    .select({
      user_id: users.user_id,
      username: users.username,
      visa_days: users.visa_days,
      level: users.level,
      stamina: users.stamina,
      suit_affinity: users.suit_affinity,
      created_at: users.created_at,
    })
    .from(users);
}

export async function getUsersBySuit(suit) {
  return await db
    .select({
      user_id: users.user_id,
      username: users.username,
      visa_days: users.visa_days,
      level: users.level,
      stamina: users.stamina,
      suit_affinity: users.suit_affinity,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.suit_affinity, suit));
}

export async function getUserById(user_id) {
  const result = await db
    .select({
      user_id: users.user_id,
      username: users.username,
      visa_days: users.visa_days,
      level: users.level,
      stamina: users.stamina,
      suit_affinity: users.suit_affinity,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.user_id, user_id));
  return result[0] || null;
}

export async function getUserByIdFull(user_id) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user_id));
  return result[0] || null;
}

export async function createUser({ username, password, suit_affinity }) {
  const user_id = randomUUID();
  await db.insert(users).values({
    user_id,
    username,
    password,
    suit_affinity: suit_affinity || null,
  });
  return user_id;
}

export async function updateUser(user_id, updates) {
  await db.update(users).set(updates).where(eq(users.user_id, user_id));
}

export async function deleteUser(user_id) {
  await db.delete(users).where(eq(users.user_id, user_id));
}