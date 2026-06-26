import { Router } from "express";
import * as ShopController from "../controllers/shopControllers.js";

const router = Router();

router.get("/:user_id", ShopController.getInventory);
router.delete("/:inventory_id", ShopController.discardItem);

export default router;