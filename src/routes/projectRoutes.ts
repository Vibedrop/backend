import { Router } from "express";
import { uploadFile } from "../controllers/projectController.js";
import multer, { memoryStorage } from "multer";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Middleware to handle file uploads
const upload = multer({
    storage: memoryStorage(),
});

router.post("/:projectId", upload.single("file"), uploadFile);

export default router;
