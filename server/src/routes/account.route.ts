import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { updateFirstName } from "../controllers/index.js";

export const accountRouter = Router();

accountRouter.use("/update/first-name", authenticate, updateFirstName);
