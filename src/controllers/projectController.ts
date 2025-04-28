import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../utilities/prisma.js";
import { nanoid } from "nanoid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["audio/wave", "audio/wav", "audio/x-wav"];

interface RequestWithAuth extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export async function uploadFile(req: RequestWithAuth, res: Response) {
    req.user = {
        id: "cm9u5rwa40000phmlpu6x2f6w",
        email: "sixten@chasacademy.se",
    };
    // Validate user
    const parsedUser = z
        .object({
            id: z.string(),
            email: z.string().email(),
        })
        .safeParse(req.user);

    if (!parsedUser.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    // Validate request parameters
    const parsedParams = z
        .object({
            projectId: z.string(),
        })
        .safeParse(req.params);

    // Validate request body
    const parsedBody = z
        .object({
            fileName: z.string().min(1),
        })
        .safeParse(req.body);

    // Validate request file
    const parsedFile = z
        .object({
            fieldname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z
                .string()
                .refine(val => ALLOWED_MIME_TYPES.includes(val)),
            buffer: z.instanceof(Buffer),
            size: z.number().max(MAX_FILE_SIZE),
        })
        .safeParse(req.file);

    // Check if all validations passed
    if (!parsedFile.success || !parsedParams.success || !parsedBody.success) {
        res.status(400).json({
            error: "Bad request",
        });
        return;
    }

    // Check if the project exists and the user is the owner
    const project = await prisma.project.findUnique({
        where: {
            id: parsedParams.data.projectId,
            ownerId: parsedUser.data.id,
        },
    });

    if (!project) {
        res.status(404).json({
            message: "Project not found",
        });
        return;
    }

    // Generate a unique s3 key
    const key = nanoid(21);

    // TODO: Upload the file to S3

    // Create a db record for the audio file
    try {
        await prisma.audioFile.create({
            data: {
                name: parsedBody.data.fileName,
                s3Key: key,
                projectId: parsedParams.data.projectId,
            },
        });
    } catch {
        res.status(500).json({
            message: "Internal server error",
        });
        return;
    }

    res.status(200).json({
        message: "File uploaded successfully",
    });
}
