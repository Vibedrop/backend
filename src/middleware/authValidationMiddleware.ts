// middleware/formValidationMiddleware.ts
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// Reusable password schema (DRY)
const passwordSchema = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[\W_]/, "Password must contain at least one special character");

// Schemas for different routes
const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: passwordSchema,
    username: z
        .string()
        .trim()
        .min(1, "Username is required")
        .max(20, "Username must be at most 20 characters long")
        .regex(
            /^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/,
            "Username can contain letters, numbers, and underscores, with single spaces allowed between words",
        ),
});

const userUpdateSchema = z
    .object({
        oldPassword: passwordSchema.optional(),
        newPassword: passwordSchema.optional(),
    })
    .refine(data => !!data.oldPassword === !!data.newPassword, {
        message: "Both old and new password must be provided together",
    });

// Middleware handler creator
const createValidationMiddleware = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body) as z.SafeParseReturnType<
            unknown,
            unknown
        >;

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const message = Object.values(errors).flat().join(", ");
            res.status(400).json({ message, errors });
            return;
        }

        req.body = result.data;
        next();
    };
};

export const validateLogin = createValidationMiddleware(loginSchema);
export const validateUser = createValidationMiddleware(registerSchema);
export const validateUserUpdate = createValidationMiddleware(userUpdateSchema);
