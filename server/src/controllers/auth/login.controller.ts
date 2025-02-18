import { User } from "../../models/user.model.js";
import {
    asyncHandler,
    ErrorResponse,
    generateAccessToken,
    generateRefreshToken,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { cookieOptions } from "../../constants.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const email: string = (req.body.email ?? "").trim().toLowerCase();
    const password: string = req.body.password || "";

    if (!email) {
        throw new ErrorResponse(
            400,
            "client_error",
            "email address is required",
        );
    }

    if (!password) {
        throw new ErrorResponse(400, "client_error", "password is required");
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        throw new ErrorResponse(404, "not_found", "invalid credentials");
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        throw new ErrorResponse(400, "client_error", "invalid credentials");
    }

    const accessToken = await generateAccessToken(user.user_id);
    const refreshToken = await generateRefreshToken(user.user_id);
    user.refresh_token = refreshToken;
    await user.save();

    return res
        .cookie("access_token", accessToken, cookieOptions)
        .cookie("refresh_token", refreshToken, cookieOptions)
        .status(200)
        .json(
            new SuccessResponse<{
                access_token: string;
                refresh_token: string;
            }>(200, "login successful", {
                access_token: accessToken,
                refresh_token: refreshToken,
            }),
        );
});
