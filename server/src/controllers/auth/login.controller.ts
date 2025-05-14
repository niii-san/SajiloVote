import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "./tokens.js";
import { cookieOptions } from "../../constants.js";
import { prisma } from "../../db/index.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const emailAddress = (req.body.email_address ?? "").trim().toLowerCase();
    const password = req.body.password;

    if (!emailAddress) {
        throw new ErrorResponse(400, "client", "Email address is required");
    }
    if (!password) {
        throw new ErrorResponse(400, "client", "Password is required");
    }

    const user = await prisma.user.findFirst({
        where: { email_address: emailAddress },
    });

    if (!user) {
        throw new ErrorResponse(400, "client", "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ErrorResponse(400, "client", "Invalid email or password");
    }

    const accessToken = await generateAccessToken(user.id);

    return res
        .cookie("access_token", accessToken, cookieOptions)
        .status(200)
        .json(
            new SuccessResponse(200, "login success", {
                access_token: accessToken,
                userData: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email_address: user.email_address,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            }),
        );
});
