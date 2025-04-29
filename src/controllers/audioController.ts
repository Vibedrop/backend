import { Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";


export const uploadAudio = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId } = req.body;
    const file = req.file as Express.MulterS3.File;

    if (!file || !userId) {
        res.status(400).json({ message: "No file uploaded or unauthorized" });
        return;
    }

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== userId) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }

        const newAudio = await prisma.audioFile.create({
            data: {
                name: file.originalname,
                s3Key: file.key,
                projectId: projectId,
            },
        });

        res.status(201).json(newAudio);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading audio" });
    }
};
