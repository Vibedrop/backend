import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    getUser,
    getUserProfile,
    deleteUser,
    changeUsername,
    changePassword
} from "../controllers/userControllers";

const router = Router();

router.post("/:userId/username", authMiddleware, changeUsername);
router.post("/:userId/password", authMiddleware, changePassword);
router.get("/", authMiddleware, getUser);
router.get("/me", authMiddleware, getUserProfile);
// TODO: Add update user route
router.delete("/me", authMiddleware, deleteUser);

export default router;
