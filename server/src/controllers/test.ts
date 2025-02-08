import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export const test = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ test: "passed" });
});
