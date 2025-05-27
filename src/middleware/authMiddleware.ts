import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface ProtectedRequest extends Request {
    user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function authMiddleware(
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.cookies.auth_token;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized request. No token found.",
        });
        return;
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    // Verify token with verify()
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        req.user = decoded;

        next();
    } catch {
        res.status(401).json({
            message: "Unauthorized request. Invalid token.",
        });
        return;
    }
}
