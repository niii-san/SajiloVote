import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { asyncHandler, ErrorResponse } from "../utils/index.js";
import prisma from "../db/prisma.js";

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
            throw new ErrorResponse(401, 9000, "Token is required");
        }

        try {
            const decoded: any = jwt.verify(
                token,
                process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
            );

            const user = await prisma.user.findFirst({
                where: { id: decoded.id },
                omit: {
                    password: true,
                    refresh_token: true,
                },
            });
            if (!user) {
                throw new ErrorResponse(401, 9000, "Invalid token");
            }
            req.user = user;
            next();
        } catch (error: any) {
            if (error?.message == "jwt expired") {
                throw new ErrorResponse(401, 9009, "Access token expired");
            }
            throw new ErrorResponse(401, 9000, "Invalid token");
        }
    },
);
