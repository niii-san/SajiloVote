import { InferAttributes } from "@sequelize/core";
import { User } from "../models/user.model.ts";

export type UserType = InferAttributes<User>;
export interface PublicUserType {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    created_at?: Date;
    updated_at?: Date;
}
