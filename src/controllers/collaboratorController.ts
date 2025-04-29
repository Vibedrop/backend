import { Request, Response } from "express";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";

// Bjuda in collaborator
export const addCollaborator = async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?.id;
    const { projectId, collaboratorId } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project || project.ownerId !== userId) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }

        const collaborator = await prisma.collaborator.create({
            data: {
                projectId,
                userId: collaboratorId,
            },
        });

        res.status(201).json(collaborator);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding collaborator" });
    }
};
