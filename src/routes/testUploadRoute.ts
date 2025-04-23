// src/routes/testUploadRoute.ts

import { Router } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = Router();

const s3 = new S3Client({
    region: process.env.S3_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

router.get("/ping-s3", async (_req, res) => {
    const timestamp = Date.now();
    const content = Buffer.from(`Test från backend via S3 SDK – ${timestamp}`);

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `test/test-upload-${timestamp}.txt`,
        Body: content,
        ContentType: "text/plain",
    });

    try {
        await s3.send(command);
        res.status(200).json({
            success: true,
            message: "Upload succeeded!",
            key: `test/test-upload-${timestamp}.txt`,
        });
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ success: false, error });
    }
});

export default router;
