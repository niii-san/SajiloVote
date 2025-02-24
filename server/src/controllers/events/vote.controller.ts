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
    VoteCandidate,
    VoteRecord,
} from "../../models/index.js";

export const voteForCandidate = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;
        const { eventId, voteCandidateId } = req.params;

        if (!userId) {
            throw new Error("server was not able to get user id");
        }

        if (isNaN(+eventId)) {
            throw new ErrorResponse(400, "client_error", "invalid event id");
        }
        if (isNaN(+voteCandidateId)) {
            throw new ErrorResponse(
                400,
                "client_error",
                "invalid vote candidate id",
            );
        }

        const event = await Event.findByPk(eventId, {
            include: [
                { model: EventParticipant, as: "event_participants" },
                { model: VoteCandidate, as: "vote_candidates" },
                { model: VoteRecord, as: "vote_records" },
            ],
        });

        if (!event) {
            throw new ErrorResponse(404, "not_found", "event not found");
        }

        if (event.type !== "vote") {
            throw new ErrorResponse(
                405,
                "not_allowed",
                "cannot vote to candidate in poll event",
            );
        }

        const hasUserParticipated = event.event_participants?.some(
            (p) => p.user_id === userId,
        );

        if (!hasUserParticipated) {
            throw new ErrorResponse(
                403,
                "not_allowed",
                "please join the event first",
            );
        }

        const hasUserAlreadyVoted = event.vote_records?.some(
            (p) => p.voter_id === userId,
        );

        if (hasUserAlreadyVoted) {
            throw new ErrorResponse(
                409,
                "already_exists",
                "you have already voted to a candidated in this event",
            );
        }

        const doesVoteCandidateExists = event.vote_candidates?.some(
            (c) => c.vote_candidate_id == Number(voteCandidateId),
        );

        if (!doesVoteCandidateExists) {
            throw new ErrorResponse(
                404,
                "not_found",
                "this event does not has the desired vote candidate id",
            );
        }

        const vote = await VoteRecord.create({
            event_id: event.event_id,
            voter_id: userId,
            voted_at: new Date(),
            voted_candidate_id: voteCandidateId,
        });

        return res
            .status(201)
            .json(new SuccessResponse(201, "vote successfull", vote));
    },
);

export const voteForOption = asyncHandler(
    async (req: Request, res: Response) => {
        const { eventId, optionId } = req.params;
        const userId = req.user?.user_id;

        if (!userId) {
            throw new Error("server was not able to get user id");
        }

        if (isNaN(+eventId)) {
            throw new ErrorResponse(400, "client_error", "invalid event id");
        }

        if (isNaN(+optionId)) {
            throw new ErrorResponse(400, "client_error", "invalid option id");
        }

        const event = await Event.findByPk(eventId, {
            include: [
                { model: PollOption, as: "poll_options" },
                { model: VoteRecord, as: "vote_records" },
                { model: EventParticipant, as: "event_participants" },
            ],
        });

        if (!event) {
            throw new ErrorResponse(404, "not_found", "event not found");
        }

        if (event.type !== "poll") {
            throw new ErrorResponse(
                405,
                "not_allowed",
                "cannot vote to option in vote event",
            );
        }

        const hasUserParticipated = event.event_participants?.some(
            (p) => p.user_id === userId,
        );

        const hasUserAlreadyVotedToOption = event.vote_records?.some(
            (r) => r.voter_id === userId,
        );

        if (!hasUserParticipated) {
            throw new ErrorResponse(
                403,
                "not_allowed",
                "please join the event first",
            );
        }

        if (hasUserAlreadyVotedToOption) {
            throw new ErrorResponse(
                409,
                "already_exists",
                "you have already voted to an option in this event",
            );
        }

        const doesOptionExists = event.poll_options?.some(
            (o) => o.poll_option_id == Number(optionId),
        );

        if (!doesOptionExists) {
            throw new ErrorResponse(
                404,
                "not_found",
                "this event does not has the desired option id",
            );
        }

        const vote = await VoteRecord.create({
            event_id: event.event_id,
            voter_id: userId,
            voted_at: new Date(),
            voted_option_id: optionId,
        });

        return res
            .status(201)
            .json(new SuccessResponse(201, "vote successfull", vote));
    },
);
