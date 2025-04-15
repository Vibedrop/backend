import { Request, Response } from "express";
import { prisma } from "../utilities/prisma";
import z from "zod";

export async function signIn(req: Request, res: Response) {
    const signInBody = z
        .object({
            email: z.string().email(),
            password: z.string(),
        })
        .safeParse(req.body);

    if (!signInBody.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    const { email, password } = signInBody.data;

    try {
        const users = await prisma.user.findFirst({
            where: { AND: [{ email: email }, { password: password }] },
        });
        console.log("users", users);
        if (users !== null) {
            const token =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            res.status(200).json({
                message: "Login successfull",
                token: token,
            });
            return;
        }
        res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}
export async function signUp(req: Request, res: Response) {
    const signUpBody = z
        .object({
            email: z.string().email(),
            password: z.string(),
            username: z.string()
        })
        .safeParse(req.body);

    if (!signUpBody.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    const { email, password, username } = signUpBody.data;

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: password,
                username: username,
            },
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}
