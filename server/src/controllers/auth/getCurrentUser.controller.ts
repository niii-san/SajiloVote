import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";

export const getCurrentUserData = asyncHandler(
    async (req: Request, res: Response) => { },
);
