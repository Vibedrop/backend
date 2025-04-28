import type { Request, Response } from "express";
import { createJWT } from "../utilities/createJWT.js";
import { prisma } from "../utilities/prisma.js";
import bcrypt from "bcryptjs";
import z from "zod";
import { clearAuthCookie, setAuthCookie } from "../utilities/cookies.js";

const SALT_ROUNDS = 10;

export async function signUp(req: Request, res: Response) {
    const signUpBody = z
        .object({
            email: z.string().email(),
            password: z.string(),
            username: z.string(),
        })
        .safeParse(req.body);

    console.log("signUpBody", req.body);

    if (!signUpBody.success) {
        res.status(400).json({
            message: "Bad request",
        });
        return;
    }

    try {
        const { email, password, username } = signUpBody.data;
        const userEmailExists = await prisma.user.findUnique({
            where: { email },
        });
        const userUsernameExists = await prisma.user.findUnique({
            where: { username },
        });

        if (userEmailExists) {
            res.status(409).json({
                message: "An account with that email adress already exists.",
            });
            return;
        }

        if (userUsernameExists) {
            res.status(409).json({
                message: "A user with that username already exists.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Saved hashed PW to DB
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, username },
        });

        res.status(201).json({
            message: "User created successfully.",
            user: user.username,
        });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user." });
        return;
    }
}

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

    try {
        // Find user in DB by email (@unique)
        const { email, password } = signInBody.data;
        const user = await prisma.user.findUnique({ where: { email } });

        // If user not in DB
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        // If passwords match
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }

        // If user authorized (authenticated/auth) then create JWT (JSON Web Token)
        const token = createJWT(user);

        // Set the token in an HttpOnly-cookie
        setAuthCookie(res, token);

        res.status(200).json({ message: "Logged in successfully." });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in." });
        return;
    }
}

export async function signOut(req: Request, res: Response) {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
}
