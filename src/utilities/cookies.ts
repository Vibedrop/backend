import type { Response } from "express";

const AUTH_COOKIE_NAME = "auth_token";
const expirationDays = 7;

const cookieOptions = {
    // Use 'lax' for same-site cookies in prod
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
    // TODO: Move to .env file and test in prod / this restricts the cookie to be sent only over HTTPS
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    path: "/",
    partitioned: true, // Required in Chrome to allow third-party cookies (new)
};

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie(AUTH_COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: expirationDays * 1000 * 60 * 60 * 24, // 7 days
    });
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions });
};
