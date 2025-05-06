import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createProject,
    deleteProject,
    uploadFile,
    getProject,
} from "../controllers/projectController";
import multerUpload from "../middleware/multer";

const router = Router();

router.post("/", authMiddleware, createProject);
router.post("/:projectId", authMiddleware, getProject);
router.delete("/:projectId", authMiddleware, deleteProject);
router.post(
    "/:projectId/files",
    authMiddleware,
    multerUpload.single("file"),
    uploadFile,
);

export default router;
