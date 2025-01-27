import { asyncHandler, SuccessfulResponse } from "../../utils/index.js";
import { Request, Response } from "express";

export const login = asyncHandler(async (req: Request, res: Response) => {
    return res
        .status(200)
        .json(new SuccessfulResponse<null>(200, false, "Test passed", null));
});
