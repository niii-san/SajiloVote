import jwt from "jsonwebtoken";
import prisma from "../../db/prisma.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";
import ms from "ms";

export const generateAccessToken = async (userId: number): Promise<string> => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
        omit: { password: true, refresh_token: true, updated_at: true },
    });
    if (!user) {
        throw new ErrorResponse(404, 4000, "token generation failed");
    }

    const jwtAccessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET_KEY;

    const jwtAccessExpiry = process.env
        .AUTH_ACCESS_TOKEN_EXPIRY as ms.StringValue;

    const token = jwt.sign(user, jwtAccessSecret, {
        expiresIn: jwtAccessExpiry,
    });

    return token;
};

export const generateRefreshToken = async (userId: number): Promise<string> => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
        omit: {
            password: true,
            refresh_token: true,
            updated_at: true,
        },
    });
    if (!user) {
        throw new ErrorResponse(404, 4000, "token generation failed");
    }
    const jwtRefreshSecret = process.env.AUTH_REFRESH_TOKEN_SECRET_KEY;

    const jwtRefreshExpiry = process.env
        .AUTH_REFRESH_TOKEN_EXPIRY as ms.StringValue;

    const token = jwt.sign(user, jwtRefreshSecret, {
        expiresIn: jwtRefreshExpiry,
    });

    return token;
};
