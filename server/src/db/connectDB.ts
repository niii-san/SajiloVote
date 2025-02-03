import { Sequelize } from "sequelize";
import { dbConfig } from "../config/index.js";

export const sequelize = new Sequelize(dbConfig);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        if (process.env.RUNTIME === "dev") {
            await sequelize.sync({ force: true, alter: true });
            console.log("Tables synced");
        }
        Promise.resolve();
    } catch (error) {
        Promise.reject(error);
    }
}
