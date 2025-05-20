import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    addCollaborator,
    removeCollaborator,
} from "../controllers/collaboratorController";

const router = Router();

router.post("/", authMiddleware, addCollaborator);
router.delete("/", authMiddleware, removeCollaborator);

export default router;
