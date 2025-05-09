import { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/index.js";

/**
 * Error response format
 * _Status codes:_  **3xx**, **4xx**, **5xx**
 */
export class ErrorResponse extends Error implements ApiResponse {
    public status_code: number;
    public success: boolean;
    public error_code: number;
    public message: string;

    constructor(status_code: number, error_code: number, message: string) {
        super(message);
        this.status_code = status_code;
        this.success = false;
        this.error_code = error_code;
        this.message = message;
    }
    public toJSON() {
        return {
            status_code: this.status_code,
            error_code: this.error_code,
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
                910,
                `INTERNAL SERVER ERROR... ${err.message}`,
            ),
        );
    }
    return next();
};
