import { Router } from "express";
import * as ArenaController from "../controllers/arenaControllers.js";

const router = Router();

router.get("/", ArenaController.getAllArenas);
router.get("/history/:user_id", ArenaController.getHistory);
router.post("/:arena_id/play", ArenaController.playArena);

export default router;