import { Request, Response } from "express";
import { ProtectedRequest } from "../middleware/authMiddleware";
import { prisma } from "../utilities/prisma";

export function getUser(req: Request, res: Response) {
    res.status(200).json("getUser");
}

export const getUserProfile = async (req: ProtectedRequest, res: Response) => {
    // Get user from JWT
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if(!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const { password, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user profile." });
        return;
    }
};

export const deleteUser = async (req: ProtectedRequest, res: Response) => {
    try {
        // Get user from JWT
        const userId = req.user?.id;
        const user = await prisma.user.findUnique({ where: { id: userId }});

        if (!user) {
            res.status(404).json({ message: "User not found. Cannot delete non-existent user." });
            return;
        }

        await prisma.user.delete({ where: { id: userId }});

        res.status(200).json({ message: "User deleted successfully." });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting user." });
        return;
    }
};
