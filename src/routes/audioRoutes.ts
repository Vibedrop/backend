import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    uploadAudio,
    getSignedUrl,
    getSignedUrls,
} from "../controllers/audioController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:projectId", authMiddleware, upload.single("file"), uploadAudio);
// Get audio file data including signed URL
router.get("/:projectId/:s3Key", authMiddleware, getSignedUrl);
// Get array of all audio files for a project with signed URLs
router.get("/:projectId", authMiddleware, getSignedUrls);
// TODO: Delete audio file

export default router;
