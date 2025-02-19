import { InferAttributes } from "@sequelize/core";
import {
    User,
    VoteRecord,
    VoteCandidate,
    PollOption,
} from "../models/index.js";

export type UserType = InferAttributes<User>;

export type PublicUserType = Omit<UserType, "password" | "refresh_token">;

export type PollOptionType = InferAttributes<PollOption>;
export type VoteCandidateType = InferAttributes<VoteCandidate>;
export type VoteRecordType = InferAttributes<VoteRecord>;
