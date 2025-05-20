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
 * @desc    Get event by id
 */
export const getEventById = asyncHandler(
    async (req: RequestWithContext, res: Response) => {
        const id = req.params.id;

        if (typeof id !== "string") {
            throw new ErrorResponse(400, "client", "Invalid event id!");
        }

        const event = await prisma.event.findFirst({
            where: { id: id },
            omit: { password: true },
            include: {
                creator: {
                    omit: {
                        password: true,
                        email_address: true,
                        created_at: true,
                        updated_at: true,
                        suspended: true,
                        suspended_till: true,
                    },
                },
            },
        });

        return res
            .status(200)
            .json(
                new SuccessResponse(200, `Event of id ${id} fetched.`, event),
            );
    },
);
