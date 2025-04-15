import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { asyncHandler, ErrorResponse } from "../utils/index.js";

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
    },
);
