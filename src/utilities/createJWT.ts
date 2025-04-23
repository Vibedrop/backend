import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

// TODO: Move JWT_SECRET to a .env file
const JWT_SECRET = "vibedrop" as string;
const expiresIn = "7d";

export const createJWT = (user: User) => {
  return jwt.sign(
    {id: user.id, email: user.email},
    JWT_SECRET,
    { expiresIn } as jwt.SignOptions
  )
}
