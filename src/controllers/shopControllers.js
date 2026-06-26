import * as ShopModel from "../models/shopModels.js";
import * as UserModel from "../models/userModels.js";

const VALID_SUITS = ["spades", "diamonds", "clubs", "hearts", "any"];

export async function getAllItems(req, res) {
  try {
    const { suit } = req.query;

    if (suit) {
      if (!VALID_SUITS.includes(suit)) {
        return res.status(400).json({
          error: `Invalid suit. Must be one of: ${VALID_SUITS.join(", ")}`,
        });
      }
      const result = await ShopModel.getItemsBySuit(suit);
      return res.status(200).json(result);
    }

    const result = await ShopModel.getAllItems();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shop items." });
  }
}

export async function buyItem(req, res) {
  try {
    const { user_id, item_id } = req.body;

    if (!user_id || !item_id) {
      return res.status(400).json({ error: "user_id and item_id are required." });
    }

    const user = await UserModel.getUserByIdFull(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const item = await ShopModel.getItemById(item_id);
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }

    if (user.visa_days < item.cost) {
      return res.status(400).json({
        error: `Not enough visa days. You have ${user.visa_days} but need ${item.cost}.`,
      });
    }

    const alreadyOwned = await ShopModel.getOwnedItem(user_id, item_id);
    if (alreadyOwned) {
      await ShopModel.incrementItemQuantity(alreadyOwned.inventory_id, alreadyOwned.quantity + 1);
    } else {
      await ShopModel.addItemToInventory(user_id, item_id);
    }

    await ShopModel.deductVisaDays(user_id, item.cost, user.visa_days);

    res.status(200).json({
      message: `You bought ${item.name} for ${item.cost} visa days.`,
      remaining_visa_days: user.visa_days - item.cost,
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to purchase item." });
  }
}

export async function getInventory(req, res) {
  try {
    const { user_id } = req.params;

    const user = await UserModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const inventory = await ShopModel.getUserInventory(user_id);

    res.status(200).json({
      username: user.username,
      visa_days: user.visa_days,
      inventory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inventory." });
  }
}

export async function discardItem(req, res) {
  try {
    const { inventory_id } = req.params;

    const item = await ShopModel.getInventoryItemById(inventory_id);
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found." });
    }

    await ShopModel.deleteInventoryItem(inventory_id);
    res.status(200).json({ message: "Item discarded from inventory." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to discard item." });
  }
}