import { NextFunction, Request, Response } from "express";

/**
 * **Wrapper function**
 * if some error occurss inside then,
 * it will be sent to next middleware _(error handler middleware)_
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => next(error));
    };
};
