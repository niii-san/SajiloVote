import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const generateAccessToken = async (userId: number): Promise<string> => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("user not found to generate token");
    }

    const secret = process.env.AUTH_ACCESS_TOKEN_SECRET_KEY;

    if (!secret) {
        throw new Error("could not load secret or not found");
    }

    const token = jwt.sign(
        {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            created_at: user.created_at,
        },
        secret,
        { expiresIn: "2m" },
    );

    return token;
};

export const generateRefreshToken = async (userId: number): Promise<string> => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("user not found to generate token");
    }

    const secret = process.env.AUTH_REFRESH_TOKEN_SECRET_KEY;

    if (!secret) {
        throw new Error("could not load secret or not found");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        secret,
        { expiresIn: "5m" },
    );

    return token;
};
