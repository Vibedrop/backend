import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../utilities/prisma";
import { ProtectedRequest } from "../middleware/authMiddleware";

// Skapa nytt projekt
export async function createProject(req: ProtectedRequest, res: Response) {
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

    // Validate request body
    const parsedBody = z
        .object({
            name: z.string().min(1),
            description: z.string().min(1),
            deadline: z.string(),
        })
        .safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    const deadline =
        parsedBody.data.deadline !== "" ? parsedBody.data.deadline : null;

    try {
        const project = await prisma.project.create({
            data: {
                name: parsedBody.data.name,
                description: parsedBody.data.description,
                ownerId: parsedUser.data.id,
                deadline: deadline,
            },
        });

        res.status(201).json(project);
    } catch {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

// Hämta projekt
export async function getProject(req: ProtectedRequest, res: Response) {
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
    const project = await prisma.project.findUnique({
        where: {
            id: parsedProject.data.projectId,
        },
        include: {
            collaborators: {
                include: {
                    user: true,
                },
            },
            owner: true, // this includes the project owner (User)
            audioFiles: true,
        },
    });
    res.status(200).json(project);
}

// Radera ett projekt
export const deleteProject = async (req: ProtectedRequest, res: Response) => {
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

        if (!project || project.ownerId !== userId) {
            res.status(403).json({
                message: "Not allowed to delete this project",
            });
            return;
        }

        await prisma.project.delete({ where: { id: projectId } });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting project" });
    }
};
