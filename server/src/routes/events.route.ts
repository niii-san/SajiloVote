import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    createEvent,
    deleteEvent,
    getEvent,
    getEventsCreatedByCurrentUser,
    getParticipatedEvents,
    getPreviewEvent,
    joinEvent,
    voteForCandidate,
    voteForOption,
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

// vote for option in poll event
eventsRouter.post(
    "/:eventId/option/:optionId/vote",
    authenticate,
    voteForOption,
);

// vote for candidate in vote event
eventsRouter.post(
    "/:eventId/candidate/:voteCandidateId/vote",
    authenticate,
    voteForCandidate,
);

// get all events that the user has joined/participated
eventsRouter.get("/participated", authenticate, getParticipatedEvents);

// get event for event room / after joining event
eventsRouter.get("/:eventId", authenticate, getEvent);
eventsRouter.delete("/:eventId", authenticate, deleteEvent);
