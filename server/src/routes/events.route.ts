import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { createEvent } from "../controllers/index.js";

export const eventsRouter = Router()


// create events
eventsRouter.post("/",authenticate,createEvent)
