import {
    asyncHandler,
    ErrorResponse,
    SuccessResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import { prisma } from "../../db/index.js";
import bcrypt from "bcrypt";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const firstName = (req.body?.first_name ?? "").trim();
    const lastName = (req.body?.last_name ?? "").trim();
    const emailAddress = (req.body?.email_address ?? "").trim();
    const password = req.body?.password ?? "";

    if (!firstName) {
        throw new ErrorResponse(400, 1000, "first_name is required");
    }

    if (!lastName) {
        throw new ErrorResponse(400, 1000, "last_name is required");
    }

    if (!emailAddress) {
        throw new ErrorResponse(400, 1000, "email_addres is required");
    }

    if (!password) {
        throw new ErrorResponse(400, 1000, "password is required");
    }

    if (password.length < 8) {
        throw new ErrorResponse(
            400,
            1000,
            "password must be 8 characters or longer",
        );
    }

    if (password.length > 20) {
        throw new ErrorResponse(
            400,
            1000,
            "password cannot be longer than 20 characters",
        );
    }

    const userAlreadyExistingWithEmail = await prisma.user.findFirst({
        where: { email_address: emailAddress },
    });

    if (userAlreadyExistingWithEmail) {
        throw new ErrorResponse(
            409,
            900,
            "user with this email address already exists",
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress,
            password: hashedPassword,
        },
    });

    return res
        .status(201)
        .json(new SuccessResponse(201, "user created", { user }));
});
