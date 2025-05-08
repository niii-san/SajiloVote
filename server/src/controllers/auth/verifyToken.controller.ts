import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";
import prisma from "../../db/prisma.js";

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findFirst({
        where: { id: req.user?.id },
        omit: {
            password: true,
            refresh_token: true,
            created_at: true,
            updated_at: true,
        },
    });
    return res
        .status(200)
        .json(new SuccessResponse(200, "token is valid", user));
});
