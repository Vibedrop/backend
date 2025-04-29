import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addComment } from "../controllers/commnetController";

const router = Router();

router.post("/", authMiddleware, addComment);

export default router;
