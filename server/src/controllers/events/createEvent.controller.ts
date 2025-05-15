import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
    isDateValid,
    isObject,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";
import prisma from "../../db/prisma.js";
import _ from "lodash";

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

        const candidateOptions = req.body?.candidate_options;
        const pollOptions = req.body?.poll_options;

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
            if (!isDateValid(startAt)) {
                throw new ErrorResponse(
                    400,
                    "client",
                    `Invalid event start date! ${startAt} is not valid date`,
                );
            }
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
            if (!isDateValid(endAt)) {
                throw new ErrorResponse(
                    400,
                    "client",
                    `Invalid event end date! ${endAt} is not valid date`,
                );
            }
        }

        if (startType === "TIME" && endType === "TIME") {
            const startTimeInMs = new Date(startAt).getTime();
            const endTimeInMs = new Date(endAt).getTime();
            const fiveMinInMs = 300000;

            if (endTimeInMs - startTimeInMs < 0) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Event cannot be ended before started! Event end time is before event start time",
                );
            }

            if (endTimeInMs - startTimeInMs == 0) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Event cannot be started and ended in same time! Event start time and end time is same.",
                );
            }

            if (endTimeInMs - startTimeInMs < fiveMinInMs) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Event should be of at least 5 minutes",
                );
            }
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

        if (eventType === "POLL") {
            if (!pollOptions) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Poll options are required for Poll Event!",
                );
            }
            if (!Array.isArray(pollOptions)) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Invalid poll options data format!",
                );
            }

            if (pollOptions.length < 2) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "At least two poll option is required!",
                );
            }

            let isAllPollOptionsValid = false;

            // validating each poll option
            for (let i = 0; i < pollOptions.length; i++) {
                if (typeof pollOptions[i] === "string") {
                    isAllPollOptionsValid = true;
                } else {
                    isAllPollOptionsValid = false;
                    break;
                }
            }

            if (!isAllPollOptionsValid) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Invalid! One or more poll options data is invalid.",
                );
            }
        }

        // Validating the format of candidate options array for event type "VOTE"
        if (eventType === "VOTE") {
            if (!candidateOptions) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Candidate options is required for Vote Event!",
                );
            }

            if (!Array.isArray(candidateOptions)) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "Invalid candidate options data format!",
                );
            }

            if (candidateOptions.length < 2) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "At least two candidate options is required!",
                );
            }

            let isAllCandidateOptionsValid = true;

            // validating each field of candidate options
            for (let i = 0; i < candidateOptions.length; i++) {
                const item = candidateOptions[i];
                // Each item must be object. (not arrays too)
                if (!isObject(item)) {
                    isAllCandidateOptionsValid = false;
                    break;
                }

                const itemKeys = Object.keys(item);

                // no more than 2 keys
                if (itemKeys.length > 2) {
                    isAllCandidateOptionsValid = false;
                    break;
                }

                // option must have candidate_name field
                if (!_.has(item, "candidate_name")) {
                    isAllCandidateOptionsValid = false;
                    break;
                }
                // if there are 2 keys, then the second must be candidate_email
                if (itemKeys.length === 2 && !_.has(item, "candidate_email")) {
                    isAllCandidateOptionsValid = false;
                    break;
                }
            }

            if (!isAllCandidateOptionsValid) {
                throw new ErrorResponse(
                    400,
                    "client",
                    "One or more candidate options data is invalid!",
                );
            }
        }

        const startTime =
            startType === "IMMEDIATE"
                ? new Date().toISOString()
                : startType == "MANUAL"
                  ? null
                  : new Date(startAt).toISOString();

        const endTime =
            endType === "MANUAL" ? null : new Date(endAt).toISOString();

        const event = await prisma.event.create({
            data: {
                title: eventTitle,
                description: eventDescription,
                type: eventType,
                creator_id: creatorId,
                start_type: startType,
                start_at: startTime,
                end_type: endType,
                end_at: endTime,
                multi_vote: multiVote,
                anonymous_vote: anonymousVote,
            },
        });

        let createdPollOptions: {
            id: number;
            event_id: number;
            option_text: string;
        }[] = [];

        let createdCandidateOptions: {
            id: number;
            event_id: number;
            candidate_name: string;
            candidate_email: string | null;
        }[] = [];

        if (eventType === "POLL") {
            createdPollOptions = await Promise.all(
                pollOptions.map((item: string) =>
                    prisma.pollEventVoteOptions.create({
                        data: { event_id: event.id, option_text: item },
                    }),
                ),
            );
        }

        if (eventType === "VOTE") {
            createdCandidateOptions = await Promise.all(
                candidateOptions.map(
                    (item: {
                        candidate_name: string;
                        candidate_email?: string;
                    }) =>
                        prisma.voteEventCandidateOptions.create({
                            data: {
                                event_id: event.id,
                                candidate_name: item.candidate_name,
                                candidate_email: item.candidate_email ?? null,
                            },
                        }),
                ),
            );
        }

        return res.status(200).json(
            new SuccessResponse(200, "Event created successfully!", {
                ...event,
                poll_vote_options:
                    createdPollOptions.length === 0 ? null : createdPollOptions,
                candidate_vote_options:
                    createdCandidateOptions.length === 0
                        ? null
                        : createdCandidateOptions,
            }),
        );
    },
);
