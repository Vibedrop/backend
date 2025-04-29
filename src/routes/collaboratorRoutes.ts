import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addCollaborator } from "../controllers/collaboratorController";

const router = Router();

router.post("/", authMiddleware, addCollaborator);

export default router;
