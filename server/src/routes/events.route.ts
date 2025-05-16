import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { createEvent, getAllCreatedEvents } from "../controllers/index.js";

export const eventsRouter = Router();

eventsRouter.post("/", authenticate, createEvent);
eventsRouter.get("/me", authenticate, getAllCreatedEvents);
