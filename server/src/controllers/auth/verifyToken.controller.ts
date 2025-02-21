import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(
        new SuccessResponse(200, "token verified", {
            email: req.user?.email,
        }),
    );
});
