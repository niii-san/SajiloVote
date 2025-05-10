import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import jwt from "jsonwebtoken";
import prisma from "../../db/prisma.js";
import { UserModel } from "../../models/user.model.js";
import { generateAccessToken } from "./tokens.js";

/*
 * Function to handle requrest on /auth/refresh-token
 * req.body.refresh_token is need
 * new access token will be provided & also will be set in cookies
 *
 */

export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = (req.body?.refresh_token ?? "").trim();

        if (!refreshToken) {
            throw new ErrorResponse(400, 4000, "Refresh token is required");
        }

        const jwtSecret = process.env.AUTH_REFRESH_TOKEN_SECRET_KEY;

        try {
            const decodedToken = jwt.verify(refreshToken, jwtSecret, {
                complete: true,
            });

            const payload = decodedToken.payload as UserModel;

            const user = await prisma.user.findFirst({
                where: { id: payload.id },
            });

            const decodedSavedToken = jwt.verify(
                user?.refresh_token!,
                jwtSecret,
                { complete: true },
            );

            // TODO: Suspend account in fibonacci sequenced hour
            if (decodedToken.signature !== decodedSavedToken.signature) {
                return res
                    .status(401)
                    .json(
                        new ErrorResponse(
                            401,
                            9615,
                            "Security threat detected! Account has been suspended",
                        ),
                    );
            }

            const newAccessToken = await generateAccessToken(user?.id!);

            return res
                .cookie("access_token", newAccessToken)
                .status(200)
                .json(
                    new SuccessResponse(200, "Token refreshed", {
                        access_token: newAccessToken,
                    }),
                );
        } catch (error: any) {
            if (error.message == "jwt expired") {
                throw new ErrorResponse(401, 4023, "Refresh token expired");
            } else {
                throw new ErrorResponse(401, 4000, "Invalid token");
            }
        }
    },
);
