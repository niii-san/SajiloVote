import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";

export const createEvent = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const eventTitle = req.body?.title ?? "";
        const eventDescription = req.body?.description ?? "";
        const eventType = (req.body?.type ?? "").trim().toUpperCase();
        const creatorId = req.user.id;
        const startType = (req.body?.start_type ?? "").trim().toUpperCase();
        const startAt = req.body?.start_at ?? "";
        const endType = (req.body?.end_type ?? "").trim().toUpperCase();
        const endAt = req.body?.end_at ?? "";
        const multiVote = req.body?.multi_vote;
        const anonymousVote = req.body?.anonymous_vote;

        const EVENT_TYPES = ["POLL", "VOTE"];
        const START_TYPE = ["IMMEDIATE", "MANUAL", "TIME"];
        const END_TYPE = ["MANUAL", "TIME"];

        // Field validations
        if (!eventTitle) {
            throw new ErrorResponse(400, "client", "Event title is required!");
        }
        if (!eventType) {
            throw new ErrorResponse(400, "client", "Event type is required!");
        }
        if (!EVENT_TYPES.includes(eventType)) {
            throw new ErrorResponse(
                400,
                "client",
                `Invalid Event type! ${eventType} is not an valid event type.`,
            );
        }
        if (!startType) {
            throw new ErrorResponse(
                400,
                "client",
                "Event start type is required!",
            );
        }
        if (!START_TYPE.includes(startType)) {
            throw new ErrorResponse(
                400,
                "client",
                `Invaild event start type! ${startType} is not an valid event start type.`,
            );
        }
        if (startType === "TIME") {
            if (!startAt) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "If event start type is 'TIME', Then event start time is required!",
                );
            }
            // TODO: validate if startAt is valid
        }

        if (!endType) {
            throw new ErrorResponse(
                400,
                "client",
                "Event end type is required!",
            );
        }

        if (!END_TYPE.includes(endType)) {
            throw new ErrorResponse(
                400,
                "client",
                `Invalid event end type! ${endType} is not an valid event end type.`,
            );
        }

        if (endType === "TIME") {
            if (!endAt) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "If event end type is 'TIME', then event end time is required!",
                );
            }
            // TODO: Validate the event endAT time
        }
        if (multiVote == undefined) {
            throw new ErrorResponse(
                400,
                "client",
                "Multi vote feature field is required!",
            );
        }
        if (typeof multiVote !== "boolean") {
            throw new ErrorResponse(
                400,
                "client",
                "Invalid multi vote feature field value! It must be boolean type.",
            );
        }

        if (anonymousVote == undefined) {
            throw new ErrorResponse(
                400,
                "client",
                "Anonymous feature field is required!",
            );
        }
        if (typeof anonymousVote !== "boolean") {
            throw new ErrorResponse(
                400,
                "client",
                "Invalid anonymous vote feature field value! It must be boolean type.",
            );
        }

        return res
            .status(200)
            .json(new SuccessResponse(200, "Event created", null));
    },
);
