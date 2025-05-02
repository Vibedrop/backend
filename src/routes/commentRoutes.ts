import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addComment, getComment } from "../controllers/commentController";

const router = Router();

router.post("/", authMiddleware, addComment);
router.post("/:fileID", authMiddleware, getComment);
export default router;
