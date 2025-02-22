import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Event, EventParticipant } from "../../models/index.js";

/**
 * Join Event
 *
 * **_Requires Authentication🚀_**
 */
export const joinEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const userId = req.user?.user_id;
    if (!userId) {
        throw new ErrorResponse(404, "not_found", "user not found");
    }

    if (isNaN(Number(eventId))) {
        throw new ErrorResponse(400, "invalid_payload", "invalid event id");
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
        throw new ErrorResponse(404, "not_found", "event not found");
    }

    if (event.creator_id === userId) {
        return res.status(200).json(
            new SuccessResponse(200, "event joined", {
                eventId,
                userId,
            }),
        );
    }

    const alreadyJoined = await EventParticipant.findOne({
        where: { event_id: event.event_id, user_id: userId },
    });

    if (alreadyJoined) {
        throw new ErrorResponse(
            400,
            "already_exists",
            "already joined this event",
        );
    }

    const participant = await EventParticipant.create({
        event_id: event.event_id,
        user_id: userId,
    });

    return res
        .status(200)
        .json(new SuccessResponse(200, "event joined", participant));
});
