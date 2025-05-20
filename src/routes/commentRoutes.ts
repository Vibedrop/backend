import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addComment, getComment, deleteComment } from "../controllers/commentController";

const router = Router();

router.post("/", authMiddleware, addComment);
router.post("/:fileID", authMiddleware, getComment);
router.delete("/:commentId", authMiddleware, deleteComment);
export default router;
