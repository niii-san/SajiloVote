import {
    asyncHandler,
    ErrorResponse,
    SuccessfulResponse,
} from "../../utils/index.js";
import { Request, Response } from "express";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const firstName: string = (req.body.firstName ?? "").trim();
    const lastName: string = (req.body.lastName ?? "").trim();
    const email: string = (req.body.email ?? "").trim().toLowerCase();
    const password: string = req.body.password ?? "";

    if (!firstName) {
        throw new ErrorResponse(
            400,
            "client_error",
            false,
            "first name is required!",
        );
    }

    if (!lastName) {
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

    return res
        .status(200)
        .json(
            new SuccessfulResponse<null>(
                200,
                false,
                "User creation, TEST PASSED",
                null,
            ),
        );
});
