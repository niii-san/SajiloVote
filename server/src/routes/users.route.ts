import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
    updateEmail,
    updateFirstName,
    updateLastName,
    updatePassword,
} from "../controllers/index.js";

export const accountRouter = Router();

accountRouter.put("/update/first-name", authenticate, updateFirstName);
accountRouter.put("/update/last-name", authenticate, updateLastName);
accountRouter.put("/update/email", authenticate, updateEmail);
accountRouter.put("/update/password", authenticate, updatePassword);
