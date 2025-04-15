import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";

export const updateFirstName = asyncHandler(
    async (req: Request, res: Response) => { },
);

export const updateLastName = asyncHandler(
    async (req: Request, res: Response) => { },
);
