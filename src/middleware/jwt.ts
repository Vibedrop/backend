import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = "vibedrop";

export async function jwtMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const parsedAuthHeader = z.string().safeParse(req.headers["authorization"]);

    if (!parsedAuthHeader.success) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    const parsedToken = z
        .string()
        .safeParse(parsedAuthHeader.data.split(" ")[1]);

    if (!parsedToken.success) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    const isVerified = verify(parsedToken.data, JWT_SECRET);

    if (!isVerified) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    next();
}
