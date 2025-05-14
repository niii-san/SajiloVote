import { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/index.js";

/**
 * Error response format
 * _Status codes:_  **3xx**, **4xx**, **5xx**
 */

type ErrorType = "auth" | "session_expired" | "client" | "server" | "not_found";

export class ErrorResponse extends Error implements ApiResponse {
    public status_code: number;
    public success: boolean;
    public error_type: ErrorType;
    public message: string;

    constructor(status_code: number, error_type: ErrorType, message: string) {
        super(message);
        this.status_code = status_code;
        this.success = false;
        this.error_type = error_type;
        this.message = message;
    }
    public toJSON() {
        return {
            status_code: this.status_code,
            error_type: this.error_type,
            success: this.success,
            message: this.message,
        };
    }
}

export const errorHandler = (
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
                "server",
                `INTERNAL SERVER ERROR... ${err.message}`,
            ),
        );
    }
    return next();
};
