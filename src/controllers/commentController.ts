import { Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";
import { z } from "zod";

export async function updateLastReadAt(req: ProtectedRequest, res: Response) {
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const parsedParams = z
        .object({
            fileID: z.string(),
        })
        .safeParse(req.params);

    if (!parsedParams.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    try {
        await prisma.commentsLastRead.update({
            where: {
                userId_audioFileId: {
                    userId: user.id,
                    audioFileId: parsedParams.data.fileID,
                },
            },
            data: {
                lastReadAt: new Date(),
            },
        });

        res.status(200).json({
            message: "Last read time updated successfully",
        });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
}

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
            select: {
                id: true,
                content: true,
                timestamp: true,
                fileId: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        emailVerified: true,
                        createdAt: true,
                    },
                },
            },
        });

        const lastRead = await prisma.commentsLastRead.findUnique({
            where: {
                userId_audioFileId: {
                    userId: req.user?.id,
                    audioFileId: parsedFileId.data.fileid,
                },
            },
        });

        res.status(201).json({
            comments,
            lastReadAt: lastRead?.lastReadAt || new Date(0),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error finding comment" });
    }
};

export const addComment = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const parsedComment = z
        .object({
            content: z.string(),
            fileId: z.string(),
            timestamp: z.number(),
        })
        .safeParse(req.body);

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!parsedComment.success) {
        res.status(400).json({ message: "Bad request" });
        return;
    }

    try {
        const { content, fileId, timestamp } = parsedComment.data!;
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
            select: {
                id: true,
                content: true,
                timestamp: true,
                fileId: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        emailVerified: true,
                        createdAt: true,
                    },
                },
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding comment" });
    }
};

export const deleteComment = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { commentId } = req.params;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                id: true,
                authorId: true,
            },
        });

        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        if (comment.authorId !== userId) {
            res.status(403).json({
                message: "Only the comment author can delete this comment",
            });
            return;
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting comment" });
    }
};