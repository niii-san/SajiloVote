import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { User } from "../../models/user.model.js";

export const updateEmail = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    const newEmail = (req.body.new_email ?? "").trim().toLowerCase();

    if (!userId) {
        throw new Error("server was not able to get user id");
    }

    if (!newEmail) {
        throw new ErrorResponse(
            400,
            "client_error",
            "new email address is required",
        );
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new ErrorResponse(404, "not_found", "user not found");
    }

    user.email = newEmail;
    await user.save();

    return res
        .status(200)
        .json(
            new SuccessResponse(200, "email address updated", {
                new_email: user.email,
            }),
        );
});
