import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    createEvent,
    getEvent,
    getEventsCreatedByCurrentUser,
    getPreviewEvent,
    joinEvent,
} from "../controllers/index.js";

export const eventsRouter = Router();

// create events
eventsRouter.post("/", authenticate, createEvent);

// get own created events
eventsRouter.get("/self", authenticate, getEventsCreatedByCurrentUser);

// get preview events
eventsRouter.get("/pre/:eventId", getPreviewEvent);

// join an event
eventsRouter.post("/:eventId/join", authenticate, joinEvent);

eventsRouter.get("/:eventId", authenticate, getEvent);
