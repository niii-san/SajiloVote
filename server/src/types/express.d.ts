import { UserModel } from "../models/index.js";
import "express";
declare global {
    namespace Express {
        export interface Request {
            user?: UserModel;
        }
    }
}
