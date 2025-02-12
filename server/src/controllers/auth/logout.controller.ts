import { Request, Response } from "express";
import { asyncHandler } from "../../utils/index.js";

export const logout = asyncHandler(async (req: Request, res: Response) => {
    return res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .redirect("/");
});
