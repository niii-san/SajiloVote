import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { updateFirstName, updateLastName } from "../controllers/index.js";

export const accountRouter = Router();

accountRouter.put("/update/first-name", authenticate, updateFirstName);
accountRouter.put("/update/last-name", authenticate, updateLastName);
