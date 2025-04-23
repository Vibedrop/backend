import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ProtectedRequest extends Request {
    user?: JwtPayload
}

// TODO: Move JWT_SECRET to a .env file
const JWT_SECRET = "vibedrop";

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
        // console.log("Req user: ", req.user);
        next();

    } catch (err) {
        // console.log(err);
        res.status(401).json({ message: "Unauthorized request. Invalid token." });
        return;
    }
}
