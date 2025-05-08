import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createProject,
    deleteProject,
    getProject,
} from "../controllers/projectController";

const router = Router();

router.post("/", authMiddleware, createProject);
router.post("/:projectId", authMiddleware, getProject);
router.delete("/:projectId", authMiddleware, deleteProject);

export default router;
