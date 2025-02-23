import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import {
    Event,
    EventParticipant,
    PollOption,
    User,
    VoteCandidate,
    VoteRecord,
} from "../../models/index.js";
import { log } from "node:console";

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

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const userId = req.user?.user_id;

    if (isNaN(Number(eventId))) {
        throw new ErrorResponse(400, "client_error", "invalid event id");
    }

    const event = await Event.findByPk(eventId, {
        include: [
            { model: PollOption, as: "poll_options" },
            { model: VoteCandidate, as: "vote_candidates" },
            { model: EventParticipant, as: "event_participants" },
            { model: VoteRecord, as: "vote_records" },
            {
                model: User,
                as: "creator",
                attributes: { exclude: ["password", "refresh_token", "email"] },
            },
        ],
    });
    if (!event) {
        throw new ErrorResponse(404, "not_found", "event not found");
    }

    const hasUserParticipated = event.event_participants?.some(
        (p) => p.user_id === userId,
    );

    if (!hasUserParticipated) {
        throw new ErrorResponse(
            403,
            "not_allowed",
            "user has not joined the event",
        );
    }

    return res
        .status(200)
        .json(new SuccessResponse(200, "event fetched", event));
});
