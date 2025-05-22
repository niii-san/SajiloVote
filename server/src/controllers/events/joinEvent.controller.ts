import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";
import prisma from "../../db/prisma.js";

export const joinEvent = asyncHandler(
    async (req: RequestWithContext, res: Response) => {


        return res
            .status(201)
            .json(new SuccessResponse(201, "Event joined successfully", null));
    },
);
