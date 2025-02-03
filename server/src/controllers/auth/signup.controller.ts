import {
    asyncHandler,
    ErrorResponse,
    SuccessfulResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";
import { User } from "../../models/index.js";
import type { UserType } from "../../types/index.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const first_name: string = (req.body.first_name ?? "").trim();
    const last_name: string = (req.body.last_name ?? "").trim();
    const email: string = (req.body.email ?? "").trim().toLowerCase();
    const password: string = req.body.password ?? "";

    if (!first_name) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "first name is required!",
        );
    }

    if (!last_name) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "last name is required!",
        );
    }

    if (!email) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "email address is required!",
        );
    }

    if (!password) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "password is required!",
        );
    }

    if (password.length < 8) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "password must be 8 characters or longer!",
        );
    }

    const user = await User.create({ first_name, last_name, email, password });

    return res
        .status(201)
        .json(
            new SuccessfulResponse<UserType>(
                201,
                false,
                "User creation, TEST PASSED",
                user,
            ),
        );
});
