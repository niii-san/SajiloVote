import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    generateAccessToken,
    generateRefreshToken,
    SuccessResponse,
} from "../../utils/index.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";

/*
 * Function to handle requrest on /auth/refresh-token
 * req.body.refresh_token is need
 * new access token will be provided & also will be set in cookies
 *
 */

//TODO: need to make this token more secured
export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken =
            req.cookies?.refresh_token || req.body?.refresh_token;

        if (!refreshToken) {
            throw new ErrorResponse(
                401,
                "client_error",
                "refresh token is required",
            );
        }

        const secret = process.env.AUTH_REFRESH_TOKEN_SECRET_KEY;
        if (!secret) {
            throw new Error("secret failed to load or not found");
        }

        try {
            const decoded: any = jwt.verify(refreshToken, secret);
            const user = await User.findByPk(decoded?.id);

            if (!user) {
                throw new ErrorResponse(
                    404,
                    "not_found",
                    "user not found! invalid token",
                );
            }

            const newAccessToken = await generateAccessToken(user.user_id);
            const newRefreshToken = await generateRefreshToken(user.user_id);

            user.refresh_token = newRefreshToken;
            await user.save();

            return res
                .cookie("access_token", newAccessToken)
                .cookie("refresh_token", newRefreshToken)
                .status(200)
                .json(
                    new SuccessResponse(200, "token refreshed", {
                        new_access_token: newAccessToken,
                        new_refresh_token: newRefreshToken,
                    }),
                );
        } catch (error: any) {
            if (error?.message == "jwt expired") {
                return res
                    .clearCookie("access_token")
                    .clearCookie("refresh_token)")
                    .status(401)
                    .json(
                        new ErrorResponse(
                            401,
                            "auth_error",
                            "refresh token expired",
                        ).toJSON(),
                    );
            }
            res.clearCookie("access_token")
                .clearCookie("refresh_token")
                .status(401)
                .json(
                    new ErrorResponse(
                        401,
                        "auth_error",
                        "invalid refresh token",
                    ).toJSON(),
                );
        }
    },
);
