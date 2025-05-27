import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;
const expiresIn = "7d";

export const createJWT = (user: User) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn,
    } as jwt.SignOptions);
};
