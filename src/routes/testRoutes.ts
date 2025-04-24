import { Router } from "express";
import { prisma } from "../utilities/prisma";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../utilities/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";

const router = Router();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME || "",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
});

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

router.get("/prisma", async (req, res) => {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
});

router.post("/prisma", async (req, res) => {
    const randomEmail =
        Math.random().toString(36).substring(2, 15) + "@example.com";
    const randomUsername =
        Math.random().toString(36).substring(2, 15) + "@example.com";
    const randomPassword = Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
        data: {
            email: randomEmail,
            username: randomUsername,
            password: randomPassword,
        },
    });
    res.status(201).json(user);
});

router.get("/s3", async (req, res) => {
    const listCommand = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
    });

    try {
        const data = await s3.send(listCommand);

        if (!data.Contents) {
            res.status(404).json({ error: "No objects found in S3 bucket" });
            return;
        }

        const presignedDataPromise = data.Contents.map(async item => {
            const objectCommand = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: item.Key,
            });

            const url = await getSignedUrl(s3, objectCommand, {
                expiresIn: 60 * 10, // 10 minutes
            });

            console.log("testRoutes GET data.contents", data.Contents);

            return {
                key: item.Key,
                lastModified: item.LastModified,
                size: item.Size,
                etag: item.ETag,
                storageClass: item.StorageClass,
                preSignedUrl: url,
            };
        });

        const presignedData = await Promise.all(presignedDataPromise);
        res.status(200).json(presignedData);
        return;
    } catch (error) {
        console.error("Error listing S3 objects:", error);
        res.status(500).json({ error });
        return;
    }
});

router.get("/s3/:key", async (req, res) => {
    const objectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.params.key,
    });

    const url = await getSignedUrl(s3, objectCommand, { expiresIn: 30 });

    res.redirect(url);
    return;
});

router.post("/s3", upload.single("file"), async (req, res) => {
    const file = req.file;
    console.log("req.file testRoutes", file);

    file
        ? res.status(200).json(file)
        : res.status(400).json({ error: "No file uploaded" });

    return;
});

export default router;
