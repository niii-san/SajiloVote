import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { User } from "../../models/user.model.js";

export const updatePassword = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.user_id;
        const oldPassword = req.body.old_password;
        const newPassword = req.body.new_password;

        if (!userId) {
            throw new Error("server was not able to get user id");
        }

        if (!oldPassword) {
            throw new ErrorResponse(
                400,
                "client_error",
                "old password is required",
            );
        }

        if (!newPassword) {
            throw new ErrorResponse(
                400,
                "client_error",
                "new password is required",
            );
        }

        if (newPassword.length < 8) {
            throw new ErrorResponse(
                400,
                "client_error",
                "new password should be atleast 8 characters long",
            );
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new ErrorResponse(404, "client_error", "user not found");
        }
        const hash = user.password;

        const passwordMatched = await bcrypt.compare(oldPassword, hash);

        if (!passwordMatched) {
            throw new ErrorResponse(400, "client_error", "invalid credentials");
        }

        user.password = newPassword;
        await user.save();

        return res
            .status(200)
            .json(new SuccessResponse(200, "password updated", null));
    },
);
