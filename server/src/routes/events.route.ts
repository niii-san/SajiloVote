import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    createEvent,
    getEventsCreatedByCurrentUser,
    joinEvent,
} from "../controllers/index.js";

export const eventsRouter = Router();

// create events
eventsRouter.post("/", authenticate, createEvent);

// get own created events
eventsRouter.get("/self", authenticate, getEventsCreatedByCurrentUser);

// join an event
eventsRouter.post("/:eventId/join", authenticate, joinEvent);
