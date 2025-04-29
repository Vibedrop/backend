import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    validateLogin,
    validateUser,
} from "../middleware/authValidationMiddleware";

const router = Router();

router.post("/sign-in", validateLogin, signIn);
router.post("/sign-up", validateUser, signUp);
router.post("/sign-out", authMiddleware, signOut);

export default router;
