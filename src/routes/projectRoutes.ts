import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createProject, deleteProject, uploadFile } from "../controllers/projectController";
import multer, { memoryStorage } from "multer";
const router = Router();

// Middleware to handle file uploads
const upload = multer({
    storage: memoryStorage(),
});

router.post("/", authMiddleware, createProject);
router.post("/:projectId/files", upload.single("file"), uploadFile);
router.delete("/:projectId", authMiddleware, deleteProject);

export default router;
