import { Router } from "express";
import { createProject, uploadFile } from "../controllers/projectController";
import multer, { memoryStorage } from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Middleware to handle file uploads
const upload = multer({
    storage: memoryStorage(),
});

router.post("/", authMiddleware, createProject);
router.post("/:projectId/files", upload.single("file"), uploadFile);

export default router;
