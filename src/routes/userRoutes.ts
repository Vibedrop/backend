import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getUser,
    getUserProfile,
    deleteUser,
} from "../controllers/userControllers.js";

const router = Router();

router.get("/", authMiddleware, getUser);
router.get("/me", authMiddleware, getUserProfile);
// TODO: Add update user route
router.delete("/me", authMiddleware, deleteUser);

export default router;
