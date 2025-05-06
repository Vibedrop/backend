import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadAudio } from "../controllers/audioController";
import Upload from "../middleware/multer";
import { s3 } from "../utilities/s3";

const router = Router();

router.post("/", authMiddleware, Upload.single("file"), uploadAudio);

export default router;
