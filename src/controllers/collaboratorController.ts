import { Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";

// Bjuda in collaborator
export const addCollaborator = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId, email } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const Usercollaborator = await prisma.user.findUnique({
            where: { email: email },
        });


        if (Usercollaborator === null) {
            res.status(403).json({ message: "Cant find the user" });
            return;
        }

        if (Usercollaborator.id === userId) {
            res.status(400).json({ message: "You cannot invite yourself to your own project"});
            return;
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { audioFiles: true },
        });

        if (!project || project.ownerId !== userId) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }

        const collaborator = await prisma.collaborator.create({
            data: {
                projectId,
                userId: Usercollaborator.id,
            },
        });

        // Add commentsreadlast for every file in the project

        const commentsReadLast = project.audioFiles.map(file => ({
            audioFileId: file.id,
            userId: collaborator.userId,
        }));

        try {
            await prisma.commentsLastRead.createMany({
                data: commentsReadLast,
            });
        } catch {
            console.error("Error creating commentsLastRead entries");
        }

        res.status(201).json(collaborator);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding collaborator" });
    }
};

export const removeCollaborator = async (
    req: ProtectedRequest,
    res: Response,
) => {
    const userId = req.user?.id;
    const { projectId, collaboratorId } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        // Kontrollera att det är projektägaren som försöker ta bort
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.ownerId !== userId) {
            res.status(403).json({
                message: "Not authorized to remove collaborator",
            });
            return;
        }

        // Kontrollera att collaborator finns
        const existing = await prisma.collaborator.findFirst({
            where: {
                projectId: projectId,
                userId: collaboratorId,
            },
        });

        if (!existing) {
            res.status(404).json({
                message: "Collaborator not found in this project",
            });
            return;
        }

        // Ta bort collaboratorkopplingen
        await prisma.collaborator.delete({
            where: { id: existing.id },
        });

        res.status(200).json({ message: "Collaborator removed successfully" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing collaborator" });
        return;
    }
};
