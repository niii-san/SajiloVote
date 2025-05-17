import jwt from "jsonwebtoken";
import prisma from "../../db/prisma.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";
import ms from "ms";

export const generateAccessToken = async (userId: string): Promise<string> => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
        omit: {
            password: true,
            suspended: true,
            suspended_till: true,
            updated_at: true,
        },
    });
    if (!user) {
        throw new ErrorResponse(404, "client", "token generation failed");
    }

    const jwtAccessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET_KEY;

    const jwtAccessExpiry = process.env
        .AUTH_ACCESS_TOKEN_EXPIRY as ms.StringValue;

    const token = jwt.sign(user, jwtAccessSecret, {
        expiresIn: jwtAccessExpiry,
    });

    return token;
};
