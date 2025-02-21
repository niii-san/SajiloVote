import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    createEvent,
    getEventsCreatedByCurrentUser,
} from "../controllers/index.js";

export const eventsRouter = Router();

// create events
eventsRouter.post("/", authenticate, createEvent);
eventsRouter.get("/self", authenticate, getEventsCreatedByCurrentUser);
