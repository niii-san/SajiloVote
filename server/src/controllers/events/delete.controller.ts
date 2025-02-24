import { Request, Response } from "express";
import {
    asyncHandler,
    SuccessResponse,
    ErrorResponse,
} from "../../utils/index.js";
import { Event } from "../../models/index.js";

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    const { eventId } = req.params;

    if (!userId) {
        throw new Error("server was not able to get userId");
    }

    if (isNaN(+eventId)) {
        return new ErrorResponse(400, "client_error", "Invalid event id");
    }

    const event = await Event.destroy({
        where: { event_id: eventId, user_id: userId },
    });
    if (!event) {
        return new ErrorResponse(404, "client_error", "Event not found");
    }

    return res
        .status(200)
        .json(new SuccessResponse(200, "Event deleted", event));
});
