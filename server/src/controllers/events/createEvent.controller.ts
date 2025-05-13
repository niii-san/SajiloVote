import { asyncHandler, SuccessResponse } from "../../utils/index.js";
import { Request, Response } from "express";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    return res
        .status(200)
        .json(new SuccessResponse(200, "Event created", null));
});
