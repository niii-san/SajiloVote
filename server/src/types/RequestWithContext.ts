import { Request } from "express";
import type { User } from "../models/index.js";

export interface RequestWithContext extends Request {
    user: Omit<User, "password">;
}
