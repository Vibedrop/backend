import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    getUser,
    getUserProfile,
    deleteUser,
    changeUserName,
} from "../controllers/userControllers";

const router = Router();

router.post("/:userId", authMiddleware, changeUserName);
router.get("/", authMiddleware, getUser);
router.get("/me", authMiddleware, getUserProfile);
// TODO: Add update user route
router.delete("/me", authMiddleware, deleteUser);

export default router;
