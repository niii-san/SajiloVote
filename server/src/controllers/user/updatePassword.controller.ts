import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";

export const updatePassword = asyncHandler(
    async (req: Request, res: Response) => { },
);
