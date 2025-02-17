import { Router } from "express";
import {
    login,
    logout,
    refreshAccessToken,
    signup,
    verifyToken,
    getCurrentUserData,
} from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/verify-token", authenticate, verifyToken);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/user-data", authenticate, getCurrentUserData);
