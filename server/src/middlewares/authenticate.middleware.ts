import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { asyncHandler,ErrorResponse } from "../utils/index.js";
import { User } from "../models/index.js";

/**
 * **Authentication middleware**
 * This middleware will allow to pass only if:
 * _access_token is provided and is valid_
 */
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
                "access token is required",
            );
        }
        const secret = process.env.AUTH_ACCESS_TOKEN_SECRET_KEY;
        if (!secret) {
            throw new Error("failed to load secret or not found");
        }

        try {
            const decoded: any = jwt.verify(token, secret);
            const user = await User.findByPk(decoded.user_id, {
                attributes: { exclude: ["password", "refresh_token"] },
            });
            req.user = user;
            next();
        } catch (err: any) {
            if (err?.message == "jwt expired") {
                throw new ErrorResponse(401, "auth_error", "token expired");
            }
            throw new ErrorResponse(400, "auth_error", "invalid token");
        }
    },
);
