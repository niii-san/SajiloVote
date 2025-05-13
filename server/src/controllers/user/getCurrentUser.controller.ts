import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import prisma from "../../db/prisma.js";

export const getCurrentUserData = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;

        if (!userId) {
            throw new ErrorResponse(401, 2034, "Unauthorized access detected!");
        }
        const user = await prisma.user.findFirst({
            where: { id: userId },
            omit: { password: true, suspended: true, suspended_till: true },
        });

        return res
            .status(200)
            .json(new SuccessResponse(200, "Current user data fetched", user));
    },
);
