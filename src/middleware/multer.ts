import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utilities/s3";
import { Request } from "express";

const multerUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME || "",
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname,
                originalName: file.originalname,
            });
        },
        key: function (req: Request, file, cb) {
            const projectId = req.body.projectId;
            const s3Key = req.body.s3Key;
            cb(null, `${projectId}/${s3Key}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
});

export default multerUpload;
