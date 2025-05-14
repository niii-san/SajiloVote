import { Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";

import { RequestWithContext } from "../../types/RequestWithContext.js";
import prisma from "../../db/prisma.js";

export const verifyToken = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const user = await prisma.user.findFirst({
            where: { id: req.user.id },
            omit: {
                password: true,
                suspended: true,
                suspended_till: true,
            },
        });
        return res
            .status(200)
            .json(new SuccessResponse(200, "token is valid", user));
    },
);
