import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUser, getUserProfile, deleteUser } from "../controllers/userControllers";

const router = Router();

router.get("/", authMiddleware, getUser);
router.get("/me", authMiddleware, getUserProfile);
// TODO: Add update user route
router.delete("/me", authMiddleware, deleteUser);

export default router;
