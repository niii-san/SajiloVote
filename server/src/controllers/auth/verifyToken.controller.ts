import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { SuccessResponse } from "../../utils/SuccessResponse.js";

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(
        new SuccessResponse(200, true, "token verified", {
            email: req.user?.email,
        }),
    );
});
