import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";
import prisma from "../../db/prisma.js";

/**
 * @desc    Get all events created by the context user
 */
export const hasCurrentUserJoinedEvent = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const eventId = req.params?.eventId;
        const userId = req.user.id;

        const participation = await prisma.eventParticipant.findFirst({
            where: {
                event_id: eventId,
                user_id: userId,
            },
        });

        if (!participation) {
            throw new ErrorResponse(
                400,
                "client",
                "You've not joined the event",
            );
        }

        return res.status(200).json(
            new SuccessResponse(200, "You've joined the event", {
                ...participation,
                joined: true,
            }),
        );
    },
);
