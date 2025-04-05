import { login } from "./auth/login.controller.js";
import { logout } from "./auth/logout.controller.js";
import { refreshAccessToken } from "./auth/refreshToken.controller.js";
import { signup } from "./auth/signup.controller.js";
import { verifyToken } from "./auth/verifyToken.controller.js";
import { getCurrentUserData } from "./auth/getCurrentUser.controller.js";
import {
    updateFirstName,
    updateLastName,
} from "./user/updateNames.controller.js";
import { updateEmail } from "./user/updateEmail.controller.js";
import { updatePassword } from "./user/updatePassword.controller.js";

export {
    login,
    logout,
    signup,
    verifyToken,
    refreshAccessToken,
    getCurrentUserData,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePassword,
};
