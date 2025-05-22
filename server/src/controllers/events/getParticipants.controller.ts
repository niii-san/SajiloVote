import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";
import prisma from "../../db/prisma.js";

export const getEventParticipants = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const eventId = req.params.eventId;

        const event = await prisma.event.findFirst({
            where: { id: eventId },
            include: {
                event_participants: {
                    include: {
                        user: {
                            omit: {
                                password: true,
                                suspended: true,
                                suspended_till: true,
                                created_at: true,
                                updated_at: true,
                            },
                        },
                    },
                    omit: {
                        user_id: true,
                    },
                },
            },
        });

        if (!event) {
            throw new ErrorResponse(404, "not_found", "Event not found");
        }

        const eventParticipants = event?.event_participants;

        return res
            .status(200)
            .json(
                new SuccessResponse(
                    200,
                    `Event participants of ${eventId} fetched.`,
                    eventParticipants,
                ),
            );
    },
);
