import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import type { UserType } from "../types/ModelsTypes.js";

export const authenticate = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        const token =
            req.cookies?.access_token ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            "";

        if (!token) {
            throw new ErrorResponse(
                401,
                "auth_error",
                false,
                "access token is required",
            );
        }
        const secret = process.env.AUTH_ACCESS_TOKEN_SECRET_KEY;
        if (!secret) {
            throw new Error("failed to load secret or not found");
        }

        try {
            const decoded: any = jwt.verify(token, secret);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password", "refresh_token"] },
            });

            //TODO:custom type for user
            // @ts-ignore
            req.user = user;
            next();
        } catch (err: any) {
            if (err?.message == "jwt expired") {
                throw new ErrorResponse(
                    401,
                    "auth_error",
                    false,
                    "token expired",
                );
            }
            throw new ErrorResponse(401, "auth_error", false, "invalid token");
        }
    },
);
