import { db } from "./client.js";
import { shop_items, arenas } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  // Shop Items
  await db.insert(shop_items).values([
    {
      item_id: "item_001",
      name: "Adrenaline Shot",
      description: "Boosts stamina before a Spades game.",
      suit: "spades",
      cost: 2,
      stamina_bonus: 20,
    },
    {
      item_id: "item_002",
      name: "Energy Bar",
      description: "A small stamina boost. Works in any arena.",
      suit: "any",
      cost: 1,
      stamina_bonus: 10,
    },
    {
      item_id: "item_003",
      name: "Strategy Notes",
      description: "Cheat sheet for Diamond games. Reduces bust chance.",
      suit: "diamonds",
      cost: 2,
      stamina_bonus: 0,
    },
    {
      item_id: "item_004",
      name: "Walkie Talkie",
      description: "Improves team coordination in Clubs games.",
      suit: "clubs",
      cost: 2,
      stamina_bonus: 5,
    },
    {
      item_id: "item_005",
      name: "Poker Face Mask",
      description: "Hides your intentions in Hearts games.",
      suit: "hearts",
      cost: 3,
      stamina_bonus: 0,
    },
  ]).onConflictDoNothing();

  // Arenas
  await db.insert(arenas).values([
    {
      arena_id: "arena_spades_3",
      name: "Osmosis",
      suit: "spades",
      card_number: 3,
      difficulty: "easy",
      visa_reward: 3,
      visa_penalty: 2,
      description:
        "Survive a physical endurance challenge. Your stamina is tested against a random opponent. The stronger player wins.",
      status: "open",
    },
    {
      arena_id: "arena_diamonds_5",
      name: "Blackjack",
      suit: "diamonds",
      card_number: 5,
      difficulty: "easy",
      visa_reward: 4,
      visa_penalty: 3,
      description:
        "A deadly game of Blackjack. Get closer to 21 than the dealer without going over — or lose your visa days.",
      status: "open",
    },
    {
      arena_id: "arena_clubs_4",
      name: "Tug of War",
      suit: "clubs",
      card_number: 4,
      difficulty: "easy",
      visa_reward: 3,
      visa_penalty: 2,
      description:
        "You are assigned to a team. Your combined levels face off against an enemy team. The stronger side wins.",
      status: "open",
    },
    {
      arena_id: "arena_hearts_7",
      name: "Solitary Confinement",
      suit: "hearts",
      card_number: 7,
      difficulty: "easy",
      visa_reward: 5,
      visa_penalty: 4,
      description:
        "A psychological trap. Choose to cooperate or betray your partner. Your partner makes their own choice — neither of you can communicate.",
      status: "open",
    },
  ]).onConflictDoNothing();

  console.log("✅ Seed complete.");
}

seed().catch(console.error);