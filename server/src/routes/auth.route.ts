import { Router } from "express";
import {
    login,
    logout,
    signup,
    verifyToken,
} from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/verify-token", authenticate, verifyToken);
