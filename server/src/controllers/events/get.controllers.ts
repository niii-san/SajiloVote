import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Event } from "../../models/index.js";

/**
 * Get all the Events posted by current user
 *
 * **_Requires Authentication🚀_**
 */
export const getEventsCreatedByCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;

        const events = await Event.findAll({
            where: { creator_id: userId },
        });

        return res
            .status(200)
            .json(
                new SuccessResponse(200, "self created events fetched", events),
            );
    },
);

/**
 * Get events for preview like
 * for showing before joining
 *
 * **_Requires Authentication🚀_**
 */
export const getPreviewEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const { eventId } = req.params;

        if (isNaN(Number(eventId))) {
            throw new ErrorResponse(400, "client_error", "invalid event id");
        }

        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new ErrorResponse(404, "not_found", "event not found");
        }

        return res
            .status(200)
            .json(new SuccessResponse(200, "event fetched", event));
    },
);
