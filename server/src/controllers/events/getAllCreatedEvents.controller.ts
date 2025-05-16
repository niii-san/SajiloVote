import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Response } from "express";
import { RequestWithContext } from "../../types/index.js";
import prisma from "../../db/prisma.js";
import _ from "lodash";

/**
 * @desc    Get all events creataed by the context user
 */
export const getAllCreatedEvents = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const user = req.user;
        const events = await prisma.event.findMany({
            where: { creator_id: user.id },
        });

        return res
            .status(200)
            .json(
                new SuccessResponse(
                    200,
                    `All events created by ${user.first_name} fetched.`,
                    events,
                ),
            );
    },
);
