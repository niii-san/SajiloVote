import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { Request, Response } from "express";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`EXPRESS ERROR: ${error}`);
        });
        app.listen(PORT, () => {
            console.log(`server running on PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error starting server`, err);
    });

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
