import { Request, Response, NextFunction } from "express";
import type { ApiResponse, Reason } from "../types/index.js";

/**
 * Error response format
 * _Status codes:_  **3xx**, **4xx**, **5xx**
 */
export class ErrorResponse extends Error implements ApiResponse {
    public status_code: number;
    public success: boolean;
    public reason: Reason;
    public message: string;

    constructor(status_code: number, reason: Reason, message: string) {
        super(message);
        this.status_code = status_code;
        this.success = false;
        this.reason = reason;
        this.message = message;
    }
    public toJSON() {
        return {
            status_code: this.status_code,
            success: this.success,
            reason: this.reason,
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
                `INTERNAL SERVER ERROR... ${err.message}`,
            ),
        );
    }
    return next();
};
