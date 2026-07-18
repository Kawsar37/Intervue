import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  toggleFavorite,
  getFavorites,
  checkFavorite,
} from "../controllers/favoriteController";

const router = Router();

router.use(authMiddleware);

router.post("/:templateId", toggleFavorite);
router.get("/", getFavorites);
router.get("/check/:templateId", checkFavorite);

export default router;
