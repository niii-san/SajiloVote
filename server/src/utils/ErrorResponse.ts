import { Request, Response, NextFunction } from "express";
import type { ApiResponse, Reason } from "../types/index.js";

export class ErrorResponse extends Error implements ApiResponse {
    public status_code: number;
    public success: boolean;
    public reason: Reason;
    public is_authenticated: boolean;
    public message: string;

    constructor(
        status_code: number,
        reason: Reason,
        is_authenticated: boolean,
        message: string,
    ) {
        super(message);
        this.status_code = status_code;
        this.success = false;
        this.reason = reason;
        this.is_authenticated = is_authenticated;
        this.message = message;
    }
    public toJSON() {
        return {
            status_code: this.status_code,
            success: this.success,
            reason: this.reason,
            is_authenticated: this.is_authenticated,
            message: this.message,
        };
    }
}

export const responseErrorHandler = (
    err: Error,
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof ErrorResponse) {
        res.status(err.status_code).json(err.toJSON());
    } else {
        res.status(500).json(
            new ErrorResponse(
                500,
                "server_error",
                false,
                `INTERNAL SERVER ERROR... ${err.message}`,
            ),
        );
    }
    return next();
};
