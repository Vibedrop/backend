import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    validateLogin,
    validateUser,
} from "../middleware/authValidationMiddleware.js";

const router = Router();

router.post("/sign-in", validateLogin, signIn);
router.post("/sign-up", validateUser, signUp);
router.post("/sign-out", authMiddleware, signOut);

export default router;
