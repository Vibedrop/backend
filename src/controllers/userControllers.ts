import { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
    res.status(200).json("getUser");
}
