import express, { Response, Request } from "express";
import { errorHandler } from "./utils/ErrorResponse.js";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

export const app = express();

/*
 * Setups
 */

const corsOptions: CorsOptions = {
    credentials: true,
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/*
 * Routes
 */

// Home Route
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

import { authRouter, eventsRouter, accountRouter } from "./routes/index.js";
// Auth routing
app.use("/api/v1/auth", authRouter);

// Events routing
app.use("/api/v1/events", eventsRouter);

// Account routing
app.use("/api/v1/users", accountRouter);

// Error handle middlewarer at last after all route
app.use(errorHandler);
