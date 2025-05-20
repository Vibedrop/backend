import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    uploadAudio,
    getSignedUrl,
    getSignedUrls,
    getAudioFile,
} from "../controllers/audioController";
import multer from "multer";
import Upload from "../middleware/multer";
import { s3 } from "../utilities/s3";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:projectId", authMiddleware, upload.single("file"), uploadAudio);
// Get audio file data including signed URL
router.get("/:projectId/:s3Key", authMiddleware, getSignedUrl);
// Get array of all audio files for a project with signed URLs
router.get("/:projectId", authMiddleware, getSignedUrls);
// TODO: Delete audio file
router.post("/:fileId", authMiddleware, getAudioFile);

export default router;
