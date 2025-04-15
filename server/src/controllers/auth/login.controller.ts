import { User } from "../../models/index.js";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { cookieOptions } from "../../constants.js";
// helo
// 0

export const login = asyncHandler(async (req: Request, res: Response) => { });
