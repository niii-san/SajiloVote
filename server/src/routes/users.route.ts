import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { getCurrentUserData } from "../controllers/index.js";

export const usersRouter = Router();
usersRouter.get("/current-user", authenticate, getCurrentUserData);
