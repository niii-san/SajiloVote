import { User } from "../models/user.model.js";

const generateAccessToken = async (userId: number): Promise<string | null> => {
    const user = await User.findByPk(userId);
    if (!user) {
        return null;
    }

    return "s";
};
