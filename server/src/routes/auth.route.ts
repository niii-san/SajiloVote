import { Router } from "express";
import { login, signup } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";
import { test } from "../controllers/test.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/test", authenticate, test);
