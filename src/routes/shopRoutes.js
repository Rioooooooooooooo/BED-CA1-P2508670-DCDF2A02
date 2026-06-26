import { Router } from "express";
import * as shopControllers from "../controllers/shopControllers.js";

const router = Router();

router.get("/", shopControllers.getAllItems);
router.post("/buy", shopControllers.buyItem);

export default router;