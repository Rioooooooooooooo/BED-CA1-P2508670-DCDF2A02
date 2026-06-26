import * as ArenaModel from "../models/arenaModels.js";
import * as UserModel from "../models/userModels.js";

const VALID_SUITS = ["spades", "diamonds", "clubs", "hearts"];

// ─── GAME LOGIC ─────────────────────────────────────────────────────────────

function playOsmosis(user, inventory) {
  const staminaBonus = inventory.reduce((sum, i) => {
    if (i.suit === "spades" || i.suit === "any") {
      return sum + i.stamina_bonus * i.quantity;
    }
    return sum;
  }, 0);

  const playerStrength = user.stamina + staminaBonus;
  const enemyStrength = Math.floor(Math.random() * 51) + 30;
  const outcome = playerStrength >= enemyStrength ? "win" : "lose";

  return {
    outcome,
    details: {
      game: "Osmosis",
      player_strength: playerStrength,
      base_stamina: user.stamina,
      stamina_bonus: staminaBonus,
      enemy_strength: enemyStrength,
      result: outcome === "win"
        ? "You overpowered your opponent and survived."
        : "Your opponent was stronger. You barely escaped.",
    },
  };
}

function playBlackjack(user, inventory, action) {
  if (!action || !["hit", "stand"].includes(action)) {
    return { error: 'action is required: "hit" or "stand"' };
  }

  const hasStrategyNotes = inventory.some((i) => i.item_id === "item_003");

  const card1 = Math.floor(Math.random() * 10) + 1;
  const card2 = Math.floor(Math.random() * 10) + 1;
  let playerTotal = card1 + card2;

  let playerBust = false;
  if (action === "hit") {
    const card3 = Math.floor(Math.random() * 10) + 1;
    playerTotal += card3;
    if (playerTotal > 21) {
      if (hasStrategyNotes) {
        playerTotal = 21;
      } else {
        playerBust = true;
      }
    }
  }

  let dealerTotal = Math.floor(Math.random() * 10) + 1;
  while (dealerTotal < 17) {
    dealerTotal += Math.floor(Math.random() * 10) + 1;
  }
  const dealerBust = dealerTotal > 21;

  let outcome;
  if (playerBust) {
    outcome = "lose";
  } else if (dealerBust || playerTotal > dealerTotal) {
    outcome = "win";
  } else {
    outcome = "lose";
  }

  return {
    outcome,
    details: {
      game: "Blackjack",
      player_total: playerBust ? "BUST" : playerTotal,
      dealer_total: dealerBust ? "BUST" : dealerTotal,
      action_taken: action,
      strategy_notes_used: hasStrategyNotes,
      result: outcome === "win"
        ? "You beat the dealer. You live another day."
        : "The dealer wins. Your visa days are forfeit.",
    },
  };
}

function playTugOfWar(user, inventory) {
  const walkieTalkie = inventory.find((i) => i.item_id === "item_004");
  const teamBonus = walkieTalkie ? walkieTalkie.stamina_bonus * walkieTalkie.quantity : 0;

  const teamStrength = user.level * 10 + Math.floor(Math.random() * 21) + teamBonus;
  const enemyStrength = Math.floor(Math.random() * 41) + 10;
  const outcome = teamStrength >= enemyStrength ? "win" : "lose";

  return {
    outcome,
    details: {
      game: "Tug of War",
      your_team_strength: teamStrength,
      enemy_team_strength: enemyStrength,
      walkie_talkie_bonus: teamBonus,
      result: outcome === "win"
        ? "Your team pulled through. Victory!"
        : "The enemy team was better coordinated. You lost.",
    },
  };
}

function playSolitaryConfinement(user, inventory, choice) {
  if (!choice || !["cooperate", "betray"].includes(choice)) {
    return { error: 'choice is required: "cooperate" or "betray"' };
  }

  const hasPokerMask = inventory.some((i) => i.item_id === "item_005");
  const partnerChoice = Math.random() < (hasPokerMask ? 0.65 : 0.5) ? "cooperate" : "betray";

  let outcome;
  let resultText;

  if (choice === "cooperate" && partnerChoice === "cooperate") {
    outcome = "win";
    resultText = "Both cooperated. You both survive with full reward.";
  } else if (choice === "cooperate" && partnerChoice === "betray") {
    outcome = "lose";
    resultText = "You trusted them. They betrayed you. You lose everything.";
  } else if (choice === "betray" && partnerChoice === "cooperate") {
    outcome = "win";
    resultText = "You betrayed your partner. They trusted you. You win big.";
  } else {
    outcome = "lose";
    resultText = "Both betrayed each other. Nobody wins.";
  }

  return {
    outcome,
    details: {
      game: "Solitary Confinement",
      your_choice: choice,
      partner_choice: partnerChoice,
      poker_mask_used: hasPokerMask,
      result: resultText,
    },
  };
}

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

export async function getAllArenas(req, res) {
  try {
    const { suit } = req.query;

    if (suit) {
      if (!VALID_SUITS.includes(suit)) {
        return res.status(400).json({
          error: `Invalid suit. Must be one of: ${VALID_SUITS.join(", ")}`,
        });
      }
      const result = await ArenaModel.getArenasBySuit(suit);
      return res.status(200).json(result);
    }

    const result = await ArenaModel.getAllArenas();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch arenas." });
  }
}

export async function getHistory(req, res) {
  try {
    const { user_id } = req.params;

    const user = await UserModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const history = await ArenaModel.getUserHistory(user_id);

    res.status(200).json({
      username: user.username,
      visa_days: user.visa_days,
      total_games: history.length,
      wins: history.filter((h) => h.outcome === "win").length,
      losses: history.filter((h) => h.outcome === "lose").length,
      history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history." });
  }
}

export async function playArena(req, res) {
  try {
    const { arena_id } = req.params;
    const { user_id, action, choice } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required." });
    }

    const user = await UserModel.getUserByIdFull(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const arena = await ArenaModel.getArenaById(arena_id);
    if (!arena) {
      return res.status(404).json({ error: "Arena not found." });
    }

    if (user.visa_days <= 0) {
      return res.status(400).json({
        error: "You have no visa days left. You have been eliminated from Borderland.",
      });
    }

    const inventory = await ArenaModel.getUserInventoryForGame(user_id);

    let gameResult;
    if (arena_id === "arena_spades_3") {
      gameResult = playOsmosis(user, inventory);
    } else if (arena_id === "arena_diamonds_5") {
      gameResult = playBlackjack(user, inventory, action);
    } else if (arena_id === "arena_clubs_4") {
      gameResult = playTugOfWar(user, inventory);
    } else if (arena_id === "arena_hearts_7") {
      gameResult = playSolitaryConfinement(user, inventory, choice);
    } else {
      return res.status(400).json({ error: "This arena has no game logic yet." });
    }

    if (gameResult.error) {
      return res.status(400).json({ error: gameResult.error });
    }

    const visaChange = gameResult.outcome === "win"
      ? arena.visa_reward
      : -arena.visa_penalty;

    const newVisaDays = Math.max(0, user.visa_days + visaChange);

    await ArenaModel.updateUserVisaDays(user_id, newVisaDays);
    await ArenaModel.saveAttempt(user_id, arena_id, gameResult.outcome, visaChange, gameResult.details);

    res.status(200).json({
      arena: arena.name,
      suit: arena.suit,
      outcome: gameResult.outcome,
      visa_days_change: visaChange,
      new_visa_days: newVisaDays,
      details: gameResult.details,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to play arena." });
  }
}