import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";

export const logout = asyncHandler(async (_: Request, res: Response) => {
    return res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(200)
        .json(new SuccessResponse(200, "Logout successful", null));
});
