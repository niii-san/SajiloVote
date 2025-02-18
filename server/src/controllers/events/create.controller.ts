import { Request, Response } from "express";
import {
    asyncHandler,
    SuccessResponse,
    ErrorResponse,
} from "../../utils/index.js";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {

    return res
        .status(201)
        .json(
            new SuccessResponse(200, "Event created: TEST PASSED", null),
        );
});
