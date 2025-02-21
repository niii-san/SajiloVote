import { Request, Response } from "express";
import {
    asyncHandler,
    SuccessResponse,
    ErrorResponse,
    isValidDate,
} from "../../utils/index.js";
import { User, Event, PollOption, VoteCandidate } from "../../models/index.js";

/**
 * **_Requires Authentication🚀_**
 *
 * Create Event controller
 * used to create events
 */
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const title: string = (req.body.title ?? "").trim();
    const description = req.body.description;
    const type = (req.body.type ?? "").trim();
    const startAt: string | "immediate" = req.body.start_at;
    const endAt: string = req.body.end_at;
    const userId = req.user?.user_id;
    const voteCandidates = req.body?.vote_candidates ?? [];
    const pollOptions = req.body?.poll_options ?? [];

    if (!title) {
        throw new ErrorResponse(400, "client_error", "event title is required");
    }
    if (!type) {
        throw new ErrorResponse(400, "client_error", "event type is required");
    }
    if (type !== "poll" && type !== "vote") {
        throw new ErrorResponse(400, "invalid_payload", "invalid event type");
    }

    if (!startAt) {
        throw new ErrorResponse(
            400,
            "client_error",
            "event start time is required",
        );
    }
    if (!endAt) {
        throw new ErrorResponse(
            400,
            "client_error",
            "event end time is required",
        );
    }

    if (
        startAt !== "immediate" &&
        startAt !== "manual" &&
        !isValidDate(startAt)
    ) {
        throw new ErrorResponse(
            400,
            "invalid_payload",
            "invalid event start time",
        );
    }

    if (!isValidDate(endAt)) {
        throw new ErrorResponse(
            400,
            "invalid_payload",
            "invalid event end time",
        );
    }

    const creator = await User.findByPk(userId);
    if (!creator) {
        throw new ErrorResponse(404, "not_found", "user not found");
    }

    if (type === "vote") {
        if (!Array.isArray(voteCandidates)) {
            throw new ErrorResponse(
                400,
                "invalid_payload",
                "vote candidates should be an array",
            );
        }

        if (voteCandidates.length === 0) {
            throw new ErrorResponse(
                400,
                "client_error",
                "atleast one vote candidate is required",
            );
        }
        //TODO: Apply candidate obj validations
    }

    if (type === "poll") {
        if (!Array.isArray(pollOptions)) {
            throw new ErrorResponse(
                400,
                "invalid_payload",
                "poll options should be an array",
            );
        }

        if (pollOptions.length === 0) {
            throw new ErrorResponse(
                400,
                "client_error",
                "atleast one vote option is required",
            );
        }
        //TODO: Apply poll options obj validations
    }

    const start =
        startAt === "immediate"
            ? new Date()
            : startAt === "manual"
              ? null
              : new Date(startAt);

    const startType =
        startAt === "immediate"
            ? "immediate"
            : startAt === "manual"
              ? "manual"
              : "date";

    const event = await Event.create({
        title: title,
        description: description ?? "",
        type: type,
        creator_id: creator.user_id,
        start_at: start,
        start_type: startType,
        end_at: new Date(endAt),
    });

    if (!event) {
        throw new ErrorResponse(500, "server_error", "failed to create event");
    }

    if (type === "poll") {
        await Promise.all(
            pollOptions.map(({ option_text }: { option_text: string }) =>
                PollOption.create({ event_id: event.event_id, option_text }),
            ),
        );
    }

    if (type === "vote") {
        await Promise.all(
            voteCandidates.map(
                ({
                    candidate_name,
                    candidate_email,
                }: {
                    candidate_name: string;
                    candidate_email: string | null;
                }) =>
                    VoteCandidate.create({
                        event_id: event.event_id,
                        candidate_name,
                        candidate_email,
                    }),
            ),
        );
    }

    const createdEvent = await Event.findByPk(event.event_id, {
        include: ["vote_candidates", "poll_options"],
    });

    return res
        .status(201)
        .json(
            new SuccessResponse(
                200,
                "Event created: TEST PASSED",
                createdEvent,
            ),
        );
});
