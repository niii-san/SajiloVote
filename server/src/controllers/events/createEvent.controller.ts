import { asyncHandler, ErrorResponse, SuccessResponse } from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";

export const createEvent = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const eventTitle = req.body?.title ?? "";
        const eventDescription = req.body?.description ?? "";
        const eventType = req.body?.event_type ?? "";
        const creatorId = req.user.id;
        const startType = req.body?.start_type ?? "";
        const startAt = req.body?.start_at ?? "";
        const endType = req.body?.end_type ?? "";
        const endAt = req.body?.end_at ?? "";
        const multiVote = req.body?.multi_vote ?? false;
        const anonymousVote = req.body?.anonymous_vote ?? false;




        return res
            .status(200)
            .json(new SuccessResponse(200, "Event created", null));
    },
);
