import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    createEvent,
    getAllCreatedEvents,
    getEventById,
    getEventParticipants,
} from "../controllers/index.js";

export const eventsRouter = Router();

eventsRouter.post("/", authenticate, createEvent);
eventsRouter.get("/me", authenticate, getAllCreatedEvents);
eventsRouter.get("/:id", authenticate, getEventById);
eventsRouter.get("/:eventId/participants", authenticate, getEventParticipants);
