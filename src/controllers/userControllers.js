import * as UserModel from "../models/userModels.js";

const VALID_SUITS = ["spades", "diamonds", "clubs", "hearts"];

export async function getAllUsers(req, res) {
  try {
    const { suit_affinity } = req.query;

    if (suit_affinity) {
      if (!VALID_SUITS.includes(suit_affinity)) {
        return res.status(400).json({
          error: `Invalid suit. Must be one of: ${VALID_SUITS.join(", ")}`,
        });
      }
      const result = await UserModel.getUsersBySuit(suit_affinity);
      return res.status(200).json(result);
    }

    const result = await UserModel.getAllUsers();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
}

export async function createUser(req, res) {
  try {
    const { username, password, suit_affinity } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required." });
    }

    if (suit_affinity && !VALID_SUITS.includes(suit_affinity)) {
      return res.status(400).json({
        error: `Invalid suit. Must be one of: ${VALID_SUITS.join(", ")}`,
      });
    }

    const user_id = await UserModel.createUser({ username, password, suit_affinity });

    res.status(201).json({
      message: `Welcome to Borderland, ${username}. You have 7 visa days. Don't waste them.`,
      user_id,
      username,
      visa_days: 7,
      level: 1,
      stamina: 50,
      suit_affinity: suit_affinity || null,
    });
  } catch (err) {
    if (err.message?.includes("UNIQUE")) {
      return res.status(409).json({ error: "Username already taken." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create user." });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, suit_affinity } = req.body;

    if (!username && !suit_affinity) {
      return res.status(400).json({
        error: "Provide at least one field to update: username, suit_affinity.",
      });
    }

    const existing = await UserModel.getUserById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found." });
    }

    if (suit_affinity && !VALID_SUITS.includes(suit_affinity)) {
      return res.status(400).json({
        error: `Invalid suit. Must be one of: ${VALID_SUITS.join(", ")}`,
      });
    }

    const updates = {};
    if (username) updates.username = username;
    if (suit_affinity) updates.suit_affinity = suit_affinity;

    await UserModel.updateUser(id, updates);
    res.status(200).json({ message: "Profile updated.", ...updates });
  } catch (err) {
    if (err.message?.includes("UNIQUE")) {
      return res.status(409).json({ error: "Username already taken." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update user." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const existing = await UserModel.getUserById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found." });
    }

    await UserModel.deleteUser(id);
    res.status(200).json({
      message: `${existing.username} has been eliminated from Borderland.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user." });
  }
}