import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Event, User } from "../../models/index.js";

/**
 * Get all the Events posted by current user
 *
 * **_Requires Authentication🚀_**
 */
export const getEventsCreatedByCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;

        const events = await Event.findAll({
            where: { user_id: userId },
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

        const event = await Event.findByPk(eventId, {
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: {
                        exclude: ["password", "refresh_token", "email"],
                    },
                },
            ],
        });

        if (!event) {
            throw new ErrorResponse(404, "not_found", "event not found");
        }

        return res
            .status(200)
            .json(new SuccessResponse(200, "event fetched", event));
    },
);
