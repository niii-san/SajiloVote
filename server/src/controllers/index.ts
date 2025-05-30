import { login } from "./auth/login.controller.js";
import { logout } from "./auth/logout.controller.js";
import { signup } from "./auth/signup.controller.js";
import { verifyToken } from "./auth/verifyToken.controller.js";
import { createEvent } from "./events/createEvent.controller.js";
import { hasCurrentUserJoinedEvent } from "./events/currentUserJoined.controller.js";
import { getAllCreatedEvents } from "./events/getAllCreatedEvents.controller.js";
import { getEventById } from "./events/getById.controller.js";
import { getEventParticipants } from "./events/getParticipants.controller.js";
import { joinEvent } from "./events/joinEvent.controller.js";
import { getCurrentUserData } from "./user/getCurrentUser.controller.js";

export {
    login,
    logout,
    signup,
    verifyToken,
    getCurrentUserData,
    createEvent,
    getAllCreatedEvents,
    getEventById,
    getEventParticipants,
    hasCurrentUserJoinedEvent,
    joinEvent,
};
