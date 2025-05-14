import { asyncHandler, SuccessResponse } from "../../utils/index.js";
import { Request, Response } from "express";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const eventTitle = req.body?.title ?? "";
    const eventDescription = req.body?.description ?? "";
    const eventType = req.body?.event_type ?? ""



    return res
        .status(200)
        .json(new SuccessResponse(200, "Event created", null));
});
