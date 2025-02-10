import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";
import jwt from "jsonwebtoken"

/*
 * Function to handle requrest on /auth/refresh-token
 * req.body.refresh_token is need
 * new access token will be provided & also will be set in cookies
 *
 */

//TODO:
export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken =
            req.cookies?.refresh_token || req.body?.refresh_token;

        if(!refreshToken){
            throw new ErrorResponse(400,"client_error",false,"refresh token is required")
        }


        try {
            
        } catch (error) {
            
        }



    },
);
