import { UserType } from "./ModelsTypes.js";
import "express";

declare global {
    namespace Express {
        interface Request {
            user?: Omit<UserType, "password" | "refresh_token"> | null;
        }
    }
}
