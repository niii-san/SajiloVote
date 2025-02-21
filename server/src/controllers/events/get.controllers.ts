import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";
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
