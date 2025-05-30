import { Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import prisma from "../../db/prisma.js";

import { RequestWithContext } from "../../types/index.js";

export const getCurrentUserData = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const userId = req.user.id;

        if (!userId) {
            throw new ErrorResponse(401, "auth", "Unauthorized access detected!");
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
