import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/sign-out", authMiddleware, signOut);

export default router;
