import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";

export const verifyToken = asyncHandler(
    async (req: Request, res: Response) => { },
);
