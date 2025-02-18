import { Request, Response } from "express";
import { asyncHandler, SuccessResponse } from "../../utils/index.js";
import { User } from "../../models/index.js";
import type { UserType } from "../../types/ModelsTypes.js";

export const getCurrentUserData = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req?.user?.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password", "refresh_token"] },
        });

        return res
            .status(200)
            .json(
                new SuccessResponse<UserType>(200, "user data fetched", user),
            );
    },
);
