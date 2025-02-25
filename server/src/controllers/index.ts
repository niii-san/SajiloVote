import { login } from "./auth/login.controller.js";
import { logout } from "./auth/logout.controller.js";
import { refreshAccessToken } from "./auth/refreshToken.controller.js";
import { signup } from "./auth/signup.controller.js";
import { verifyToken } from "./auth/verifyToken.controller.js";
import { getCurrentUserData } from "./auth/getCurrentUser.controller.js";
import { createEvent } from "./events/create.controller.js";
import {
    getEvent,
    getEventsCreatedByCurrentUser,
    getParticipatedEvents,
    getPreviewEvent,
} from "./events/get.controllers.js";
import { joinEvent } from "./events/join.controller.js";
import { voteForCandidate, voteForOption } from "./events/vote.controller.js";
import { deleteEvent } from "./events/delete.controller.js";
import {
    updateFirstName,
    updateLastName,
} from "./auth/updateNames.controller.js";

export {
    login,
    logout,
    signup,
    verifyToken,
    refreshAccessToken,
    createEvent,
    getCurrentUserData,
    getEventsCreatedByCurrentUser,
    joinEvent,
    getPreviewEvent,
    getEvent,
    voteForCandidate,
    voteForOption,
    getParticipatedEvents,
    deleteEvent,
    updateFirstName,
    updateLastName,
};
