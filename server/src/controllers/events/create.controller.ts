import { Request, Response } from "express";
import {
    asyncHandler,
    SuccessResponse,
    ErrorResponse,
    isValidDate,
} from "../../utils/index.js";
import { User, Event } from "../../models/index.js";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const title: string = (req.body.title ?? "").trim();
    const description = req.body.description;
    const type = (req.body.type ?? "").trim();
    const startAt: string | "now" = req.body.start_at;
    const endAt: string = req.body.end_at;
    const userId = req.user?.user_id;

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

    if (startAt !== "now" && !isValidDate(startAt)) {
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

    // const event = await Event.create({
    //     title: title,
    //     description: description ?? "",
    //     type: type,
    //     creator_id: creator.user_id,
    //     start_at: startAt,
    //     end_at: endAt,
    // });
    //
    // creator.events_created?.push({ creator_id: creator.user_id });

    return res
        .status(201)
        .json(new SuccessResponse(200, "Event created: TEST PASSED", null));
});
