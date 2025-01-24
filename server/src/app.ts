import express, { Response, Request } from "express";
import { responseErrorHandler } from "./utils/ErrorResponse.js";

export const app = express();

/*
 * Routes
 */

// Default Route
app.get("/", async (req: Request, res: Response) => {
    const requestData = {
        request_from: {
            ip: req.ip || "Unknown IP",
            user_agent: req.headers["user-agent"] || "Unknown User Agent",
            timestamp: new Date().toISOString(),
        },
    };
    res.status(200).json(requestData);
});

// NOTE: Error response handler always at last after all route
app.use(responseErrorHandler);
