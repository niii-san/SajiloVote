import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateAccessToken } from "./tokens.js";
import { cookieOptions } from "../../constants.js";
import { prisma } from "../../db/index.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const emailAddress = (req.body.email_address ?? "").trim().toLowerCase();
    const password = req.body.password;

    if (!emailAddress) {
        throw new ErrorResponse(400, 1000, "email_address is required");
    }
    if (!password) {
        throw new ErrorResponse(400, 1000, "password is required");
    }

    const user = await prisma.user.findFirst({
        where: { email_address: emailAddress },
    });

    if (!user) {
        throw new ErrorResponse(400, 1000, "invalid user or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ErrorResponse(400, 1000, "invalid user or password");
    }

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken },
    });

    return res
        .cookie("access_token", accessToken, cookieOptions)
        .cookie("refresh_token", refreshToken, cookieOptions)
        .status(200)
        .json(
            new SuccessResponse(200, "login success", {
                access_token: accessToken,
                refresh_token: refreshToken,
            }),
        );
});
