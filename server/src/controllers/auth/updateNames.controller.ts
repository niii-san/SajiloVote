import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { User } from "../../models/user.model.js";

export const updateFirstName = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;
        const newFirstName = (req.body.new_first_name ?? "").trim();

        if (!userId) {
            throw new Error("server was not able to get user id");
        }

        if (!newFirstName) {
            throw new ErrorResponse(
                400,
                "client_error",
                "new first name is required",
            );
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new ErrorResponse(404, "not_found", "user not found");
        }

        user.first_name = newFirstName;

        await user.save();

        return res.status(200).json(
            new SuccessResponse(200, "first name updated", {
                newFirstName: user.first_name,
            }),
        );
    },
);

export const updateLastName = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;
        const newLastName = (req.body.new_last_name ?? "").trim();

        if (!userId) {
            throw new Error("server was not able to get user id");
        }

        if (!newLastName) {
            throw new ErrorResponse(
                400,
                "client_error",
                "new last name is required",
            );
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new ErrorResponse(404, "not_found", "user not found");
        }

        user.last_name = newLastName;
        await user.save();

        return res.status(200).json(
            new SuccessResponse(200, "last name updated", {
                newLastName: user.last_name,
            }),
        );
    },
);
