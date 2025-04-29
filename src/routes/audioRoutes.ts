import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadAudio } from "../controllers/audioController";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utilities/s3";

const router = Router();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME || "",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `audio/${Date.now().toString()}-${file.originalname}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
});

router.post("/", authMiddleware, upload.single("file"), uploadAudio);

export default router;
