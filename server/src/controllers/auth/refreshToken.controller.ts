import { Request, Response } from "express";
import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";

/*
 * Function to handle requrest on /auth/refresh-token
 * req.body.refresh_token is need
 * new access token will be provided & also will be set in cookies
 *
 */

//TODO: need to make this token more secured
export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => { },
);
