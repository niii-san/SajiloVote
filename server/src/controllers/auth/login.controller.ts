import { User } from "../../models/user.model.js";
import {
    asyncHandler,
    ErrorResponse,
    generateAccessToken,
    SuccessfulResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const email: string = (req.body.email ?? "").trim().toLowerCase();
    const password: string = req.body.password || "";

    if (!email) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "email address is required",
        );
    }

    if (!password) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "password is required",
        );
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        throw new ErrorResponse(
            404,
            "not_found",
            false,
            "user not found with this email address",
        );
    }

    const token = await generateAccessToken(user.id);

    return res
        .status(200)
        .json(
            new SuccessfulResponse<{ token: string }>(
                200,
                false,
                "Test passed",
                { token: token },
            ),
        );
});
