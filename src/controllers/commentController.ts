import { Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";
import { z } from "zod";

export const getComment = async (req: ProtectedRequest, res: Response) => {
    const parsedFileId = z
        .object({
            fileid: z.string(),
        })
        .safeParse(req.body);

    if (!parsedFileId.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }
    try {
        const comments = await prisma.comment.findMany({
            where: { fileId: parsedFileId.data.fileid },
            include: {
                author: true,
            },
        });

        res.status(201).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error finding comment" });
    }
};

export const addComment = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { content, fileId, timestamp } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const audioFile = await prisma.audioFile.findUnique({
            where: { id: fileId },
            include: {
                project: {
                    include: {
                        collaborators: true,
                    },
                },
            },
        });

        if (!audioFile) {
            res.status(404).json({ message: "Audio file not found" });
            return;
        }

        const isOwner = audioFile.project.ownerId === userId;
        const isCollaborator = audioFile.project.collaborators.some(
            c => c.userId === userId,
        );

        if (!isOwner && !isCollaborator) {
            res.status(403).json({ message: "Not authorized to comment" });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                timestamp,
                fileId,
                authorId: userId,
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding comment" });
    }
};
