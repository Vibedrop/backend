import { Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";
import { supabase } from "../utilities/supabase";
import { nanoid } from "nanoid";
import { z } from "zod";
import * as musicMetadata from "music-metadata";

export const uploadAudio = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId } = req.params;
    const file = req.file as Express.Multer.File;
    const { title, description } = req.body;
    const s3Key = nanoid(21);

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        if (project.ownerId !== userId) {
            res.status(403).json({
                message: "Not allowed to upload to this project",
            });
            return;
        }

        const metadata = await musicMetadata.parseBuffer(
            file.buffer,
            file.mimetype,
        );
        const duration = metadata.format.duration; // In seconds
        console.log("duration", duration);

        const path = `${projectId}/${s3Key}`;

        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET_NAME as string)
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                // upsert: true,
                // upsert = skriva över filen om den redan finns
            });

        const newAudioFile = await prisma.audioFile.create({
            data: {
                name: title,
                description: description,
                s3Key: s3Key,
                projectId: projectId,
                duration: duration,
            },
        });

        res.status(201).json(newAudioFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading audio" });
    }
};

export const getSignedUrl = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId, s3Key } = req.params;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const audioFile = await prisma.audioFile.findUnique({
            where: { s3Key: s3Key },
        });
        if (!audioFile) {
            res.status(404).json({ message: "Audio file not found" });
            return;
        }

        // const project = await prisma.project.findUnique({
        //     where: { id: audioFile?.projectId },
        // });
        // if (!project) {
        //     res.status(404).json({ message: "Project not found" });
        //     return;
        // }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { collaborators: true },
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        const isOwner = project.ownerId === userId;
        const isCollaborator = project.collaborators.some(
            collab => collab.userId === userId,
        );

        if (!isOwner && !isCollaborator) {
            res.status(403).json({
                message: "Not allowed to access this project",
            });
            return;
        }

        if (project.id !== projectId) {
            res.status(400).json({
                message: "Request does not match current project",
            });
            return;
        }

        const path = `${project.id}/${audioFile.s3Key}`;

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET_NAME as string)
            .createSignedUrl(path, 60 * 60, { download: false }); // 1 hour expiration
        if (error || !data.signedUrl) {
            res.status(500).json({ message: "Error generating signed URL" });
            return;
        }

        res.status(200).json({ url: data.signedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching audio files" });
    }
};

export const getSignedUrls = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId } = req.params;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        if (project.ownerId !== userId) {
            res.status(403).json({
                message: "Not allowed to access this project",
            });
            return;
        }

        const audioFiles = await prisma.audioFile.findMany({
            where: { projectId: projectId },
        });

        const signedUrls = await Promise.all(
            audioFiles.map(async audioFile => {
                const path = `${project.name}/${audioFile.s3Key}`;

                const { data, error } = await supabase.storage
                    .from(process.env.SUPABASE_BUCKET_NAME as string)
                    .createSignedUrl(path, 60 * 60, { download: false }); // 1 hour expiration
                if (error || !data.signedUrl) {
                    throw new Error("Error generating signed URL");
                }

                return { ...audioFile, signedUrl: data.signedUrl };
            }),
        );

        res.status(200).json(signedUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching audio files" });
    }
};
export async function getAudioFile(req: ProtectedRequest, res: Response) {
    const parsedProject = z
        .object({
            projectId: z.string(),
        })
        .safeParse(req.body);

    if (!parsedProject.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }
    const project = await prisma.audioFile.findMany({
        where: {
            projectId: parsedProject.data.projectId,
        },
    });
    res.status(200).json(project);
}

export const deleteAudioFile = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId, audioFileId } = req.params;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const audioFile = await prisma.audioFile.findUnique({
            where: { id: audioFileId },
        });

        if (!audioFile) {
            res.status(404).json({ message: "Audio file not found" });
            return;
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.ownerId !== userId) {
            res.status(403).json({
                message: "Not authorized to delete this audio file",
            });
            return;
        }

        const path = `${project.name}/${audioFile.s3Key}`;

        // Radera från Supabase Storage
        const { error: storageError } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET_NAME as string)
            .remove([path]);

        if (storageError) {
            console.error("Supabase deletion error:", storageError);
            res.status(500).json({
                message: "Failed to delete audio from storage",
            });
            return;
        }

        // Radera från databasen
        await prisma.audioFile.delete({
            where: { id: audioFileId },
        });

        res.status(200).json({ message: "Audio file deleted successfully" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting audio file" });
        return;
    }
};
