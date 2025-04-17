import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { cookieOptions } from "../../constants.js";

export const login = asyncHandler(async (req: Request, res: Response) => { });
